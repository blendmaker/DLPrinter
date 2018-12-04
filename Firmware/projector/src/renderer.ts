import * as d3 from 'd3';
import { Settings } from '../../src/settings';
import { IpcRendererSubject } from '../../src/IpcSubjects';

const settings = new Settings();
const ipc = new IpcRendererSubject();
const gPos = d3.select('g#posHolder');
const gScale = d3.select('g#scaleHolder');
const svg = d3.select('svg#projector');
const pText = d3.select('p#text');

const phys_width = settings.getSettingsData().phys_width;
const phys_height = settings.getSettingsData().phys_height;
let pixelHeight: number;
let pixelWidth: number;

ipc.subscribe((msg: any) => {
    console.log('ipc received');
    if (typeof msg === 'string') {
        msg = JSON.parse(msg);
    }
    switch (msg.cmd) {
        case 'black': black(msg); break;
        case 'white': white(msg); break;
        case 'text': text(msg); break;
        case 'svg-layer': svgLayer(msg); break;
        case 'center': center(msg); break;
    }
});

/*ipc.on("black",    black);
ipc.on("white",    white);
ipc.on("text",     text);

ipc.on("svg-layer", svgLayer);
ipc.on("center",   center);
ipc.on("start",    start);
ipc.on("pause",    pause);
ipc.on("resume",   resume);
ipc.on("stop",     stop);*/

function svgLayer(a:any){
    gScale.html(a.layer);
}

function center(a:any) {
    // transform half the object size to pixel
    const pixelPerMmX = pixelWidth/phys_width;
    const pixelPerMmY = pixelHeight/phys_height;
    const cX = pixelWidth/2;
    const cY = pixelHeight/2;
    const pX = (cX-(pixelPerMmX*(a.w/2))).toFixed(3);
    const pY = (cY-(pixelPerMmY*(a.h)/2)).toFixed(3);

    gPos.attr('transform', "translate(" + pX + " " + pY + ")");
}

function black(a:any){
    svg.style('background-color', 'black');
    pText.style('color', 'white');
    pText.html("");
    gScale.html("");
}

function white(a:any){
    svg.style('background-color', 'white');
    pText.style('color', 'black');
    pText.html("");
    gScale.html("");
}

function text(a:any){
    pText.html(a.msg);
}

/*function start(a:any){
    
}

function pause(a:any){
    
}

function resume(a:any){
    
}

function stop(a:any){
    
}*/

document.addEventListener('DOMContentLoaded', function(){
    // apply scaling
    pixelHeight = (svg.node() as any).getBoundingClientRect().height;
    pixelWidth = (svg.node() as any).getBoundingClientRect().width;
    gScale.attr('transform', "scale(" + 
        (pixelWidth/phys_width).toFixed(3) + " " + 
        (pixelHeight/phys_height).toFixed(3) + ")");
 });
