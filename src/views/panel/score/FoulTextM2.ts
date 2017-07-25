import { blink2 } from '../../utils/Fx';
import { newBitmap } from '../../utils/PixiEx';
import { FontName } from '../const';
export class FoulTextM2 extends PIXI.Container {
    label: PIXI.Text
    hasHint: boolean
    constructor() {
        super()
        this.hasHint = true

        let fts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '30px', fill: "#fff",
            fontWeight: 'bold'
        }
        let l = new PIXI.Text('', fts)
        this.addChild(l)
        this.label = l
    }

    setFoul(v) {
        let s = v + ' '
        this.label.text = s
        this.label.x = (109 - this.label.width) * .5
    }
}