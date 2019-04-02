import { Settings } from './Settings';
import { Builder, parseString } from 'Xml2js';
import { existsSync, mkdirSync, readdir, readFileSync, unlink, statSync, fstat } from 'fs';
import { parse as parsePath, join } from 'path';
import { from, Observable, Subscriber } from 'rxjs';
import { FileMeta } from './interfaces/FileMeta';
import { PrinterState } from './interfaces/PrinterState';

export class PrintRunner {
    private layers: string[];
    private state: PrinterState = {
        printing: false,
        light: false,
        z: 0.0,
    };
    private settings = new Settings();
    private builder = new Builder();
    public modelDir: string;
    public svgDir: string;
    public gcodeDir: string;

    constructor(private layerCallback: (layer: string) => void) {
        // check for existence of svg/stl folders
        this.modelDir = this.settings.getHome() + '/models';
        this.svgDir = this.settings.getHome() + '/svg';
        this.gcodeDir = this.settings.getHome() + '/gcodes';
        if (! existsSync(this.svgDir)) { mkdirSync(this.svgDir); }
        if (! existsSync(this.modelDir)) { mkdirSync(this.modelDir); }
        if (! existsSync(this.gcodeDir)) { mkdirSync(this.gcodeDir); }
    }

    public getLocalFiles(path: string): Observable<FileMeta[]> {
        const result = Observable.create((subscriber: Subscriber<FileMeta[]>) => {
            readdir(path, (err: any, files: string[]) => {
                if (! err) {
                    // TODO stuff results with meta data
                    const data: FileMeta[] = files.map( file => {
                        const f = parsePath(path + '/' + file);
                        if (f.name.startsWith('.')) { return; }

                        const fStat = statSync(path + '/' + file);
                        return {
                            name: f.name,
                            path: path + '/' + file,
                            size: fStat.size,
                            dateTime: new Date(fStat.ctime),
                            type: f.ext.replace('.', '')
                        };
                    }).filter( file => !!file );
                    subscriber.next(data);
                }
                subscriber.complete();
            });
        });
        return result;
    }

    /**
     * loadSvg
     */
    public loadSvg(filename: string): { width:number, height:number} {
        let result = { width:0, height:0 };
        let xml = readFileSync(filename);
        this.layers = [];
        parseString(xml, (err: object, data:any) => {
            if (err) {
                console.error(err);
            }
            from(data.svg.g).subscribe( (l) => {
                this.layers.push( this.builder.buildObject(l).replace('<root', '<g').replace('</root', '</g') )
            } );
            result.width = data.svg.$.width;
            result.height = data.svg.$.height;
        });
        return result;
    }

    /**
     * requestLayer
     */
    public requestLayer(dropLayer = false) {
        if (!this.layers) {
            throw new Error('no file loaded');
        }
        /*else if (this.layers.length < 1) {
            throw new Error('no layers to print left in queue');
            return;
        }*/
        this.layerCallback(this.layers[0]);
        if (dropLayer) {
            this.layers.shift();
        }
    }

    /**
     * startPrint
     */
    public startPrint() {
        if (!this.layers) {
            throw new Error('no file loaded');
            return;
        }
        
        this.state.printing = true;

        setTimeout(() => {
            while(this.state.printing) {
                this.tickPrint();
            }
        });
        // how to do that? iterate over simplesteps or do a per layer loop?
    }

    public getState(): PrinterState {
        return this.state;
    }

    public triggerLight() {
        this.state.light = !this.state.light;
    }
 
    i=0;
    private tickPrint() {
        this.i++;

        if (this.i>100000) {
            this.state.printing = false;
        }
        if (!this.state.printing) {
            console.log('print stopped');
        }
        /*mainWindow.webContents.send('svg-layer', { 'layer' : 
            builder.buildObject(layers[0]).replace('<root', '<g').replace('</root', '</g')
        });
        layers.shift();
        mainWindow.webContents.send('text', { 'msg' : layers.length + ' Layers left.' });
    
        if (layers.length > 0) {
            setTimeout(tickPrint, 100);
        }*/
    }
    /*
    function loadSvg(fn: string) {
    
}

function tickPrint() {
    mainWindow.webContents.send('svg-layer', { 'layer' : 
        builder.buildObject(layers[0]).replace('<root', '<g').replace('</root', '</g')
    });
    layers.shift();
    mainWindow.webContents.send('text', { 'msg' : layers.length + ' Layers left.' });

    if (layers.length > 0) {
        setTimeout(tickPrint, 100);
    }
}


    */
}
