import { ipcRenderer as ipc } from 'electron';
//const d3 = require('d3');
import * as d3 from 'd3';
const settings = require('../dlprinter.config.json');
const gPos = d3.select('g#posHolder');
const gScale = d3.select('g#scaleHolder');
const svg = d3.select('svg#projector');
const pText = d3.select('p#text');

let pixelHeight: number;
let pixelWidth: number;

ipc.on("black",    black);
ipc.on("white",    white);
ipc.on("text",     text);

ipc.on("svg-layer", svgLayer);
ipc.on("center",   center);
ipc.on("start",    start);
ipc.on("pause",    pause);
ipc.on("resume",   resume);
ipc.on("stop",     stop);

function svgLayer(e:Event, a:any){
    gScale.html(a.layer);
}

function center(e:Event, a:any) {
    // transform half the object size to pixel
    const pixelPerMmX = pixelWidth/settings.phys_width.value;
    const pixelPerMmY = pixelHeight/settings.phys_height.value;
    const cX = pixelWidth/2;
    const cY = pixelHeight/2;
    const pX = (cX-(pixelPerMmX*(a.w/2))).toFixed(3);
    const pY = (cY-(pixelPerMmY*(a.h)/2)).toFixed(3);

    gPos.attr('transform', "translate(" + pX + " " + pY + ")");
}

function black(e:Event, a:any){
    svg.style('background-color', 'black');
    pText.style('color', 'white');
    pText.html("");
    gScale.html("");
}

function white(e:Event, a:any){
    svg.style('background-color', 'white');
    pText.style('color', 'black');
    pText.html("");
    gScale.html("");
}

function text(e:Event, a:any){
    pText.html(a.msg);
}

function start(e:Event, a:any){
    
}

function pause(e:Event, a:any){
    
}

function resume(e:Event, a:any){
    
}

function stop(e:Event, a:any){
    
}

document.addEventListener('DOMContentLoaded', function(){
    // apply scaling
    console.log(svg.node());
    console.log(svg.node().constructor.name);
    //pixelHeight = svg.node().getBoundingClientRect().height;
    //pixelWidth = svg.node().getBoundingClientRect().width;
    gScale.attr('transform', "scale(" + (pixelWidth/settings.phys_width.value).toFixed(3) + " " + (pixelHeight/settings.phys_height.value).toFixed(3) + ")");

    setInterval(() => {
        ipc.send('message', 'i am alive!');
        ipc.send('message', { msg: 'i am alive!'});
    }, 2000);
 });
