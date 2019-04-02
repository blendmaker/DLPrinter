import { Subject } from 'rxjs'
import { ipcRenderer, ipcMain } from 'electron'
import { Message } from './interfaces/Message';

export class IpcMainSubject extends Subject<Message> {
    constructor (private _sendFunc: (channel: string, msg: any)=>void) {
        super();
        ipcMain.on('message', (e:Event, args:string) => {
            this.next(JSON.parse(args));
        });
    }

    public send(message: Message) {
        const msg = JSON.stringify(message);
        this._sendFunc('message', msg);
    }
}

export class IpcRendererSubject extends Subject<Message> {
    constructor () {
        super();
        ipcRenderer.on('message', (e:Event, args: string|Message) => {
            if (typeof args === 'string') {
                args = JSON.parse(args) as Message;
            }
            this.next(args);
        });
    }

    public send(message: Message) {
        const msg = JSON.stringify(message);
        ipcRenderer.send('message', msg);
    }
}
