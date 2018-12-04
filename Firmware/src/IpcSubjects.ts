import { Subject } from 'rxjs'
import { ipcRenderer, ipcMain } from 'electron'
import { MessageInterface } from './IpcWsMessages/MessageInterface';

export class IpcMainSubject extends Subject<MessageInterface> {
    constructor (private _sendFunc: (channel: string, msg: any)=>void) {
        super();
        ipcMain.on('message', (e:Event, args:string) => {
            this.next(JSON.parse(args));
        });
    }

    public send(message: MessageInterface) {
        const msg = JSON.stringify(message);
        this._sendFunc('message', msg);
    }
}

export class IpcRendererSubject extends Subject<MessageInterface> {
    constructor () {
        super();
        ipcRenderer.on('message', (e:Event, args: string) => {
            this.next(JSON.parse(args));
        });
    }

    send(message: MessageInterface) {
        const msg = JSON.stringify(message);
        ipcRenderer.send('message', msg);
    }
}
