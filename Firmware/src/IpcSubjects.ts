import { BehaviorSubject, Observer } from 'rxjs'
import { IpcMain, IpcRenderer } from 'electron'

export class IpcMainSubject extends BehaviorSubject<object> {
    private _sendFunc: (channel: string, msg: any)=>void;

    constructor (private ipc: IpcMain) {
        super({});
        ipc.on('message', (e:Event, args:string) => {
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
    constructor (private ipc: IpcRenderer) {
        super('');
        ipc.on('message', (e:Event, args: string) => {
            this.next(JSON.parse(args));
        });
    }

    send(object: any) {
        if (typeof object !== 'string') {
            object = JSON.stringify(object);
        }
    }
}