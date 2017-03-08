const path = require('path');
const packager = require('electron-packager');

const conf = require('../app/build/conf');

const options = {
  arch: 'x64',
  asar: true,
  dir: conf.dist,
  out: path.join(conf.dist, '../builds'),
  overwrite: true,
  platform: process.env.PLATFORM_TARGET || 'all',
  icon: path.join(__dirname, '../icons/icon'),
  prune: false,
};

packager(options, (err, appPaths) => {
  if (err) {
    console.error('ERROR : ' + err.message);
    return;
  }
  console.log('Electron package successful !');
});
