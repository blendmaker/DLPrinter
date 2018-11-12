import { Settings } from './settings'
import { Builder, parseString } from 'Xml2js'
import { readFileSync } from 'fs';

export class PrintRunner {
    private svg: string;
    private layers: string[];
    private _isPrinting: boolean = false;
    private builder = new Builder();

    constructor(private settings: Settings, private layerCallback: (layer: string) => void) {

    }

    /**
     * loadSvg
     */
    public loadSvg(filename: string): { width:number, height:number} {
        let result = { width:0, height:0 };
        let xml = readFileSync(filename);
        parseString(xml, (err: object, data:any) => {
            if (err) {
                console.log(err);
                return;
            }
            this.layers = data.svg.g;
            result.width = data.svg.$.width;
            result.height = data.svg.$.height;
        });
        return result;
    }

    /**
     * requestLayer
     */
    public requestLayer(layerNumber: number) {
        if (this.svg == undefined) {
            throw new Error('no file loaded'); }
        if (this.layers.length < 1) {
            throw new Error('no layers to print left in queue'); }
        this.layerCallback(this.layers[layerNumber]);
    }

    /**
     * startPrint
     */
    public startPrint() {
        if (this.svg == undefined) {
            throw new Error('no file loaded'); }
        
        this._isPrinting = true;
    }

    /**
     * isPrinting
     */
    public isPrinting():boolean {
        return this._isPrinting;
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