"use strict";
exports.__esModule = true;
var d3 = require("d3");
var settings_1 = require("../../src/settings");
var IpcSubjects_1 = require("../../src/IpcSubjects");
var settings = new settings_1.Settings();
var ipc = new IpcSubjects_1.IpcRendererSubject();
var gPos = d3.select('g#posHolder');
var gScale = d3.select('g#scaleHolder');
var svg = d3.select('svg#projector');
var pText = d3.select('p#text');
var phys_width = settings.getSettingsData().phys_width;
var phys_height = settings.getSettingsData().phys_height;
var pixelHeight;
var pixelWidth;
ipc.subscribe(function (msg) {
    if (typeof msg === 'string') {
        msg = JSON.parse(msg);
    }
    switch (msg.cmd) {
        case 'black':
            black(msg);
            break;
        case 'white':
            white(msg);
            break;
        case 'text':
            text(msg);
            break;
        case 'svg-layer':
            svgLayer(msg);
            break;
        case 'center':
            center(msg);
            break;
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
function svgLayer(a) {
    gScale.html(a.layer);
}
function center(a) {
    // transform half the object size to pixel
    var pixelPerMmX = pixelWidth / phys_width;
    var pixelPerMmY = pixelHeight / phys_height;
    var cX = pixelWidth / 2;
    var cY = pixelHeight / 2;
    var pX = (cX - (pixelPerMmX * (a.w / 2))).toFixed(3);
    var pY = (cY - (pixelPerMmY * (a.h) / 2)).toFixed(3);
    gPos.attr('transform', "translate(" + pX + " " + pY + ")");
}
function black(a) {
    svg.style('background-color', 'black');
    pText.style('color', 'white');
    pText.html("");
    gScale.html("");
}
function white(a) {
    svg.style('background-color', 'white');
    pText.style('color', 'black');
    pText.html("");
    gScale.html("");
}
function text(a) {
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
document.addEventListener('DOMContentLoaded', function () {
    // apply scaling
    //pixelHeight = svg.node().getBoundingClientRect().height;
    //pixelWidth = svg.node().getBoundingClientRect().width;
    console.log(svg.node());
    console.log(svg.node().constructor.name);
    gScale.attr('transform', "scale(" +
        (pixelWidth / phys_width).toFixed(3) + " " +
        (pixelHeight / phys_height).toFixed(3) + ")");
});
//# sourceMappingURL=renderer.js.map