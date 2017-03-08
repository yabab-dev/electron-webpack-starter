// Electron entry point
const path = require('path');
const {
  app,
  BrowserWindow,
} = require('electron');
const sau = require('./sau');

const devMode = process.env.NODE_ENV === 'development';

let config = {};
let mainWindow;

if (devMode) {
  // Webpack dev server
  const conf = require('../build/conf');
  config.url = `http://localhost:${conf.dev.port}`;

} else {
  // Built sources
  let appPath = path.join(__dirname, '../');
  config.devtron = false;
  config.url = `file://${appPath}/index.html`;
}

function createWindow() {
  if (mainWindow) return;

  // Create main window
  mainWindow = new BrowserWindow();

  if (devMode) {
    // Open devtools
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    });
  }

  // Load app
  mainWindow.loadURL(config.url);

  // Clear window variable if closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// When all windows are closed
app.on('window-all-closed', () => {
  // Exit electron app
  app.quit();
});

// When electron is ready
app.on('ready', createWindow);
