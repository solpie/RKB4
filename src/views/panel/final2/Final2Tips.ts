import { newBitmap } from "../../utils/PixiEx";
import { FontName } from "../const";
import { TweenEx } from '../../utils/TweenEx';

export class Fianl2Tips extends PIXI.Container {
    tips: PIXI.Text
    constructor() {
        super()
        let bg = newBitmap({ url: '/img/panel/final2/score/tipsBg.png' })
        this.addChild(bg)


        let ps = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '30px',
            fill: '#f4d772',
            fontWeight: 'bold'
        }
        let t = new PIXI.Text('', ps)
        this.tips = t
        t.y = 858
        this.addChild(t)

        this.alpha = 0
        // this.y = 200
    }

    setText(str) {
        this.alpha = 0
        this.y = 100
        this.tips.text = str
        this.tips.x = 960 - this.tips.width * .5

        TweenEx.to(this, 150, {
            y: 0, alpha: 1
        })
    }
    hide() {
        TweenEx.to(this, 200, {
            alpha: 0
        })
    }
}