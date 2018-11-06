const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const fs = require('fs');
const settings = loadLocalSettings();
const ipc = electron.ipcMain;
const Xml2Js = require('xml2js');

const express = require('express');
const expressWs = require('express-ws');

let mainWindow;
let expp; // Express app object
//let ws; // Websocket object
let builder = new Xml2Js.Builder();
let timer;
let layers;

function init() {
    createServer();
    createWindow();
}

function createServer() {
    expp = express();
    //ws = expressWs(expp);
    expressWs(expp);

    expp.ws('/', function(ws, req){
        ws.on('message', function(msg){
            msg = JSON.parse(msg);
            
            if (msg.cmd == 'color') {
                mainWindow.webContents.send(msg.color);
            } else if (msg.cmd == 'layer') {
                loadSvg('wuerfel.svg');
                setTimeout(tickPrint, 100);
            } else if (msg.cmd == 'text') {
                mainWindow.webContents.send(msg.cmd, { 'msg' : msg.text });
            } else if (msg.cmd == 'settings') {
                saveLocalSettings(msg.settings);
            }
        });
    });

    expp.use(express.static(path.join(__dirname, 'server')));
    expp.get('/settings', function(req, res){ res.send(settings); });
    expp.listen(settings.port.value, function() { console.log('Express listening on ' + settings.port.value); });
}

function loadSvg(fn) {
    let xml = fs.readFileSync(__dirname + '/example_files/' + fn);
    Xml2Js.parseString(xml, function(err, data){
        if (err) {
            console.log(err);
            return;
        }
        layers = data.svg.g;
        mainWindow.webContents.send('center', { 'w' : data.svg.$.width, 'h' : data.svg.$.height });
    });
}

function tickPrint() {
    mainWindow.webContents.send('svg-layer', { 'layer' : 
        builder.buildObject(layers[0]).replace('<root', '<g').replace('</root', '</g')
    });
    layers.shift();
    mainWindow.webContents.send('text', { 'msg' : layers.length + ' Layers left.' });

    if (! layers.length <= 0) {
        setTimeout(tickPrint, 100);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
        useContentSize: true,
        resizable: false,
    });
    //mainWindow.setFullScreen(true);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'projector', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    // Emitted when the window is closed.
    mainWindow.on('closed', function() { mainWindow = null;  })
}

ipc.on('input', function(e,a){
    /*mainWindow.webContents.send('white');
    mainWindow.webContents.send('text', { 'msg' : 'Das ist ein Test'});*/
});

// Electron-quick-start template functions
app.on('ready', init)
app.on('window-all-closed', function() { if (process.platform !== 'darwin') { app.quit() } })
app.on('activate', function() { if (mainWindow === null) { createWindow() } })

function loadLocalSettings(){
    try {
        fs.statSync(app.getPath('userData') + '/dlprinter.config.json');
    } catch (err) {
        if (err.code == 'ENOENT') {
            let tmpSettings = require('./dlprinter.config.json');
            saveLocalSettings(tmpSettings);
        } else if (err !== null) {
            console.log('An error occured when trying to create local settings. Aborting launch.');
            console.log('Errorcode: ', err.code);
        }
    }
    return JSON.parse(fs.readFileSync(app.getPath('userData') + '/dlprinter.config.json'));
}

// TODO error handling when folder not writeable
function saveLocalSettings(s) {
    fs.writeFileSync(app.getPath('userData') + '/dlprinter.config.json', JSON.stringify(s, null, 2));
}

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