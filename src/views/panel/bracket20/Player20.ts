import { getUrlQuerys } from '../../utils/WebJsFunc';
import { cutText, newBitmap } from '../../utils/PixiEx';
import { imgLoader } from '../../utils/ImgLoader';
import { FontName } from "../const";
import { zoomMax } from "./Bracket20";
import { simplifyName } from "../score/Com2017";
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
        nt.y = 8
        this.nameText = nt
        this.addChild(nt)

        let pt = new PIXI.Text('', ns)
        pt.y = 6
        this.pokeText = pt

        let sp = new PIXI.Sprite()
        sp.x = 4
        sp.y = 4
        this.pokeSp = sp
        this.addChild(sp)
        this.addChild(pt)

        let scoreText = new PIXI.Text('', ns)
        scoreText.x = 200 * zoomMax
        scoreText.y = 5
        this.scoreText = scoreText
        let isShowScore = getUrlQuerys('score') == '1'
        if (isShowScore)
            this.addChild(scoreText)

        let winSp = newBitmap({ url: '/img/panel/bracket/final/winHint.png' })
        if (isSmall) {
            this.nameWidth = 200
            winSp.x = 162 * zoomMax
        }
        else {
            this.nameWidth = 285
            winSp.x = 207 * zoomMax
        }
        winSp.scale.x = winSp.scale.y = 1 / zoomMax
        this.addChild(winSp)
        this.winSp = winSp
    }
    // fitWidth() {
    //     if (this.nameText.width > this.nameWidth) {
    //         this.nameText.text = this.nameText.text.substring(0, this.nameText.text.length - 1)
    //         this.fitWidth()
    //     }
    // }

    setInfo(playerName, score, pNum?) {
        this.nameText.text = simplifyName(playerName)
        this.scoreText.text = score
        if (pNum) {
            let poker = pNum
            console.log(playerName, 'pNum', pNum, 'poker', poker);
            cutText(this.nameText, this.nameWidth)
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
            this.pokeText.x = 90 - this.pokeText.width
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