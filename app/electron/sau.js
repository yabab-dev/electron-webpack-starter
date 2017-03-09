const fs = require('fs-extra');
const request = require('request');
const progress = require('request-progress');
const zlib = require('zlib');
const path = require('path');
const nodeFs = require('original-fs');
const { app } = require('electron');

const defaultAppPath = path.resolve(__dirname, '../');
const appDataPath = app.getPath('userData');

let sauConfig = {
  path: defaultAppPath,
  main: 'electron/main',
  asarPath: path.join(appDataPath, 'app.asar'),
  update: {
    package: 'http://domain.com/package.json',
    asar: 'http://domain.com/app.asar',
    fallback: 'http://domain.com/update.json',
  },
};

/**
 * Set configuration
 */
function setConfig(config) {
  sauConfig = Object.assign(sauConfig, config);
}

/**
 * getCurrentVersion()
 */
function getCurrentVersion() {
  let packageData = require(path.join(sauConfig.path, 'package.json'));
  return packageData.version;
}

/**
 * Boot with downloaded version or not
 */
function boot(config) {
  if (config) {
    setConfig(config);
  }

  const updatedAsar = getUpatedAsarPath();

  if (updatedAsar) {
    try {
      let appPath = path.join(updatedAsar, sauConfig.main);
      require(appPath);
      sauConfig.path = updatedAsar;

      console.log('[SAU] Updated start');
      return;
    } catch (err) {
      // Nothing, normal start
      console.error(err);
    }
  }

  console.log('[SAU] Normal start');
  require(path.join(sauConfig.path, sauConfig.main));
}

/**
 * Unzip app.asar.gz if exists in application data folder.
 * If so remove gz file, if not return false
 */
function unzipUpdate() {
  const gzPath = sauConfig.asarPath + '.gz';
  return new Promise((resolve, reject) => {

    if (fs.existsSync(gzPath)) {
      // Read gzip
      nodeFs.readFile(gzPath, (err, gzipContent) => {
        if (err) return reject(err);

        // Unzip
        zlib.unzip(gzipContent, (err, content) => {
          if (err) return reject(err);

          // Write unziped content
          nodeFs.writeFile(sauConfig.asarPath, content, (err, content) => {
            if (err) return reject(err);

            // Remove gzip file
            fs.removeSync(gzPath);

            resolve(true);
          });
        });
      });

    // Update gz doesnt exists
    } else {
      resolve(false);
    }
  });
}

/**
 * Check if updated app.asar is presents
 * If so return app.asar file path, if not return false
 */
function getUpatedAsarPath() {
  // Check if asar update exists
  if (fs.existsSync(sauConfig.asarPath)) {
    // Return his path
    return sauConfig.asarPath;
  }
  return false;
}

/**
 * Check if new version is available
 */
function checkUpdate() {
  let currentVersion = getCurrentVersion();
  return new Promise((resolve, reject) => {
    // Get distant version
    request(
      // Request
      {
        uri: sauConfig.update.package,
        timeout: 1000
      },
      // Response
      (err, response, body) => {
        if (err) return reject(err);

        let updateVersion = null;

        try {
          let updatePackage = JSON.parse(body);
          updateVersion = updatePackage.version;
        } catch (err) {
          return reject(err);
        }

        if (!currentVersion || updateVersion != currentVersion) {
          resolve(updateVersion);
        } else {
          resolve(false);
        }
      }
    );
  });
}

/**
 * Download update
 * Return request-progress : https://www.npmjs.com/package/request-progress
 */
function downloadUpdate() {
  const writeStream = nodeFs.createWriteStream(`${sauConfig.asarPath}.gz`);
  const downloadProgress = progress(request(sauConfig.update.asar));
  downloadProgress.pipe(writeStream);
  return downloadProgress;
}

module.exports = {
  boot,
  setConfig,
  getCurrentVersion,
  getUpatedAsarPath,
  checkUpdate,
  downloadUpdate,
  unzipUpdate,
};
