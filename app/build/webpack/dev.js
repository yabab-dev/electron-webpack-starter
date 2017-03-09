const merge = require('webpack-merge');
const conf = require('../conf');
const base = require('./base');

module.exports = merge(base, {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: conf.dist,
  },
});
