import { Settings } from './Settings'
import { Builder, parseString } from 'Xml2js'
import * as fs from 'fs';
import { from, Observable, Subscriber } from 'rxjs';

export class PrintRunner {
    //private svg: string;
    private layers: string[];
    private isPrinting: boolean = false;
    private zPos: number = 0.00;
    private light: boolean = false;
    private settings = new Settings();
    private builder = new Builder();
    private svgDir: string;
    private modelDir: string;

    constructor(private layerCallback: (layer: string) => void) {
        // check for existence of svg/stl folders
        this.modelDir = this.settings.getHome() + '/models';
        this.svgDir = this.settings.getHome() + '/svg';
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
            return;
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
        
        this.isPrinting = true;

        setTimeout(() => {
            console.log('timeout');
            while(this._isPrinting) {
                this.tickPrint();
            }
        });
        // how to do that? iterate over simplesteps or do a per layer loop?
    }

    public getState() {
        return {
            printing : this.isPrinting,
            z : this.zPos,
            light : this.light,
        }
    }

    public triggerLight() {
        this._light = !this._light;
    }
 
    i=0;
    private tickPrint() {
        this.i++;

        if (this.i>100000) {
            this._isPrinting = false;
        }
        if (!this._isPrinting) {
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