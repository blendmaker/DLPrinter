import { app } from "electron";

export class Settings {
    private _data: SettingsData;
    private _fs = require('fs');
    private _homeDir = app.getPath('userData').replace('Electron', 'DLPrinter');
    
    constructor(clearToDefaults: boolean = false) {
        let fExists : boolean = false;
        this._homeDir = app.getPath('userData');

        try {
            this._fs.statSync(this._homeDir + '/dlprinter.config.json');
            fExists = true;
        } catch (err) {
            if (err !== null && err.code !== 'ENOENT') {
                console.error('An error occured when trying to create local settings. Aborting launch.');
                console.error('Errorcode: ', err.code);
            }
        }

        if (clearToDefaults || !fExists) {
            let tmpSettings = require('../dlprinter.config.json');
            this.setSettingsData(tmpSettings);
        }

        this._data = JSON.parse(this._fs.readFileSync(this._homeDir + '/dlprinter.config.json').toString());
    }

    // TODO error handling when folder not writeable
    public setSettingsData(data: SettingsData, saveToDisk: boolean = true) {
        this._data = data;
        if (saveToDisk) {
            this._fs.writeFileSync(this._homeDir + '/dlprinter.config.json', JSON.stringify(data, null, 2));
        }
    }

    public getSettingsData():SettingsData {
        return this._data;
    }

    public getHome() {
        return this._homeDir;
    }
}

export interface SettingsData {
    port: number;
    phys_width: number;
    phys_height: number;
    endstop_idle_state: string|number;
    endstop_triggered_state: string|number;
    z_max: number;
    z_min_speed: number;
    z_max_speed: number;
    z_acceleration: number;
    z_steps: number;
    security: boolean;
}