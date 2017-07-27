import { alignCenter, setScale, cutText } from '../../utils/PixiEx';
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
    pokerSpTop: PIXI.Sprite
    pokerSpBottom: PIXI.Sprite
    pokerStr: string//L1 ~L10
    constructor() {
        super()
        this.ctn = new PIXI.Container
        this.addChild(this.ctn)
        imgLoader.loadTex('/img/panel/bracket/final/playerBg1.png', tex => {
            let bg = new PIXI.Sprite()
            bg.texture = tex
            this.bg = bg

            let avt = new PIXI.Sprite()
            avt.x = 61
            avt.y = 39
            let r = 210 / 2
            let avtMask = new PIXI.Graphics()
            avtMask.x = avt.x
            avtMask.y = avt.y
            avtMask.beginFill(0xff0000)
                .drawCircle(r, r, r)
            this.ctn.addChild(avt)
            avt.mask = avtMask
            this.ctn.addChild(avtMask)
            this.avt = avt
            this.ctn.addChild(bg)


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

            let pkTop = new PIXI.Sprite
            let pkS = {
                fontWeight: 'bold',
                fontFamily: FontName.MicrosoftYahei,
                fontSize: '50px'
            }
            let pkText = new PIXI.Text('A', pkS)
            pkText.y = 65
            pkTop['label'] = pkText
            pkTop.addChild(pkText)
            pkTop.x = 25
            pkTop.y = 25
            this.pokerSpTop = pkTop
            this.ctn.addChild(pkTop)

            let pkBtm = new PIXI.Sprite
            pkText = new PIXI.Text('A', pkS)
            pkBtm['label'] = pkText
            pkText.y = 65
            pkBtm.addChild(pkText)
            pkBtm.x = 308
            pkBtm.y = 340
            pkBtm.rotation = 180 * PIXI.DEG_TO_RAD
            this.pokerSpBottom = pkBtm
            this.ctn.addChild(pkBtm)

            setScale(pkBtm, 0.6)
            setScale(pkTop, 0.6)
            let fx = new FramesFx('/img/panel/bracket/final/poker8/poker_8_', 0, 13)
            fx.y = -72
            fx.x = -87
            this.addChild(fx)
            this.fx = fx
            fx.on('complete', _ => {
                this.isPlaying = false
                this.fx.visible = false
                this.ctn.visible = true
                console.log('complete', this.pokerSpTop, this.nameText);
            })
        })
        // TweenEx.delayedCall(Math.random() * 3000, _ => {
        //     this.setInfo({ name: '带上上阵也不怕2', height: 178, weight: 80 })
        // })
    }
    isPlaying = false
    playOnce() {
        if (!this.isPlaying) {
            this.isPlaying = true
            let fx = this.fx
            fx.visible = true
            this.ctn.visible = false
            fx.playOnce()
        }
    }

    setPoker(pokerStr) {
        this.pokerStr = pokerStr
        let color = pokerStr.charAt(0)
        let icon;
        let fill
        if (color == 'L') {
            icon = '/img/panel/bracket/final/pokerBlack.png'
            fill = '#000'
        }
        else if (color == 'R') {
            icon = '/img/panel/bracket/final/pokerRed.png'
            fill = '#d40d0d'
        }

        imgLoader.loadTex(icon, tex => {
            this.pokerSpTop.texture = tex
            this.pokerSpBottom.texture = tex
        })
        this.pokerSpBottom['label'].style.fill = fill
        this.pokerSpTop['label'].style.fill = fill
        let num = pokerStr.substring(1)
        if (num == '1')
            num = 'A'
        this.pokerSpBottom['label'].text = num
        this.pokerSpTop['label'].text = num

        alignCenter(this.pokerSpBottom['label'], 30)
        alignCenter(this.pokerSpTop['label'], 30)
    }
    setInfo(playerData) {
        //todo local img
        this.nameText.text = playerData.name
        cutText(this.nameText, 230)
        alignCenter(this.nameText, 164)
        this.infoText.text = playerData.height + " CM /" + playerData.weight + ' KG'
        alignCenter(this.infoText, 164)
        imgLoader.loadTex(playerData.avatar, tex => {
            this.avt.texture = tex
            setScale(this.avt, 210 / tex.height)
            this.playOnce()
        })
    }

    reset() {
        this.isPlaying = false
        console.log('poker reset', this.pokerStr);
        this.ctn.visible = false
        this.fx.visible = true
        this.fx.gotoAndStop(0)
    }
}