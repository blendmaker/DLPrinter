import { Subject } from 'rxjs'
import { ipcRenderer, ipcMain } from 'electron'

export class IpcMainSubject extends Subject<IpcMessageInterface> {
    constructor (private _sendFunc: (channel: string, msg: any)=>void) {
        super();
        ipcMain.on('message', (e:Event, args:string) => {
            this.next(JSON.parse(args));
        });
    }

    public send(message: IpcMessageInterface) {
        const msg = JSON.stringify(message);
        this._sendFunc('message', msg);
    }
}

export class IpcRendererSubject extends Subject<IpcMessageInterface> {
    constructor () {
        super();
        ipcRenderer.on('message', (e:Event, args: string) => {
            this.next(JSON.parse(args));
        });
    }

    send(message: IpcMessageInterface) {
        const msg = JSON.stringify(message);
        ipcRenderer.send('message', msg);
    }
}

export interface IpcMessageInterface {
    cmd: '' | 'asdf' ;
    data: any;
}