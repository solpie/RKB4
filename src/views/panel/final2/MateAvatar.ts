import { BaseAvatar } from '../base/BaseAvatar';
import { newBitmap } from '../../utils/PixiEx';

export class MateAvatar extends PIXI.Container {
    avt: BaseAvatar
    playerName: PIXI.Text
    bloodNum: PIXI.Text
    constructor() {
        super()
        this.avt = new BaseAvatar('/img/panel/final2/score/mateMaskR.png', 76)
        this.addChild(this.avt)


        let bg = newBitmap({ url: '/img/panel/final2/score/mateBg.png' })
        bg.x = -10
        bg.y = -10
        this.addChild(bg)

        let pn = new PIXI.Text('')
        this.playerName = pn
        this.addChild(pn)

        let bn = new PIXI.Text('')
        this.bloodNum = bn
        this.addChild(bn)
    }

    setData(data) {
        this.playerName.text = data.name

    }
}