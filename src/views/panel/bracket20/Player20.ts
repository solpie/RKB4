import { newBitmap } from '../../utils/PixiEx';
import { imgLoader } from '../../utils/ImgLoader';
import { FontName } from "../const";
import { zoomMax } from "./Bracket20";
const pokerMap = {
    'p16': 'L1',
    'p17': 'R1',
    'p13': 'L2',
    'p20': 'R2',
    'p15': 'L3',
    'p18': 'R3',
    'p14': 'L4',
    'p19': 'R4',

    'p8': 'L5',
    'p9': 'R5',
    'p5': 'L6',
    'p12': 'R6',
    'p7': 'L7',
    'p10': 'R7',
    'p6': 'L8',
    'p11': 'R8',

    'p1': 'L9',
    'p4': 'R9',

    'p2': 'L10',
    'p3': 'R10',
}
export class Player20 extends PIXI.Container {
    nameText: PIXI.Text
    scoreText: PIXI.Text
    pokeText: PIXI.Text
    pokeSp: PIXI.Sprite
    winSp: PIXI.Sprite
    // isSmall = false
    nameWidth = 200
    constructor(isSmall = false) {
        super()
        let ns = {
            fill: '#000',
            fontWeight: 'bold',
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '40px'
        }
        let nt = new PIXI.Text('', ns)
        nt.x = 105
        this.nameText = nt
        this.addChild(nt)

        let pt = new PIXI.Text('', ns)
        pt.x = 60
        this.pokeText = pt

        let sp = new PIXI.Sprite()
        this.pokeSp = sp
        this.addChild(sp)
        this.addChild(pt)

        let scoreText = new PIXI.Text('', ns)
        scoreText.x = 200 * zoomMax
        this.scoreText = scoreText
        // this.addChild(scoreText)

        let winSp = newBitmap({ url: '/img/panel/bracket/final/winHint.png' })
        if (isSmall) {
            this.nameWidth = 190
            winSp.x = 150 * zoomMax
        }
        else {
            this.nameWidth = 265
            winSp.x = 200 * zoomMax
        }
        winSp.scale.x = winSp.scale.y = 1 / zoomMax
        this.addChild(winSp)
        this.winSp = winSp
    }
    fitWidth() {
        if (this.nameText.width > this.nameWidth) {
            this.nameText.text = this.nameText.text.substring(0, this.nameText.text.length - 1)
            this.fitWidth()
        }
    }
    setInfo(playerName, score, pNum?) {
        this.nameText.text = playerName
        this.scoreText.text = score
        if (pNum) {
            let poker = pokerMap[pNum]
            console.log(playerName, 'pNum', pNum, 'poker', poker);
            this.fitWidth()
            // if (score != 0)
            this.pokeText.text = poker.charAt(1)
            this.pokeText.style.fontSize = '40px'
            if (this.pokeText.text == '1') {

                if (poker.length < 3)
                    this.pokeText.text = 'A'
                else {
                    this.pokeText.style.fontSize = '35px'
                    this.pokeText.text = '10'
                }
            }
            this.pokeText.x = 85 - this.pokeText.width
            let type = poker.charAt(0)
            if (type == 'L') {
                this.pokeText.style.fill = '#000'
                imgLoader.loadTex('/img/panel/bracket/final/pokerBlack.png', tex => {
                    this.pokeSp.texture = tex
                    this.pokeSp.scale.x = this.pokeSp.scale.y = .7
                }, false)
            }
            else {
                imgLoader.loadTex('/img/panel/bracket/final/pokerRed.png', tex => {
                    this.pokeSp.texture = tex
                    this.pokeSp.scale.x = this.pokeSp.scale.y = .7
                }, false)
                this.pokeText.style.fill = '#f00'
            }
        }
    }

    setWin(a) {
        let isWin = a > .5
        this.winSp.visible = isWin
        this.nameText.alpha = a
        this.scoreText.alpha = a
    }
}