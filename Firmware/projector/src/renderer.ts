import * as d3 from 'd3';
import { Settings } from '../../src/settings';
import { IpcRendererSubject } from '../../src/IpcSubjects';
import { MessageInterface } from '../../src/interfaces/MessageInterface';

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

ipc.subscribe((msg: MessageInterface) => {
    switch (msg.cmd) {
        case 'text'  : text(msg);     break;
        case 'color' : color(msg);    break;
        case 'layer' : svgLayer(msg); break;
        case 'center': center(msg);   break;
    }
});

function svgLayer(msg: MessageInterface){
    gScale.html(msg.data);
}

function center(msg: MessageInterface) {
    // transform half the object size to pixel
    const pixelPerMmX = pixelWidth/phys_width;
    const pixelPerMmY = pixelHeight/phys_height;
    const cX = pixelWidth/2;
    const cY = pixelHeight/2;
    const pX = (cX-(pixelPerMmX*(msg.data.w/2))).toFixed(3);
    const pY = (cY-(pixelPerMmY*(msg.data.h)/2)).toFixed(3);

    gPos.attr('transform', "translate(" + pX + " " + pY + ")");
}

function color(msg: MessageInterface){
    svg.style('background-color', msg.data);
    pText.style('color', msg.data === 'white' ? 'black' : 'white');
    pText.html("");
    gScale.html("");
}

function text(msg: MessageInterface){
    pText.html(msg.data);
}

document.addEventListener('DOMContentLoaded', function(){
    // apply scaling
    pixelHeight = (svg.node() as any).getBoundingClientRect().height;
    pixelWidth = (svg.node() as any).getBoundingClientRect().width;
    gScale.attr('transform', "scale(" + 
        (pixelWidth/phys_width).toFixed(3) + " " + 
        (pixelHeight/phys_height).toFixed(3) + ")");
});
