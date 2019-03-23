const browserSync = require('browser-sync');
const rp = require('request-promise');
const hubspotConfig = require('./hubspot.config.json');
const nodeArguments = require('minimist')(process.argv.slice(2));

const {
  apiKey,
  pages,
  workingPage,
} = hubspotConfig;

const publicPath = '/theme/custom/public';

function getFile(id) {
  const options = {
    method: 'GET',
    uri: `http://api.hubapi.com/content/api/v2/templates/${id}?hapikey=${apiKey}`,
  };

  return rp(options);
}

const pageName = (nodeArguments.page) || workingPage;

// Dev Server
const proxyUrl = (nodeArguments.target) || 'http://127.0.0.1:8080';

if (nodeArguments.target) {

  const hubfiles = pages[pageName];
  const {
    css,
    js,
  } = hubfiles.files;

  let jsRegex;
  let cssRegex;
  const jsRewrite = [];
  let showCss;


  if (js.useLocal) {
  
    jsRegex = new Promise((resolve) => {
      getFile(js.id).then((body) => {
    
        const { path } = JSON.parse(body);
    
        const regVal = `<script .*${path.replace('.js', '')}.*.js.*></script>`;
        const regex = new RegExp(regVal);
        jsRewrite.push({
          match: regex,
          fn() {
            return `<script src="${publicPath}/${pageName}/assets/application.js"></script>`;
          },
        });
        resolve();
      }).catch(() => resolve());
    });
  
  }

  if (css.useLocal) {
  
    showCss = {
      rule: {
        match: /<\/head>/i,
        fn(snippet, match) {
          return snippet + match;
        },
      },
    };
    
    cssRegex = new Promise((resolve) => {
      getFile(css.id).then((body) => {
        const { path } = JSON.parse(body);
    
        const regVal = `<link.*${path.replace('.css', '')}.*.css.*>`;
        const regex = new RegExp(regVal);
    
        showCss = {
          rule: {
            match: regex,
            fn(snippet) {
              return `<link rel="stylesheet" type="text/css" href="${publicPath}/${pageName}/assets/application.css"/>${snippet}`;
            },
          },
        };
    
        resolve();
      }).catch(() => resolve());
    });

  }

  const init = {
    proxy: {
      target: proxyUrl,
    },
    serveStatic: ['./'],
    files: ['./theme/custom/public/**'],
    ghostMode: {
      scroll: true,
    },
    open: true,
  };

  // using css & js.
  if (jsRegex && cssRegex) {
    Promise.all([jsRegex, cssRegex]).then(() => {
      browserSync.init(Object.assign(init, {
        rewriteRules: jsRewrite,
        snippetOptions: showCss,
      }));
    });
    return;
  }

  if (jsRegex) {
    Promise.all([jsRegex]).then(() => {
      browserSync.init(Object.assign(init, {
        rewriteRules: jsRewrite,
      }));
    });
    return;
  }
  
  if (cssRegex) {
    Promise.all([cssRegex]).then(() => {
      browserSync.init(Object.assign(init, {
        snippetOptions: showCss,
      }));
    });
  }
  
} else {

  browserSync.init({
    proxy: {
      target: proxyUrl,
    },
    files: ['./theme/custom/public/**', './theme/custom/views/**/*.html'],
    ghostMode: {
      scroll: true,
    },
    open: true,
  });

}
