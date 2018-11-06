const electron = require('electron');
const ipc = electron.ipcRenderer;
const d3 = require('d3');
const settings = require('../dlprinter.config.json');
const gPos = d3.select('g#posHolder');
const gScale = d3.select('g#scaleHolder');
const svg = d3.select('svg#projector');
const pText = d3.select('p#text');

let pixelHeight;
let pixelWidth;

ipc.on("black",    black);
ipc.on("white",    white);
ipc.on("text",     text);

ipc.on("svg-layer", svgLayer);
ipc.on("center",   center);
ipc.on("start",    start);
ipc.on("pause",    pause);
ipc.on("resume",   resume);
ipc.on("stop",     stop);

function svgLayer(e, a){
    gScale.html(a.layer);
}

function center(e, a) {
    // transform half the object size to pixel
    let pixelPerMmX = pixelWidth/settings.phys_width.value;
    let pixelPerMmY = pixelHeight/settings.phys_height.value;
    let cX = pixelWidth/2;
    let cY = pixelHeight/2;
    let pX = parseFloat(cX-(pixelPerMmX*(a.w/2))).toFixed(3);
    let pY = parseFloat(cY-(pixelPerMmY*(a.h)/2)).toFixed(3);

    gPos.attr('transform', "translate(" + pX + " " + pY + ")");
}

function black(e, a){
    svg.style('background-color', 'black');
    pText.style('color', 'white');
    pText.html("");
    gScale.html("");
}

function white(e, a){
    svg.style('background-color', 'white');
    pText.style('color', 'black');
    pText.html("");
    gScale.html("");
}

function text(e, a){
    pText.html(a.msg);
}

function start(e, a){
    
}

function pause(e, a){
    
}

function resume(e, a){
    
}

function stop(e, a){
    
}

document.addEventListener('DOMContentLoaded', function(){
    // apply scaling
    pixelHeight = svg.node().getBoundingClientRect().height;
    pixelWidth = svg.node().getBoundingClientRect().width;
    gScale.attr('transform', "scale(" + parseFloat(pixelWidth/settings.phys_width.value).toFixed(3) + " " + parseFloat(pixelHeight/settings.phys_height.value).toFixed(3) + ")");
 });
