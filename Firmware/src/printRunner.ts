import { Settings } from './Settings'
import { Builder, parseString } from 'Xml2js'
import * as fs from 'fs';
import { from, Observable, Subscriber } from 'rxjs';

export class PrintRunner {
    private svg: string;
    private layers: string[];
    private _isPrinting: boolean = false;
    private _zPos: number = 12.00;
    private _light: boolean = false;
    private _settings = new Settings();
    private builder = new Builder();
    private svgDir: string;
    private modelDir: string;

    constructor(private layerCallback: (layer: string) => void) {
        // check for existence of svg/stl folders
        this.modelDir = this._settings.getHome() + '/models';
        this.svgDir = this._settings.getHome() + '/svg';
        if (! fs.existsSync(this.svgDir)) { fs.mkdirSync(this.svgDir); }
        if (! fs.existsSync(this.modelDir)) { fs.mkdirSync(this.modelDir); }
    }

    public getLocalFiles(path: string): Observable<String[]> {
        const result = Observable.create((subscriber: Subscriber<string[]>) => {
            fs.readdir(path, (err: any, files: string[]) => {
                subscriber.next(files);
            });
        });
        return result;
    }

    /**
     * loadSvg
     */
    public loadSvg(filename: string): { width:number, height:number} {
        let result = { width:0, height:0 };
        let xml = fs.readFileSync(filename);
        parseString(xml, (err: object, data:any) => {
            if (err) {
                console.error(err);
                return;
            }
            from(data.svg.g).subscribe( (l) => {
                this.layers.push( this.builder.buildObject(l).replace('<root', '<g').replace('</root', '</g') )
            } );
            console.log(this.layers);
            result.width = data.svg.$.width;
            result.height = data.svg.$.height;
        });
        return result;
    }

    /**
     * requestLayer
     */
    public requestLayer(dropLayer = false) {
        if (this.svg == undefined) {
            throw new Error('no file loaded'); }
        else if (this.layers.length < 1) {
            throw new Error('no layers to print left in queue'); }
        this.layerCallback(this.layers[0]);
        if (dropLayer) {
            this.layers.shift();
        }
    }

    /**
     * startPrint
     */
    public startPrint() {
        if (this.svg == undefined) {
            throw new Error('no file loaded'); }
        
        this._isPrinting = true;

        // how to do that? iterate over simplesteps or do a per layer loop?
    }

    public getState() {
        return {
            printing : this._isPrinting,
            z : this._zPos,
            light : this._light,
        }
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