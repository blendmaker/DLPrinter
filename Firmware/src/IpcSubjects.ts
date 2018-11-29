import { BehaviorSubject, Observer } from 'rxjs'
import { ipcRenderer, ipcMain } from 'electron'

export class IpcMainSubject extends BehaviorSubject<object> {
    //private _sendFunc: (channel: string, msg: any)=>void;

    constructor (private _sendFunc: (channel: string, msg: any)=>void) {
        super({});
        ipcMain.on('message', (e:Event, args:string) => {
            this.next(JSON.parse(args));
        });
    }

    public setSendFunc(func: (channel: string, msg: any)=>void) {
        this._sendFunc = func;
    }

    public send(msg: string|any) {
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        this._sendFunc('message', msg);
    }
}

export class IpcRendererSubject extends BehaviorSubject<any> {
    constructor () {
        super({});
        ipcRenderer.on('message', (e:Event, args: string) => {
            this.next(JSON.parse(args));
        });
    }

    send(object: any) {
        if (typeof object !== 'string') {
            object = JSON.stringify(object);
            ipcRenderer.send('message', object);
        }
    }
}