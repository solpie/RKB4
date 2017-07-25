import { newBitmap } from '../../utils/PixiEx';
import { PokerPlayer } from "./PokerPlayer";
export class PokerPanel extends PIXI.Container {
    pokerPlayer = []
    constructor() {
        super()
        let bg = newBitmap({ url: '/img/panel/bracket/final/bg1.png' })
        this.addChild(bg)

        for (let i = 0; i < 12; i++) {
            let p = new PokerPlayer
            this.pokerPlayer.push(p)
            this.addChild(p)
        }
        this.show8Player()
    }
    show8Player() {
        for (let i = 0; i < 4; i++) {
            let p = this.pokerPlayer[i]
            let p2 = this.pokerPlayer[4 + i]
            p.x = 140 + i * 442
            p.y = 240
            p2.x = p.x
            p2.y = 610
        }
        this.pokerPlayer[8].visible = false
        this.pokerPlayer[9].visible = false
        this.pokerPlayer[10].visible = false
        this.pokerPlayer[11].visible = false
    }
}