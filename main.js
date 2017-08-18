const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const settings = require('./dlprinter.config.json');

const express = require('express');

let mainWindow;
let expp; // Express app object

function init() {
  createServer();
  createWindow();
}

function createServer () {
  expp = express();
  expp.use(express.static(path.join(__dirname, 'server')));
  expp.listen(settings.port, function(){ console.log('Express listening on ' + settings.port); });
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
  })
  //mainWindow.setFullScreen(true);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'projector', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () { mainWindow = null })
}

// Electron-quick-start template functions
app.on('ready', init)
app.on('window-all-closed', function () { if (process.platform !== 'darwin') { app.quit() } })
app.on('activate', function () { if (mainWindow === null) { createWindow() } })


/*
echo 1 > /sys/class/gpio/gpio12/value
echo 0 > /sys/class/gpio/gpio11/value
echo 0 > /sys/class/gpio/gpio6/value
echo 0 > /sys/class/gpio/gpio1/value
echo 0 > /sys/class/gpio/gpio0/value
echo 0 > /sys/class/gpio/gpio3/value
*/

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//require "SERVER"