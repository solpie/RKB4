import { IPopup } from "./PopupView";
import { imgLoader } from "../../utils/ImgLoader";
import { TweenEx } from "../../utils/TweenEx";

export class ComboSp extends PIXI.Container implements IPopup {
    static class = 'ComboSp'
    p: any
    comboSp: PIXI.Sprite
    comboNum: PIXI.Sprite
    rushHit: number = 0;
    timerId: number
    rushTime: number = 500 * 6
    rushCount: number = 0
    isLastLeft: boolean = true
    create(parent: any) {
        this.p = parent
        this.comboSp = new PIXI.Sprite
        this.addChild(this.comboSp)

        this.comboNum = new PIXI.Sprite
        this.addChild(this.comboNum)
        this.timerId = setInterval(_ => {
            this.rushCount -= 100

            this.comboNum.alpha = this.comboSp.alpha = this.rushCount / this.rushTime
            if (this.rushCount < 0) {
                this.rushHit = 0
                this.hide()
            }
        }, 100)
    }
    show(data) {
        // FxImg
        console.log('show combo', data);
        let comboTexArr = [
            '/img/fx/m6/combo.png',
            '/img/fx/m6/1.png',
            '/img/fx/m6/2.png',
            '/img/fx/m6/3.png',
            '/img/fx/m6/4.png',
            '/img/fx/m6/5.png',
            '/img/fx/m6/6.png',
            '/img/fx/m6/7.png',
            '/img/fx/m6/8.png',
        ]

        imgLoader.loadTexArr(comboTexArr, _ => {
            if (this.isLastLeft != data.isLeft) {
                this.rushHit = 0
                this.isLastLeft = data.isLeft
            }

            this.rushHit++
            if (this.rushHit > 8)
                this.rushHit = 8
            this.comboSp.texture = imgLoader.getTex('/img/fx/m6/combo.png')
            this.comboNum.texture = imgLoader.getTex('/img/fx/m6/' + this.rushHit + '.png')
            // this.comboSp.x = 100
            if (data.isLeft)
                this.comboSp.x = 200
            else
                this.comboSp.x = 1500

            this.comboNum.alpha = this.comboSp.alpha = 1
            this.comboNum.x = this.comboSp.x - 125
            this.comboNum.y = this.comboSp.y = 700
            this.rushCount = this.rushTime
            // TweenEx.delayedCall(500, _ => {

            // })
            this.p.addChild(this)
        })

    }

    countDown() {

    }
    hide() {
        if (this.parent)
            this.p.removeChild(this)
    }
    _showCombo() {

    }
}
