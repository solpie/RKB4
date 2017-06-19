import { FontName } from '../const';
// 18452736
function _mkGroup(parameters) {
    let x = parameters.x;
    let y = parameters.y;
    let hints = parameters.hints ? parameters.hints : ['', ''];
    let s = { font: '25px', fill: '#fff', align: 'right' };
    let s1 = new PIXI.Text('', s);
    s1.y = 8;
    let s2 = new PIXI.Text('', s);
    s2.y = 8 + 53;
    s1.x = s2.x = 188;
    let ps = { fontSize: '25px', fontFamily: FontName.MicrosoftYahei, fontWeight: 'bold' }
    let p1 = new PIXI.Text("", ps)
    p1.x = 3
    p1.y = 8
    let p2 = new PIXI.Text("", ps)
    p2.x = p1.x
    p2.y = p1.y + 50
    return {
        x: x, y: y, labels: [p1, p2], hints: hints,
        winIdx: -1,
        scores: [s1, s2]
    }
}
export function fitWidth(label: PIXI.Text, width, size) {
    console.log(label.width, width)
    if (label.width > width) {
        // label.style = { font: size + 'px' }
        // label.text = label.text
        label.style['font'] = size + 'px'
        label.style['fontFamily'] = FontName.MicrosoftYahei
        fitWidth(label, width, size - 1)
    }
}
export let groupPosMap = {
    "1": _mkGroup({ x: 320, y: 91, hints: ['1号种子 ', "8号种子 "] }),
    "2": _mkGroup({ x: 320, y: 95 + 137, hints: ['4号种子 ', "5号种子 "] }),
    "3": _mkGroup({ x: 320, y: 95 + 145 * 2 + 18, hints: ['2号种子 ', "7号种子 "] }),
    "4": _mkGroup({ x: 320, y: 95 + 145 * 3 + 14, hints: ['3号种子 ', "6号种子 "] }),
    "5": _mkGroup({ x: 320, y: 806, hints: ['第1场败者 ', "第2场败者 "] }),
    "6": _mkGroup({ x: 320, y: 805 + 142, hints: ['第3场败者 ', "第4场败者 "] }),
    "7": _mkGroup({ x: 671, y: 162 }),
    "8": _mkGroup({ x: 671, y: 476 }),
    "9": _mkGroup({ x: 664, y: 893, hints: ['第7场败者 ', ""] }),
    "10": _mkGroup({ x: 664, y: 751, hints: ['第8场败者 ', ""] }),
    "11": _mkGroup({ x: 1067, y: 319 }),
    "12": _mkGroup({ x: 1020, y: 825 }),
    "13": _mkGroup({ x: 1366, y: 770, hints: ['第11场败者 ', ""] }),
    "14": _mkGroup({ x: 1463, y: 396, hints: ['', "第13场胜者 "] }),
};
export class BracketGroup {
    x: number;
    y: number;
    round: number;
    idx: number;//场次
    playerArr: Array<PlayerSvg>;

    constructor(idx) {
        this.idx = idx;
        // if (groupPosMap[idx]) {
        //     this.x = groupPosMap[idx].x;
        //     this.y = groupPosMap[idx].y;
        // }
        this.playerArr = [new PlayerSvg, new PlayerSvg];
    }
}
export class PlayerSvg {
    seed: number;//八强排位
    name: string;//
    avatar: string;//
    isHint: boolean = false;
    isWin: boolean = false;
    score: number = 0;//
}