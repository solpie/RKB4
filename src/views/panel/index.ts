import { PokerView } from './poker/PokerView';
import { Bracket20View } from './bracket20/Bracket20View';

// import pixi from '../../libs/pixi.min.js'
// import pixi from 'script!./../../libs/pixi.min.js'
document.write(`<canvas id='panel'></canvas>`)
// import PIXI from 'pixi.js'
// window['PIXI'] = pixi
console.log('PIXI', window['PIXI']);
// import tween from 'tween'
// window['TWEEN'] = tween
import { Score2017 } from './score/Score2017';
import { BracketView } from './bracket/BracketView';
import { loadImgArr } from '../utils/JsFunc';
import { getUrlQuerys } from '../utils/WebJsFunc';
import { preLoadImgArr, ViewConst } from './const';
import { ScoreView } from './score/ScoreView';
import { PopupView } from './popup/PopupView';
import { initThree } from "./threeCanvas";

// import io from 'socket.io-client';
// window['io'] = io
// console.log('socket.io ', io);
// document.getElementsByTagName('body')['style'].margin = 0
document.body.style.margin = '0px'
document.body.style.overflow = 'hidden'
declare let PIXI;
declare let TWEEN;

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

let s
// new Score2017(window['stage'], false)
let panel = getUrlQuerys('panel')
let gameId = getUrlQuerys('gameId')
let isMonth = getUrlQuerys('m') == '1'
let localWS;
if (panel == 'bracket') {
    s = window['stage'] = initPIXI()
    new BracketView(s, gameId, isMonth)
}
else if (panel == 'bracket20') {
    s = window['stage'] = initPIXI()
    setTimeout(_ => {
        new Bracket20View(s)
    }, 1500)
}
else if (panel == 'poker') {
    // document.removeChild()
    var element = document.getElementById("panel");
    element.parentNode.removeChild(element);
    initThree()
    new PokerView()
}
else {
    s = window['stage'] = initPIXI()
    let scoreView = new ScoreView(s)
    localWS = scoreView.localWS
    new PopupView(s, localWS)
}
loadImgArr(preLoadImgArr, _ => { })