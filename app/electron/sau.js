const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs-extra');
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
 * Return Promise and have a progress callback
 */
function downloadUpdate(progress) {
  const source = sauConfig.update.asar;
  const writeStream = nodeFs.createWriteStream(`${sauConfig.asarPath}.gz`);
  const urlInfos = url.parse(source);

  return new Promise((resolve, reject) => {
    let req;


    if (/^http:/.test(urlInfos.protocol)) {
      req = http.request({
    		host: urlInfos.host,
    		port: urlInfos.port || 80,
    		path: urlInfos.path
      });
    } else {
      req = https.request({
  			host: srcUrl.host,
  			port: srcUrl.port || 443,
  			path: srcUrl.path
      });
    }

    req.on('response', res => {
      const len = parseInt(res.headers['content-length'], 10);

      let current = 0;

      res.on('data', function (chunk) {
  			writeStream.write(chunk);
        current += chunk.length;
        if (typeof progress === 'function') {
          progress(current, len);
        }
  		});

  		res.on('error', function (err) {
  			reject(err);
  		});

  		res.on('end', function () {
  			writeStream.end();
  			resolve();
      });

    });

    req.end();
  });
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
