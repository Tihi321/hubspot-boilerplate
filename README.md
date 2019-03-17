# Hubspot boilerplate

This boilerplate is adapted from https://github.com/Absanater/hubspot-frontend-local, moved to webpack merged with local hubl server and expanded so you can use it for multiple pages.

This repository contains starting point to local Hubspot development along with local hubl server. At the moment it is not possible to run custom modules from local server, thou you can create these modules in hubl html page using hubspot modules and include them.

For online development you need to use pages that are html not hubspot page templates. And if you need to work on modules, you can import module to html page using hubl inside hubspot and serve that page to Browsersync.

## Who do I talk to?

For questions talk to:

* [tknox.de@gmail.com](tknox.de@gmail.com)

## Getting started
Working directory is work/hubthemes

## Development Start

Builds assets in watch mode using Webpack.

```bash
npm start
```

## Browser sync

BrowserSync to sync assets and enable easy cross-device testing. If you omit variable PAGE it will default to homepage, though you can change that in the serve.js file. TARGET is address from hubspot online preview page. If you omit TARGET it will default to address of local hubspot server.

```bash
PAGE=name_of_the_page TARGET=address_of_hubspot_page npm serve
```

## Build

Builds production ready assets

```bash
npm run build
```

## Deploy

Deploy files to hubspot, page is name of the page from hubspot config under pages.

```bash
PAGE=name_of_the_page npm run deploy
```

## Local server

Local hubl server can be run from bin folder. It can be used for localy testing hubl code. It is set to serve work/hubthemes/theme directory

```bash
sh local-hubl-server
```


 [Tihomir Selak](https://github.com/Tihi321)
