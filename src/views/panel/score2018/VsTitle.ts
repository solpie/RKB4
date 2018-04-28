import { TweenEx } from "../../utils/TweenEx";
import { gradientG } from "../../utils/PixiEx";
import { FontName } from "../const";

export class VsTitle extends PIXI.Container {
    static class = 'VsTitle'
    content: PIXI.Text
    bg: PIXI.Graphics
    constructor() {
        super()

    }
    p: any
    lText: PIXI.Text
    rText: PIXI.Text
    create(parent: any) {
        this.p = parent
        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px', fill: "#e1dfed",
            fontWeight: 'bold'
        }

        let bg = new PIXI.Graphics()
        this.addChild(bg)
        this.bg = bg

        let content = new PIXI.Text('', ts)
        this.content = content
        this.addChild(content)
        content.y = 825

        let vs = new PIXI.Text('vs', ts)
        // this.addChild(vs)
        this.lText = vs
        vs = new PIXI.Text('vs', ts)
        // this.addChild(vs)
        this.rText = vs
        // vs.y = content.y
    }

    show(data) {
        if (data.vs) {
            let a = data.vs.split(' ')
            console.log('show', data, a);
            if (a.length == 2) {
                let ln = a[0]
                let rn = a[1]//data.right
                this.lText.text = ln
                this.rText.text = rn
                if (this.lText.width > this.rText.width) {
                    while (this.lText.width > this.rText.width) {
                        this.rText.text = ' ' + this.rText.text + " "
                    }
                }
                if (this.lText.width < this.rText.width) {
                    while (this.lText.width < this.rText.width) {
                        this.lText.text = ' ' + this.lText.text + " "
                    }
                }

                this.content.text = this.lText.text + ' vs ' + this.rText.text
                this.content.x = 960 - this.content.width * .5
                let cx = this.content.x
                let cy = this.content.y
                let cw = this.content.width
                let ch = this.content.height
                let g = this.bg
                let t = this.content
                let barH = 5
                g.clear()
                g.beginFill(0xffffff, 0.38)
                    .drawRect(cx - 15, cy - 15, cw + 30, ch + 30)
                    .endFill()

                    .beginFill(0x000000, 1)
                    .drawRect(cx - 10, cy - 10, cw + 20, ch + 20)
                    .endFill()
                gradientG(g, cx - 10, cy - 10, cw + 20, ch + 20, 0x414665, 0x1a203e)
                g.beginFill(0xffffff, 1)
                    .drawRect(cx - 10, cy - 10, cw + 20, barH)
                    .moveTo(960 - 15, cy - 10 + barH)
                    .lineTo(960 + 15, cy - 10 + barH)
                    .lineTo(960 + 10, cy - 5 + barH)
                    .lineTo(960 - 10, cy - 5 + barH)
                // this.alpha = 0
                // this.p.addChild(this)
                // TweenEx.to(this, 300, { alpha: 1 })
            }
        }
        else {
            // this.alpha = 0
            // this.p.addChild(this)
            // TweenEx.to(this, 300, { alpha: 1 })
        }
        this.alpha = 0
        this.p.addChild(this)
        TweenEx.to(this, 300, { alpha: 1 })
    }

    hide() {
        if (this.parent) {
            TweenEx.to(this, 300, { alpha: 0 })
                .call(_ => {
                    this.parent.removeChild(this)
                })
        }
    }
}