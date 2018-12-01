"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var Settings = /** @class */ (function () {
    function Settings(clearToDefaults) {
        if (clearToDefaults === void 0) { clearToDefaults = false; }
        this._fs = require('fs');
        var fExists = false;
        this._homeDir = electron_1.app.getPath('userData');
        try {
            this._fs.statSync(this._homeDir + '/dlprinter.config.json');
            fExists = true;
        }
        catch (err) {
            if (err !== null && err.code !== 'ENOENT') {
                console.log('An error occured when trying to create local settings. Aborting launch.');
                console.log('Errorcode: ', err.code);
            }
        }
        if (clearToDefaults || !fExists) {
            var tmpSettings = require('../dlprinter.config.json');
            this.setSettingsData(tmpSettings);
        }
        this._data = JSON.parse(this._fs.readFileSync(this._homeDir + '/dlprinter.config.json').toString());
    }
    // TODO error handling when folder not writeable
    Settings.prototype.setSettingsData = function (data, saveToDisk) {
        if (saveToDisk === void 0) { saveToDisk = true; }
        this._data = data;
        if (saveToDisk) {
            this._fs.writeFileSync(this._homeDir + '/dlprinter.config.json', JSON.stringify(data, null, 2));
        }
    };
    Settings.prototype.getSettingsData = function () {
        return this._data;
    };
    return Settings;
}());
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map