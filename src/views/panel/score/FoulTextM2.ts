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
            fontFamily: FontName.Impact,
            fontSize: '35px', fill: "#a0adb6",
        }
        let l = new PIXI.Text('', fts)
        this.addChild(l)
        this.label = l
    }

    setFoul(v) {
        if (v > 3) {
            this.label.style.fill = '#eba334'
        }
        else
            this.label.style.fill = "#a0adb6"

        let s = v + ' '
        this.label.text = s
        this.label.x = (109 - this.label.width) * .5
    }
}