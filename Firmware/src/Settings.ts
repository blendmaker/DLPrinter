import { app, remote, dialog } from 'electron';
import { statSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { SettingsData } from './Interfaces/SettingsData';

export class Settings {
  private data: SettingsData;

  // FIXME: Electron doesn't like the main.js to be somewhere other than root. Dirty fix to the wrong homeDir
  private homeDir = (app !== undefined)?
    app.getPath('userData').replace('Electron', 'DLPrinter'):
    remote.app.getPath('userData').replace('Electron', 'DLPrinter');
  
  constructor(resetToDefaults: boolean = false) {
    if (! existsSync(this.homeDir)) { mkdirSync(this.homeDir); }
    let fExists : boolean = false;

    try {
      statSync(this.homeDir + '/dlprinter.config.json');
      fExists = true;
    } catch (err) {
      if (err !== null && err.code !== 'ENOENT') {
        this.fileError(err);
      }
    }

    if (resetToDefaults || !fExists) {
      let tmpSettings = require('../dlprinter.config.json');
      this.setSettingsData(tmpSettings);
    }

    try {
      this.data = JSON.parse(readFileSync(this.homeDir + '/dlprinter.config.json').toString());
    } catch (err) {
      app.quit();
    }
  }

  public resetToDefaults(): SettingsData {
    let tmpSettings = require('../dlprinter.config.json');
    this.setSettingsData(tmpSettings);
    return this.data;
  }

  // TODO validate settings to be a valid SettingsData instance
  public setSettingsData(data: SettingsData, saveToDisk: boolean = true): void {
    this.data = data;
    if (saveToDisk) {
      try {
        writeFileSync(this.homeDir + '/dlprinter.config.json', JSON.stringify(data, null, 2));
      } catch (err) { this.fileError(err); }
    }
  }

  private fileError(error: { code: string }) {
    dialog.showErrorBox('Fileerror', 'An error occured when trying to create local settings. Aborting launch.\nErrorcode: ' + error.code);
    console.error('An error occured when trying to create local settings. Aborting launch.');
    console.error('Errorcode: ', error.code);
  }

  public getSettingsData():SettingsData {
    return this.data;
  }

  public getHome() {
    return this.homeDir;
  }
}
