export class Settings {
    private _data: object;
    private _fs = require('fs');
    //private _homeDir: string;
    
    constructor(private homeDir: string, clearToDefaults: boolean = false) {
        let fExists : boolean = false;
        try {
            this._fs.statSync(homeDir + '/dlprinter.config.json');
            fExists = true;
        } catch (err) {
            if (err.code == 'ENOENT') {
                //let tmpSettings = require('./dlprinter.config.json');
                //saveLocalSettings(tmpSettings);
            } else if (err !== null && err.code !== 'ENOENT') {
                console.log('An error occured when trying to create local settings. Aborting launch.');
                console.log('Errorcode: ', err.code);
            }
        }

        if (clearToDefaults || !fExists) {
            let tmpSettings = require('../dlprinter.config.json');
            this.setSettingsData(tmpSettings);
        }

        this._data = JSON.parse(this._fs.readFileSync(homeDir + '/dlprinter.config.json').toString());
    }

    // TODO error handling when folder not writeable
    public setSettingsData(data: any, saveToDisk: boolean = true) {
        this._data = data;
        if (saveToDisk) {
            this._fs.writeFileSync(this.homeDir + '/dlprinter.config.json', JSON.stringify(data, null, 2));
        }
    }

    public getSettingsData():any {
        return this._data;
    }
}