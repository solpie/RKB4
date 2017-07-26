import { imgLoader } from '../../utils/ImgLoader';
import { newBitmap, setScale } from '../../utils/PixiEx';
import { PokerPlayer } from "./PokerPlayer";
export class PokerPanel extends PIXI.Container {
    pokerPlayer: Array<PokerPlayer> = []
    bg: PIXI.Sprite
    constructor() {
        super()
        let bg = new PIXI.Sprite()
        this.addChild(bg)
        this.bg = bg

        for (let i = 0; i < 12; i++) {
            let p = new PokerPlayer
            this.pokerPlayer.push(p)
            this.addChild(p)
        }
        this.show8Player()
    }
    show12Player() {
        imgLoader.loadTex('/img/panel/bracket/final/bg2.png', tex => {
            this.bg.texture = tex
        })
        for (let i = 0; i < 6; i++) {
            let p = this.pokerPlayer[i]
            let p2 = this.pokerPlayer[6 + i]
            setScale(p, .9)
            setScale(p2, .9)
            p.setPoker('L' + (4 + i + 1))
            p2.setPoker('R' + (4 + i + 1))
            p.x = 50 + i * 305
            p.y = 240
            p2.x = p.x
            p2.y = 610
            p.reset()
            p2.reset()
        }
        this.pokerPlayer[8].visible = true
        this.pokerPlayer[9].visible = true
        this.pokerPlayer[10].visible = true
        this.pokerPlayer[11].visible = true
    }
    show8Player() {
        imgLoader.loadTex('/img/panel/bracket/final/bg1.png', tex => {
            this.bg.texture = tex
        })
        for (let i = 0; i < 4; i++) {
            let p = this.pokerPlayer[i]
            let p2 = this.pokerPlayer[4 + i]
            setScale(p, 1)
            setScale(p2, 1)
            p.setPoker('L' + (i + 1))
            p2.setPoker('R' + (i + 1))
            p.x = 140 + i * 442
            p.y = 240
            p2.x = p.x
            p2.y = 610
            p.reset()
            p2.reset()
        }
        this.pokerPlayer[8].visible = false
        this.pokerPlayer[9].visible = false
        this.pokerPlayer[10].visible = false
        this.pokerPlayer[11].visible = false
    }

    showPokerPlayer(data) {
        // if (data.visible)
        for (let pp of this.pokerPlayer) {
            if (pp.pokerStr == data.pokerStr) {
                pp.setInfo(data.playerData.data)
                if (data.visible)
                    pp.playOnce()
                else
                    pp.reset()
            }
        }
        // else {

        // }
    }
}