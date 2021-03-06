import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { Settings } from './Settings';
import { PrintRunner } from './PrintRunner';
import { FileMeta } from './Interfaces/FileMeta';
import { format as urlFormat } from 'url';
import * as expressWs from 'express-ws';
import * as express from 'express';
import { IpcMainSubject } from './IpcSubjects'
import { Message } from './Interfaces/Message';
import { forkJoin } from 'rxjs';
import { unlink } from 'fs';

const expApp = express();
const settings = new Settings();
const printRunner = new PrintRunner(layerCallback);
let ipc: IpcMainSubject;

let mainWindow : BrowserWindow;

function init() {
  setupServer();
  setupWindow();
  setupIpc();
}

function layerCallback(currentLayer: string) {

}

function setupServer() {
  // TODO 3 of 4 communication parts went to other classes... a better approach for this? investigate...
  expressWs(expApp).app.ws('/', (ws, req: express.Request) => {
    ws.on('message', (input:string) => {
      let msg: Message = JSON.parse(input);
      const wsSend = (data : Message) => {
        ws.send(JSON.stringify(data));
      }

      // some commands will be redirected directly
      switch (msg.cmd) {
        case 'color' :
        case 'text' :
          ipc.send(msg);
          break;
        case 'get-settings' :
          msg.data = settings.getSettingsData();
          wsSend(msg);
          break;
        case 'set-settings' :
          settings.setSettingsData(msg.data);
          msg.cmd = 'get-settings';
          wsSend(msg); // propably useless... it is somekind of success message
          break;
        case 'reset-settings' :
          msg.cmd = 'get-settings';
          msg.data = settings.resetToDefaults();
          wsSend(msg);
          break;
        case 'get-files' :
          forkJoin(
            printRunner.getLocalFiles( printRunner.svgDir ),
            printRunner.getLocalFiles( printRunner.modelDir ),
            printRunner.getLocalFiles( printRunner.gcodeDir )
            // TODO handle custom folders
          ).subscribe( files => {
            const data: FileMeta[] = [];
            files.forEach( element => data.push(...element) );
            msg.data = data;
            wsSend(msg);
          });
          break;
        case 'delete-file' :
          forkJoin(
            printRunner.getLocalFiles( printRunner.svgDir ),
            printRunner.getLocalFiles( printRunner.modelDir ),
            printRunner.getLocalFiles( printRunner.gcodeDir )
            // TODO handle custom folders
          ).subscribe( files => {
            const data: FileMeta[] = [];
            files.forEach( element => data.push(...element) );
            data.forEach( (file, i, arr) => {
              if ( (file.path) === (msg.data.path) ) {
                unlink( file.path, (err) => err? console.error(err) : null );
                arr.splice(i, 1);
                return null;
              }
            });
            msg.cmd = 'get-files';
            msg.data = data;
            wsSend(msg);
          });
          break;
        case 'file-upload' :
          break;
        case 'light' :
          printRunner.triggerLight(); // no break for new state
        case 'heartbeat' :
          msg.cmd = 'state';
          msg.data = printRunner.getState();
          wsSend(msg);
          break;
        case 'layer' :
          let svgSize = printRunner.loadSvg(settings.getHome() + '/svg/example_cube.svg');
          ipc.send({ cmd: 'center', data: { 'w' : svgSize.width, 'h' : svgSize.height }});
          printRunner.startPrint();
          break;
      }
    });
  });

  expApp.use(express.static(path.join(__dirname, '..', 'server', 'dist')));
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
  ipc = new IpcMainSubject(mainWindow.webContents.send.bind(mainWindow.webContents));
  ipc.subscribe((msg: Message) => {
    switch (msg.cmd) {
      case '' : break;
    }
  });
}

// Electron-quick-start template functions
app.on('ready', init);
app.on('window-all-closed', function() { if (process.platform !== 'darwin') { app.quit() } });
app.on('activate', function() { if (mainWindow === null) { setupWindow() } });

/*
echo 1 > /sys/class/gpio/gpio12/value
echo 0 > /sys/class/gpio/gpio11/value
echo 0 > /sys/class/gpio/gpio6/value
echo 0 > /sys/class/gpio/gpio1/value
echo 0 > /sys/class/gpio/gpio0/value
echo 0 > /sys/class/gpio/gpio3/value
*/
