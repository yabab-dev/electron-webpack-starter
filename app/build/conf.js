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

  ],

  // Modules to exclude from webpack
  externals: [

  ],
};

// SAU dependencies
conf.externals = conf.externals || [];
conf.externals.push(
  'original-fs',
  'fs-extra'
);

module.exports = conf;
