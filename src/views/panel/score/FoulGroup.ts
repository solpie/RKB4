import { blink2 } from '../../utils/Fx';
import { newBitmap } from '../../utils/PixiEx';
import { SpriteGroup } from '../../utils/SpriteGroup';
export class FoulGroup extends SpriteGroup {
    _hint: PIXI.Sprite
    setNum(v) {
        super.setNum(v)
        if (v >= 4) {
            if (!this._hint) {
                this._hint = newBitmap({
                    url: '/img/panel/score2017/foulHint.png',
                    x: -20,
                    y: -22
                })
                this.addChild(this._hint)
            }
            this._hint.visible = true
            blink2({ target: this._hint, time: 100, loop: 100 })
        }
        else if (this._hint)
            this._hint.visible = false
    }
}