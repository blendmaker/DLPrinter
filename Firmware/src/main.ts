import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { Settings } from './Settings'
import { PrintRunner } from './PrintRunner'
import { format as urlFormat } from 'url';
import * as expressWs from 'express-ws';
import * as express from 'express';
import { IpcMainSubject, IpcMessageInterface } from './IpcSubjects'

const expApp = express();
const settings = new Settings();
const printRunner = new PrintRunner(layerCallback);
let ipc;

let mainWindow : BrowserWindow;

console.log(app.getPath('userData'));

function init() {
    setupServer();
    setupWindow();
    setupIpc();
}

function layerCallback(currentLayer: string) {

}

function setupServer() {
    // TODO 3 of 4 communication parts went to other classes... a better approach for this? invest...
    expressWs(expApp).app.ws('/', (ws, req: express.Request) => {
        ws.on('message', (input:string) => {
            let msg = JSON.parse(input);
            
            if (msg.cmd == 'color') {
                mainWindow.webContents.send(msg.color);
            } else if (msg.cmd == 'layer') {
                let svgSize = printRunner.loadSvg(app.getPath('userData') + '/files/svgs/example_cube.svg');
                mainWindow.webContents.send('center', { 'w' : svgSize.width, 'h' : svgSize.height });
                printRunner.startPrint();
            } else if (msg.cmd == 'text') {
                mainWindow.webContents.send(msg.cmd, { 'msg' : msg.text });
            } else if (msg.cmd == 'get-settings') {
                ws.send(settings.getSettingsData());
            } else if (msg.cmd == 'set-settings') {
                settings.setSettingsData(msg.settings);
            } else if (msg.cmd == 'heartbeat') {
                ws.send(JSON.stringify(printRunner.getState()));
            }
        });
    });

    expApp.use(express.static(path.join(__dirname, '..', 'server', 'dist')));
    //expApp.get('/settings', (req:any, res:any) => { res.send(settings.getSettingsData()); });
    expApp.get('*', (req, res, next) => { res.sendFile(path.join(__dirname, '..', 'server', 'dist', 'index.html')); });
    expApp.listen(settings.getSettingsData().port, function() { console.log('Express listening on ' + settings.getSettingsData().port); });
}

function setupWindow() {
    mainWindow = new BrowserWindow({
        /*width: 1280,
        height: 720,*/
        autoHideMenuBar: true,
        useContentSize: true,
        resizable: false,
    });
    //mainWindow.setFullScreen(true);
    mainWindow.loadURL(urlFormat({
        pathname: path.join(__dirname, '..', 'projector', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    // Emitted when the window is closed.
    mainWindow.on('closed', function() { mainWindow = undefined; });
}

function setupIpc() {
    ipc = new IpcMainSubject(mainWindow.webContents.send);
    ipc.subscribe((msg: IpcMessageInterface) => {
        switch (msg.cmd) {
            case 'asdf' : break;
        }
    });
}

// Electron-quick-start template functions
app.on('ready', init)
app.on('window-all-closed', function() { if (process.platform !== 'darwin') { app.quit() } })
app.on('activate', function() { if (mainWindow === null) { setupWindow() } })

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
