const path = require('path');
const package = require('../../package.json');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const EslintFriendlyFormatter = require('eslint-friendly-formatter');

const conf = require('../conf');

// Phaser webpack config
var phaserModule = path.join(conf.app, 'node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/phaser.js');
var pixi = path.join(phaserModule, 'build/pixi.js');
var p2 = path.join(phaserModule, 'build/p2.js')

// Bundles entries
let entry = {
  vendor: conf.vendor,
  app: path.join(conf.app, 'src/index.js'),
};

// Delete vendor if empty
if (!conf.vendor || !conf.vendor.length) {
  delete entry.vendor;
}

// Webpack config
module.exports = {
  target: 'electron-renderer',
  entry: entry,
  output: {
    pathinfo: true,
    path: conf.dist,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'sau': '../electron/sau',
      'pixi': pixi,
      'p2': p2,
      'phaser': phaser,
      'phaser-ce': phaser,
    },
  },
  module: {
    exprContextCritical: false,
    rules: [
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] },
      { test: /phaser\.js$/, use: ['expose-loader?Phaser'] },
      {
        test: /\.(js|html)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [
          path.join(conf.app, 'src'),
        ],
        options: {
          formatter: EslintFriendlyFormatter,
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(conf.app, 'src')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'src/assets/[name].[ext]',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'src/fonts/[name].[ext]',
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
    ]
  },
  externals: [
    function(context, request, callback) {
      if (conf.externals.indexOf(request) >= 0) {
        return callback(null, `require('electron').remote.require('${request}')`)
      }
      callback();
    },
  ],
  plugins: [
    new HtmlWebpackPlugin({
      title: package.productName || package.name || 'App',
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(conf.app, 'electron'),
        to: path.join(conf.dist, 'electron'),
      },
      {
        from: path.resolve(conf.app, 'assets'),
        to: path.join(conf.dist, 'assets'),
      },
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
}
