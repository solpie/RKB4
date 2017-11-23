import { blink2 } from '../../utils/Fx';
import { TweenEx } from '../../utils/TweenEx';
import { IPopup } from "./PopupView";
import { imgLoader } from "../../utils/ImgLoader";

export class FxImg extends PIXI.Container implements IPopup {
    create(parent: any) {
        let ctn = new PIXI.Container()
        this.addChild(ctn)

        this.killSp = new PIXI.Sprite()
        ctn.addChild(this.killSp)

        this.killNum = new PIXI.Sprite()
        ctn.addChild(this.killNum)

        ctn.y = -300
        ctn.x = 40
        this.p = parent
    };
    killSp: PIXI.Sprite
    killNum: PIXI.Sprite
    show(param: any) {
        console.log('show fx img');
        let straight = param.rec.straight
        let killNum = '/img/fx/m6/kill' + straight + '.png'
        let killBg = '/img/fx/m6/kill.png'
        imgLoader.loadTexArr([killNum, killBg], _ => {
            this.killNum.texture = imgLoader.getTex(killNum)
            this.killSp.texture = imgLoader.getTex(killBg)

            console.log('loaded texture');
            this.p.addChild(this)

            blink2({ target: this, loop: 15, time: 100 })

            TweenEx.delayedCall(4500, _ => {
                this.hide()
            })
        })
    };
    hide(param?: any) {
        if (this.parent)
            this.p.removeChild(this)
    };
    static class = 'FxImg'
    p: any

}