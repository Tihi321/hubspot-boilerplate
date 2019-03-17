/* global process __dirname */
const DEV = process.env.NODE_ENV !== 'production';
const {
  PAGE,
} = process.env;

const nodePath = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const appPath = `${nodePath.resolve(__dirname)}`;

// Theme
const themePath = 'theme/custom';
const themePublicPath = `${themePath}/public`;
const themeFullPath = `${appPath}/${themePath}`;

const themePagesFullPath = `${themeFullPath}/assets/views`;
const themePublicFullPath = `${themeFullPath}/public`;


// homepage

const pageName = (PAGE) || 'homepage';

const pageEntry = `${themePagesFullPath}/${pageName}/index.js`;
const pageOutput = `${themePublicFullPath}/${pageName}`;

// Outputs
const outputType = '[name]';
const outputJs = `assets/${outputType}.js`;
const outputCss = `assets/${outputType}.css`;
const outputFile = `${outputType}.[ext]`;
const outputImages = `assets/images/${outputFile}`;
const outputFonts = `assets/fonts/${outputFile}`;

const externals = (function() {
  const ext = {};
  ext.jquery = 'jQuery';
  return ext;
})();

// All loaders to use on assets.
const allModules = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.json$/,
      exclude: /node_modules/,
      use: 'file-loader',
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
      exclude: [/fonts/, /node_modules/],
      use: `file-loader?name=${outputImages}`,
    },
    {
      test: /\.(eot|otf|ttf|woff|woff2|svg)$/,
      exclude: [/images/, /node_modules/],
      use: `file-loader?name=${outputFonts}`,
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader', 'postcss-loader', 'sass-loader',
      ],
    },
  ],
};

// All plugins to use.
const allPlugins = [

  // Convert JS to CSS.
  new MiniCssExtractPlugin({
    filename: outputCss,
  }),

  // Gives you jQuery with in the webpack so no need for impoting it.
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),

];

// General optimisations.
const allOptimizations = {
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  },
};

// Use only for production build
if (!DEV) {
  allOptimizations.minimizer = [

    // Optimise for production.
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false,
        },
        compress: {
          warnings: false,
          drop_console: true, // eslint-disable-line camelcase
        },
      },
    }),
  ];

}

// default modules
const modules = {
  context: nodePath.join(__dirname),

  // Don't bundle jQuery but expect it from a different source.
  externals,

  optimization: allOptimizations,

  module: allModules,

  plugins: allPlugins,

  devtool: DEV ? '' : 'source-map',
};

// Add webpack output.
const pageModules = Object.assign({}, modules, {
  entry: {
    application: [pageEntry],
  },
  output: {
    path: pageOutput,
    publicPath: themePublicPath,
    filename: outputJs,
  },
});

// Delete homepage public folder.
pageModules.plugins.push(new CleanWebpackPlugin([pageOutput]));
pageModules.plugins.push(new CopyWebpackPlugin([

  // Find jQuery in node_modules and copy it to public folder
  {
    from: `${appPath}/node_modules/jquery/dist/jquery.min.js`,
    to: `${pageOutput}/assets/vendors`,
  },
]));




module.exports = [
  pageModules,
];
