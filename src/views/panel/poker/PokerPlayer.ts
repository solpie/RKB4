import { TweenEx } from '../../utils/TweenEx';
import { FramesFx } from '../../utils/FramesFx';
import { imgLoader } from '../../utils/ImgLoader';
import { FontName } from "../const";

export class PokerPlayer extends PIXI.Container {
    avt: PIXI.Sprite
    nameText: PIXI.Text
    infoText: PIXI.Text
    fx: FramesFx
    bg: PIXI.Sprite
    ctn: PIXI.Container
    constructor() {
        super()
        this.ctn = new PIXI.Container
        this.addChild(this.ctn)
        imgLoader.loadTex('/img/panel/bracket/final/playerBg1.png', tex => {
            let bg = new PIXI.Sprite()
            bg.texture = tex
            this.ctn.addChild(bg)
            this.bg = bg
        }, false)
        let avt = new PIXI.Sprite()
        avt.x = 20
        avt.y = 20
        this.ctn.addChild(avt)
        this.avt = avt
        let ns = {
            fill: '#000',
            fontWeight: 'bold',
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '32px'
        }
        let nameText = new PIXI.Text('', ns)
        nameText.x = 20
        nameText.y = 255
        this.ctn.addChild(nameText)
        this.nameText = nameText

        let infoText = new PIXI.Text('', ns)
        infoText.x = 20
        infoText.y = 305
        this.ctn.addChild(infoText)
        infoText.style.fontSize = '25px'
        this.infoText = infoText

        let fx = new FramesFx('/img/panel/bracket/final/poker8/poker_8_', 0, 13)
        fx.y = -72
        fx.x = -87
        this.addChild(fx)
        this.fx = fx
        fx.on('complete', _ => {
            this.fx.visible = false
            this.ctn.visible = true
        })
        // TweenEx.delayedCall(Math.random() * 3000, _ => {
        //     this.setInfo({ name: 'player', height: 178, weight: 80 })
        // })
    }

    playOnce() {
        let fx = this.fx
        fx.visible = true
        this.ctn.visible = false
        fx.playOnce()
    }

    setInfo(playerData) {
        //todo local img
        this.nameText.text = playerData.name
        this.nameText.x = 164 - this.nameText.width * .5
        this.infoText.text = playerData.height + " CM /" + playerData.weight + ' KG'
        this.infoText.x = 164 - this.infoText.width * .5
        this.playOnce()
    }
}