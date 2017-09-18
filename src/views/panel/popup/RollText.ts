import { TweenEx } from '../../utils/TweenEx';
import { newModal } from '../../utils/PixiEx';
import { IPopup } from "./PopupView";
import { FontName, ViewConst } from '../const';

export class RollText extends PIXI.Container implements IPopup {
    static class = 'RollText'
    rollText: PIXI.Text
    public create(parent) {
        parent.addChild(this)
        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '32px', fill: "#fff",
            fontWeight: 'bold'
        }

        this.rollText = new PIXI.Text('', ts)
        // this.rollText.style.fontSize = '25px'
        this.rollText.y = ViewConst.STAGE_HEIGHT - 50

        let bg = newModal()
        bg.y = this.rollText.y - 10
        this.addChild(bg)
        this.addChild(this.rollText)
    }

    public show(param: any) {
        console.log('show roll text');
        TweenEx.to(this, 50, { alpha: 1 })
        this.rollText.text = param.text
        this.rollText.x = ViewConst.STAGE_WIDTH - 100
        let sec = (this.rollText.width + this.rollText.x) / 80
        TweenEx.to(this.rollText, sec * 1000, { x: -this.rollText.width }, _ => {
            this.hide()
        })
    }

    public hide() {
        console.log('hide roll text');
        TweenEx.to(this, 200, { alpha: 0 })
    }
}