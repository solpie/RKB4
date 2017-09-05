import { newModal } from '../../utils/PixiEx';
import { IPopup } from "./PopupView";
import { FontName, ViewConst } from '../const';

export class RollText extends PIXI.Container implements IPopup {
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
        this.addChild(bg)
        this.addChild(this.rollText)
    }
    public show(param: any) {
        this.rollText.text = param.text
    }
    public hide: () => void;
    static class = 'RollText'
}