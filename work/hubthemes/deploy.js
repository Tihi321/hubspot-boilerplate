/* eslint-disable no-console */
/* eslint-disable camelcase */
const chalk = require('chalk');
const rp = require('request-promise');
const fs = require('fs');
const nodePath = require('path');

const config = require('./hubspot.config.json');

const { PAGE } = process.env;

const {
  apiKey,
  pages,
} = config;

if (!PAGE || !pages[PAGE]) {
  return console.error(chalk.red('Page do not exist'));
}

Object.keys(pages[PAGE].files).forEach((file) => {
  const thisFile = pages[PAGE].files[file];

  if (!thisFile.id) {
    return console.error(chalk.red(`Please give your ${file} file an ID in config.json`));
  }

  fs.readFile(nodePath.join(__dirname, thisFile.path), (err, data) => {
    if (err) {
      return console.error(chalk.red(err));
    }


    const source = JSON.stringify({
      source: data.toString(),
    });

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
});
