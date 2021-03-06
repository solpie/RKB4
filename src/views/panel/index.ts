import { BackendView } from './backend/BackendView';
import { PokerView } from './poker/PokerView';
import { Bracket20View } from './bracket20/Bracket20View';

// import pixi from '../../libs/pixi.min.js'
// import pixi from 'script!./../../libs/pixi.min.js'
document.write(`<canvas id='panel'></canvas>`)
document.write(`<style>@font-face{font-family:'digital1';src:url(/fonts/digital.ttf); font-style:normal; font-weight:normal}</style>`)
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
import { StatisticsView } from "./statistics/StatisticsView";
import { Final2ScoreView } from './final2/Final2ScoreView';
import { Bo3View } from './score2018/Bo3View';

// import io from 'socket.io-client';
import { Vote } from './score2018/Vote';
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
    new Bracket20View(s)
}
else if (panel == 'bracket24') {
    s = window['stage'] = initPIXI()
    new Bracket20View(s)
}
else if (panel == 'backend') {
    s = window['stage'] = initPIXI()
    new BackendView(s)
}
else if (panel == 'monitor') {
    s = window['stage'] = initPIXI()
    new StatisticsView(s)
}
else if (panel == 'f2') {
    s = window['stage'] = initPIXI()
    let scoreView = new Final2ScoreView(s)
    localWS = scoreView.localWS
    // new PopupView(s, localWS)
}
else if (panel == 'bo3') {
    s = window['stage'] = initPIXI()
    let scoreView = new Bo3View(s)
    localWS = scoreView.localWS
}
else if (panel == 'vote') {
    s = window['stage'] = initPIXI()
    let votePanel = new Vote(s)
}
else if (panel == 'poker') {
    s = window['stage'] = initPIXI()
    new PokerView(s)
}
else {
    s = window['stage'] = initPIXI()
    let scoreView = new ScoreView(s)
    localWS = scoreView.localWS
    new PopupView(s, localWS)
}
loadImgArr(preLoadImgArr, _ => { })