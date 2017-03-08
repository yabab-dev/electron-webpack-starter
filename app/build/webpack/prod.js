const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./base');

module.exports = merge(base, {
  devtool: false,
  output: {
    pathinfo: false,
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
  ],
});
