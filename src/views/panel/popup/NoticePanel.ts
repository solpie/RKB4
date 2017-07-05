import { ScaleSprite } from "../../utils/ScaleSprite";
import { loadImg } from "../../utils/JsFunc";
import { newBitmap } from "../../utils/PixiEx";
import { FontName, ViewConst } from "../const";
import { IPopup } from "./PopupView";

export class NoticePanel extends PIXI.Container implements IPopup {
    static class = 'NoticePanel'
    frame: ScaleSprite
    line: PIXI.Sprite
    content: PIXI.Text
    title: PIXI.Text
    imgWidth: number
    imgHeight: number
    bg: PIXI.Graphics
    lLight: PIXI.Sprite
    rLight: PIXI.Sprite
    _content: string
    _title: string
    _isLeft: boolean
    _isBold: String

    create(parent: any) {
        parent.addChild(this)

        this.bg = new PIXI.Graphics()
        this.bg.alpha = .8
        this.addChild(this.bg)

        loadImg('/img/panel/score2017/noticeBg.png', (img) => {
            this.imgWidth = 250
            this.imgHeight = 130

            this.frame = new ScaleSprite(img, { x: 27, y: 29, width: 31, height: 27 })
            // this.frame.resize(1000, 800)
            this.addChildAt(this.frame, 1)
            this.setText(this._content, this._title, this._isLeft, this._isBold)
        })        // super()
        this.lLight = newBitmap({ url: '/img/panel/score2017/noticeLight.png' })
        this.lLight.y = 34
        this.addChild(this.lLight)
        this.rLight = newBitmap({ url: '/img/panel/score2017/noticeLight.png' })
        this.rLight.y = this.lLight.y
        this.addChild(this.rLight)
        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px', fill: "#fff",
            fontWeight: 'bold'
        }
        this.line = newBitmap({
            url: '/img/panel/score2017/noticeLine.png'
        })
        this.line.y = 48
        this.line.x = 9
        this.addChild(this.line)

        this.content = new PIXI.Text('', ts)
        this.content.y = 60
        this.addChild(this.content)

        this.title = new PIXI.Text('', ts)
        this.title.style.fontSize = '25px'
        this.title.y = 12
        this.addChild(this.title)
        this.y = 85
    }

    show(data) {
        this.setText(data.content, data.title, data.isLeft, data.isBold)
        this.visible = true
    }

    hide() {
        this.visible = false
    }
    setText(content, title, isLeft, isBold) {
        if (!title)
            title = '公告'
        this._content = content
        this._title = title
        this._isLeft = isLeft
        this._isBold = isBold

        this.content.style.fontWeight = isBold
        let lineGap = 15
        if (isBold == 'bold') {
            lineGap = 18
        }
        this.content.style.lineHeight = Number((this.content.style['fontSize'] + "").replace('px', '')) + lineGap
        this.content.text = content
        this.title.text = title
        let textWidth = Math.max(this.content.width, this.title.width)
        if (textWidth < this.imgWidth)
            textWidth = this.imgWidth
        let h = this.content.height
        if (h < this.imgHeight)
            h = this.imgHeight

        this.frame.resize(textWidth + 40, this.content.height + 15 + this.content.y)
        this.line.width = textWidth + 40 - 18
        this.content.x = 0.5 * (this.frame.width - this.content.width)

        this.title.x = 0.5 * (this.frame.width - this.title.width)


        this.bg.clear()
        let fw = this.frame.width
        let fh = this.frame.height
        this.bg.beginFill(0x000000)
            .moveTo(25, 6)
            .lineTo(fw - 8, 6)
            .lineTo(fw - 8, fh - 28)
            .lineTo(fw - 25, fh - 6)
            // .lineTo(fw - 12, fh - 28)
            // .lineTo(fw - 25, fh - 6)
            // .lineTo(fw - 12, fh - 6)
            // .lineTo(fw - 12, 26)
            .lineTo(6, fh - 6)
            .lineTo(6, 25)
        // .lineTo(25, 6)
        if (fw < 260) {
            this.lLight.visible = false
            this.rLight.visible = false
        }
        else {
            this.lLight.visible = true
            this.rLight.visible = true
            this.lLight.x = this.title.x - 75 - 8
            this.rLight.x = this.title.x + this.title.width + 8
            if (this.rLight.x + this.rLight.width - this.lLight.x > fw - 25) {
                this.lLight.visible = false
                this.rLight.visible = false
            }
        }

        if (isLeft) {
            this.x = 5
        }
        else {
            this.x = ViewConst.STAGE_WIDTH - fw - 5
        }
        this.y = (1 - .618) * (ViewConst.STAGE_HEIGHT - fh)
    }
}