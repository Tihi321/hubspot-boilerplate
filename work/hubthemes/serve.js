const {
  PAGE,
  TARGET,
} = process.env;

const browserSync = require('browser-sync');
const rp = require('request-promise');
const hubspotConfig = require('./hubspot.config.json');

const {
  apiKey,
  pages,
} = hubspotConfig;

function getFile(id) {
  const options = {
    method: 'GET',
    uri: `http://api.hubapi.com/content/api/v2/templates/${id}?hapikey=${apiKey}`,
  };

  return rp(options);
}

const pageName = (PAGE) || 'homepage';

// Dev Server
const proxyUrl = (TARGET) || 'http://127.0.0.1:8080';

if (TARGET) {

  const hubfiles = pages[pageName];
  const {
    css,
    js,
  } = hubfiles.files;
  
  const jsRewrite = [];
  
  let showCss = {
    rule: {
      match: /<\/head>/i,
      fn(snippet, match) {
        return snippet + match;
      },
    },
  };
  
  const jsRegex = new Promise((resolve) => {
    getFile(js.id).then((body) => {
  
      const { path } = JSON.parse(body);
  
      const regVal = `<script .*${path.replace('.js', '')}.*.js.*></script>`;
      const regex = new RegExp(regVal);
      jsRewrite.push({
        match: regex,
        fn() {
          return '<script src="/application.js"></script>';
        },
      });
      resolve();
    }).catch(() => resolve());
  });
  
  const cssRegex = new Promise((resolve) => {
    getFile(css.id).then((body) => {
      const { path } = JSON.parse(body);
  
      const regVal = `<link.*${path.replace('.css', '')}.*.css.*>`;
      const regex = new RegExp(regVal);
  
      showCss = {
        rule: {
          match: regex,
          fn(snippet) {
            return `<link rel="stylesheet" type="text/css" href="/application.css"/>${snippet}`;
          },
        },
      };
  
      resolve();
    }).catch(() => resolve());
  });
  
  Promise.all([jsRegex, cssRegex]).then(() => {
    browserSync.init({
      proxy: {
        target: proxyUrl,
      },
      serveStatic: [`./theme/custom/public/${pageName}/assets`],
      files: ['./theme/custom/public/**'],
      snippetOptions: showCss,
      rewriteRules: jsRewrite,
      ghostMode: {
        scroll: true,
      },
      open: true,
    });
  });
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
