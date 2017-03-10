const path = require('path');

let conf = {
  // Main paths
  app: path.join(__dirname, '../'),
  dist: path.join(__dirname, '../../dist/app'),

  // Dev settings
  dev: {
    port: 9100,
  },

  // Modules to put in vendor bundle
  vendor: [
    'vue',
    'vue-router',
  ],

  // Modules to exclude from webpack
  externals: [

  ],
};

// SAU dependencies
conf.externals = conf.externals || [];
conf.externals.push(
  'electron',
  'original-fs',
  'fs-extra',
  'request',
  'request-progress'
);

module.exports = conf;
