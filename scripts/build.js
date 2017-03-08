const path = require('path');
const fs = require('fs-extra');
const asar = require('asar');
const zlib = require('zlib');
const exec = require('child_process').exec;

const conf = require('../app/build/conf');
const utils = require('./utils');

// Clean dist
fs.removeSync(conf.dist);

// Exec webpack
const webpackBuild = exec(`cd ${conf.app}; npm run build`);

webpackBuild.stdout.on('data', data => console.log(data));
webpackBuild.on('exit', () => {

  // Read package.json
  const packageData = require(path.join(conf.app, 'package.json'));

  // Write light package to dist
  let packageLight = {
    name: packageData.name,
    productName: packageData.productName,
    bundleId: packageData.bundleId,
    version: packageData.version,
    main: packageData.main,
    author: packageData.author,
    dependencies: {},
    devDependencies: {
      electron: packageData.devDependencies.electron,
    },
  };

  // Copy node modules
  if (conf.externals && conf.externals.length) {
    const deps = utils.modulesDependencies(conf.externals);
    deps.forEach(module => {
      packageLight.dependencies[module] = '*';
      const modulePath = path.join(conf.app, 'node_modules/' + module);

      fs.copySync(modulePath, path.join(conf.dist, 'node_modules/' + module), {
        filter: (src, dest) => {
          let stats = fs.statSync(src);

          if (stats.isFile()) {
            // Only JS & CSS files (Warning : need more tests on this)
            // if (!/\.js$/.test(src) && !/\.css/.test(src)) return false;

          // Directories
          } else if (stats.isDirectory()) {
            // Do not include .bin directories
            if (/\.bin/.test(src)) return false;

            // Do not include sub node_modules
            if (src.match(/node_modules/g).length > 1) {
              return false;
            }
          }

          return true;
        }
      });

    });
  }

  // Dist package.json
  fs.writeFileSync(path.join(conf.dist, 'package.json'), JSON.stringify(packageLight, null, '  '));

  // Build asar file
  const asarDest = path.join(conf.dist, '../app.asar');
  asar.createPackage(conf.dist, asarDest, function() {
    fs.writeFileSync(path.join(conf.dist, '../package.json'), JSON.stringify(packageLight));
    console.log('Build is ready');

    zlib.gzip(fs.readFileSync(asarDest), (err, result) => {
      if (err) throw err;
      fs.writeFileSync(asarDest + '.gz', result);
      console.log('Build compressed');
    });
  });

});
