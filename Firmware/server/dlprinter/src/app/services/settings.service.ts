import { filter, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { SettingsData } from '../../../../../src/Settings';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { MessageInterface } from '../../../../../src/IpcWsMessages/MessageInterface';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private settings: SettingsData;
    private settingsReceived: BehaviorSubject<SettingsData> = new BehaviorSubject(null);

    constructor(private ws: WebSocketService) {
        ws.subscribe((msg: MessageInterface) => {
            switch (msg.cmd) {
              case 'get-settings' :
                this.settings = msg.data;
                this.settingsReceived.next(this.settings);
                break;
            }
        });
        ws.connected.pipe(
            filter( connected => connected ),
            first()
        ).subscribe( () => {
            ws.send({ cmd: 'get-settings' });
        });
    }

    public resetSettingsData() {
        this.ws.send({ cmd: 'reset-settings' });
    }

    public getSettingsData(): BehaviorSubject<SettingsData> {
        return this.settingsReceived;
    }

    public setSettingsData(settings: SettingsData | null): void {
        if ( settings ) {
            this.settings = settings;
        }
        this.ws.send({
            cmd : 'set-settings',
            data : this.settings,
        });
    }

    // method propably worthless after all
    public setSetting(name: string, value: any) {
        if (this.settings[name] !== undefined) {
            this.settings[name] = value;

            // TODO return value only validates existence of key in settings, not that it acutally got saved in the meantime
            this.ws.send({ cmd : 'set-settings', data : this.settings, });
            return true;
        }
        return false;
    }
}
