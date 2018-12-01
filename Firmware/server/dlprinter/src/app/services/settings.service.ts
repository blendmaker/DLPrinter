import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private _settingsData: any;
    constructor(webSocketService: WebSocketService) {}

    getSettingsData() {

    }
}
