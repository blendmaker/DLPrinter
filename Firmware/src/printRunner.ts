import { Settings } from './Settings'
import { Builder, parseString } from 'Xml2js'
import { readFileSync } from 'fs';
import { from } from 'rxjs';

export class PrintRunner {
    private svg: string;
    private layers: string[];
    private _isPrinting: boolean = false;
    private _zPos: 0.00;
    private _light: false;
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
            //this.layers = data.svg.g;
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
    public requestLayer(layerNumber: number) {
        if (this.svg == undefined) {
            throw new Error('no file loaded'); }
        else if (this.layers.length < 1) {
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