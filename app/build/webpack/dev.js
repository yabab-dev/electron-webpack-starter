const merge = require('webpack-merge');
const base = require('./base');

module.exports = merge(base, {
  devtool: 'eval-source-map',
});
