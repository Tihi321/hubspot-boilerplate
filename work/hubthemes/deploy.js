/* eslint-disable no-console */
/* eslint-disable camelcase */
const chalk = require('chalk');
const rp = require('request-promise');
const fs = require('fs');
const nodePath = require('path');
const nodeArguments = require('minimist')(process.argv.slice(2));

const config = require('./hubspot.config.json');

const {
  apiKey,
  pages,
  workingPage,
} = config;

const pageName = nodeArguments.page || workingPage;

if (!pages[pageName]) {
  return console.error(chalk.red('Page do not exist'));
}

Object.keys(pages[pageName].files).forEach((file) => {
  const thisFile = pages[pageName].files[file];

  if (thisFile.useLocal) {
    if (!thisFile.id) {
      return console.error(chalk.red(`Please give your ${file} file an ID in hubspot.config.json`));
    }
  
    fs.readFile(nodePath.join(__dirname, thisFile.path), (err, data) => {
      if (err) {
        return console.error(chalk.red(err));
      }
      let source;

      if (file === 'js') {

        // escape hubl variables & macros syntax from script as all {{ something }} or {% something %}, in script hubspot treats as hubl command.
        const regexMac = new RegExp(/({%(.*)%})/gi);
        const removeMacros = data.toString().replace(regexMac, '{% raw %}$&{% endraw %}');
        const regexVar = new RegExp(/({{(.*)}})/gi);
        const removeVariables = removeMacros.replace(regexVar, '{% raw %}$&{% endraw %}');

        source = JSON.stringify({
          source: removeVariables,
        });
  
      } else {
        source = JSON.stringify({
          source: data.toString(),
        });
      }
  
      const options = {
        method: 'PUT',
        uri: `https://api.hubapi.com/content/api/v2/templates/${thisFile.id}?hapikey=${apiKey}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: source,
      };
  
      rp(options)
        .then((body) => {
          const {
            label,
            folder_id,
            path,
          } = JSON.parse(body);
    
          console.log(chalk.yellow(`
          File: ${folder_id}
          Label: ${label}
          At: ${path}`), chalk.green(`
          Successfully updated`));
  
        })
        .catch((err) => {
          return console.error('Upload Failed:', err);
        });
  
    });
  }
});
