"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
//const d3 = require('d3');
var d3 = require("d3");
var settings = require('../dlprinter.config.json');
var gPos = d3.select('g#posHolder');
var gScale = d3.select('g#scaleHolder');
var svg = d3.select('svg#projector');
var pText = d3.select('p#text');
var pixelHeight;
var pixelWidth;
electron_1.ipcRenderer.on("black", black);
electron_1.ipcRenderer.on("white", white);
electron_1.ipcRenderer.on("text", text);
electron_1.ipcRenderer.on("svg-layer", svgLayer);
electron_1.ipcRenderer.on("center", center);
electron_1.ipcRenderer.on("start", start);
electron_1.ipcRenderer.on("pause", pause);
electron_1.ipcRenderer.on("resume", resume);
electron_1.ipcRenderer.on("stop", stop);
function svgLayer(e, a) {
    gScale.html(a.layer);
}
function center(e, a) {
    // transform half the object size to pixel
    var pixelPerMmX = pixelWidth / settings.phys_width.value;
    var pixelPerMmY = pixelHeight / settings.phys_height.value;
    var cX = pixelWidth / 2;
    var cY = pixelHeight / 2;
    var pX = (cX - (pixelPerMmX * (a.w / 2))).toFixed(3);
    var pY = (cY - (pixelPerMmY * (a.h) / 2)).toFixed(3);
    gPos.attr('transform', "translate(" + pX + " " + pY + ")");
}
function black(e, a) {
    svg.style('background-color', 'black');
    pText.style('color', 'white');
    pText.html("");
    gScale.html("");
}
function white(e, a) {
    svg.style('background-color', 'white');
    pText.style('color', 'black');
    pText.html("");
    gScale.html("");
}
function text(e, a) {
    pText.html(a.msg);
}
function start(e, a) {
}
function pause(e, a) {
}
function resume(e, a) {
}
function stop(e, a) {
}
document.addEventListener('DOMContentLoaded', function () {
    // apply scaling
    console.log(svg.node());
    console.log(svg.node().constructor.name);
    //pixelHeight = svg.node().getBoundingClientRect().height;
    //pixelWidth = svg.node().getBoundingClientRect().width;
    gScale.attr('transform', "scale(" + (pixelWidth / settings.phys_width.value).toFixed(3) + " " + (pixelHeight / settings.phys_height.value).toFixed(3) + ")");
    setInterval(function () {
        electron_1.ipcRenderer.send('message', 'i am alive!');
        electron_1.ipcRenderer.send('message', { msg: 'i am alive!' });
    }, 2000);
});
//# sourceMappingURL=renderer.js.map