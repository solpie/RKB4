
// import pixi from '../../libs/pixi.min.js'
// import pixi from 'script!./../../libs/pixi.min.js'
document.write(`<canvas id='panel'></canvas>`)
// import PIXI from 'pixi.js'
// window['PIXI'] = pixi
console.log('PIXI', window['PIXI']);
// import tween from 'tween'
// window['TWEEN'] = tween
import { ViewConst } from "./const";
import { Score2017 } from './score/Score2017';
import { BracketView } from './bracket/BracketView';
import { getUrlQuerys } from '../utils/WebJsFunc';
import { ScoreView } from './score/ScoreView';
// import io from 'socket.io-client';
// window['io'] = io
// console.log('socket.io ', io);

declare let PIXI;
declare let TWEEN;
document.write(`<canvas id='panel'></canvas>`)

let initPIXI = () => {
    let renderer = new PIXI.autoDetectRenderer(ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT,
        { antialias: false, transparent: true, resolution: 1 }, false);
    document.body.insertBefore(renderer.view, document.getElementById("panel"));
    renderer.stage = new PIXI.Container();
    renderer.backgroundColor = 0x00000000;
    //Loop this function 60 times per second
    renderer.renderStage = (time) => {
        requestAnimationFrame(renderer.renderStage);
        TWEEN.update(time)
        renderer.render(renderer.stage);
    };
    renderer.renderStage();
    return renderer.stage;
}

window['stage'] = initPIXI()
// new Score2017(window['stage'], false)
let panel = getUrlQuerys('panel')
let gameId = getUrlQuerys('gameId')
let isMonth = getUrlQuerys('m') == '1'
if (panel == 'bracket')
    new BracketView(window['stage'], gameId, isMonth)
else
    new ScoreView(window['stage'])