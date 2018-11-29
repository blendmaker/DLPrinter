import { app } from "electron";

export class Settings {
    private _data: object;
    private _fs = require('fs');
    private _homeDir: string;
    
    constructor(clearToDefaults: boolean = false) {
        let fExists : boolean = false;
        this._homeDir = app.getPath('userData');

        try {
            this._fs.statSync(this._homeDir + '/dlprinter.config.json');
            fExists = true;
        } catch (err) {
            if (err !== null && err.code !== 'ENOENT') {
                console.log('An error occured when trying to create local settings. Aborting launch.');
                console.log('Errorcode: ', err.code);
            }
        }

        if (clearToDefaults || !fExists) {
            let tmpSettings = require('../dlprinter.config.json');
            this.setSettingsData(tmpSettings);
        }

        this._data = JSON.parse(this._fs.readFileSync(this._homeDir + '/dlprinter.config.json').toString());
    }

    // TODO error handling when folder not writeable
    public setSettingsData(data: any, saveToDisk: boolean = true) {
        this._data = data;
        if (saveToDisk) {
            this._fs.writeFileSync(this._homeDir + '/dlprinter.config.json', JSON.stringify(data, null, 2));
        }
    }

    public getSettingsData():any {
        return this._data;
    }
}