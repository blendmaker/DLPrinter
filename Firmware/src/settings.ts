import { app, remote } from "electron";

export class Settings {
    private data: SettingsData;
    private fs = require('fs');

    // FIXME: Electron doesn't like the main.js to be somewhere other than root. Dirty fix to the wrong homeDir
    private homeDir = (app !== undefined)?
        app.getPath('userData').replace('Electron', 'DLPrinter'):
        remote.app.getPath('userData').replace('Electron', 'DLPrinter');
    
    constructor(resetToDefaults: boolean = false) {
        if (! this.fs.existsSync(this.homeDir)) { this.fs.mkdirSync(this.homeDir); }
        let fExists : boolean = false;

        try {
            this.fs.statSync(this.homeDir + '/dlprinter.config.json');
            fExists = true;
        } catch (err) {
            if (err !== null && err.code !== 'ENOENT') {
                console.error('An error occured when trying to create local settings. Aborting launch.');
                console.error('Errorcode: ', err.code);
            }
        }

        if (resetToDefaults || !fExists) {
            let tmpSettings = require('../dlprinter.config.json');
            this.setSettingsData(tmpSettings);
        }

        this.data = JSON.parse(this.fs.readFileSync(this.homeDir + '/dlprinter.config.json').toString());
    }

    public resetToDefaults(): SettingsData {
        let tmpSettings = require('../dlprinter.config.json');
        this.setSettingsData(tmpSettings);
        return this.data;
    }

    // TODO error handling when folder not writeable
    // TODO validate settings to be a valid SettingsData instance
    public setSettingsData(data: SettingsData, saveToDisk: boolean = true): void {
        this.data = data;
        if (saveToDisk) {
            this.fs.writeFileSync(this.homeDir + '/dlprinter.config.json', JSON.stringify(data, null, 2));
        }
    }

    public getSettingsData():SettingsData {
        return this.data;
    }

    public getHome() {
        return this.homeDir;
    }
}

export interface SettingsData {
    port: number;
    phys_width: number;
    phys_height: number;
    endstop_idle_state: string|number;
    endstop_triggered_state: string|number;
    max_layer_height: number,
    min_layer_height: number,
    max_burn_time: number,
    min_burn_time: number,
    slicers : [
        { name : string, path : string, }],
    z_max: number;
    z_min_speed: number;
    z_max_speed: number;
    z_acceleration: number;
    z_steps: number;
    security: boolean;
}
