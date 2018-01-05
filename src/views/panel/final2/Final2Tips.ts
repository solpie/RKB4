import { newBitmap } from "../../utils/PixiEx";
import { FontName } from "../const";

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
    }

    setText(str) {
        this.tips.text = str
        this.tips.x = 960 - this.tips.width * .5
    }
}