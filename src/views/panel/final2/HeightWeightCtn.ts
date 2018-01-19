import { FontName } from "../const";
import { newBitmap } from "../../utils/PixiEx";
import { TweenEx } from "../../utils/TweenEx";

export class HeightWeightCtn extends PIXI.Container {
    heightText: PIXI.Text
    weightText: PIXI.Text
    fxCtn: PIXI.Container
    isLeft = false
    constructor(isLeft) {
        super()
        this.isLeft = isLeft
        this.fxCtn = new PIXI.Container()
        this.addChild(this.fxCtn)
        let ctn = this.fxCtn

        let bg = newBitmap({ url: '/img/panel/final2/score/bg2.png' })
        if (isLeft) {

        }
        else {
            bg.scale.x = -1
            bg.x = 200
        }
        ctn.addChild(bg)


        let ps = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '28px',
            fill: '#eee',
            fontWeight: 'bold'
        }

        let ht = new PIXI.Text('', ps)
        ctn.addChild(ht)

        ht.y = 8
        this.heightText = ht
    }

    show() {
        let tx = this.isLeft ? 280 : -280;
        TweenEx.to(this.fxCtn, 150, { x: tx })
        TweenEx.delayedCall(5000, _ => {
            this.hide()
        })
    }

    hide() {
        TweenEx.to(this.fxCtn, 150, { x: 0 })
    }

    setData(data) {
        this.heightText.text = data.height + 'cm ' + data.weight + 'kg'
        if (this.isLeft)
            this.heightText.x = 165 - this.heightText.width * .5
        else
            this.heightText.x = -165 + 20 + this.heightText.width * .5

        this.show()
    }
}