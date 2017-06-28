export class TextEx {
    _x: number = 0
    _y: number = 0
    hAlign: string = 'left'//center right
    vAlign: string = 'top'//middle bottom
    t: PIXI.Text

    constructor(t: PIXI.Text) {
        this.t = t
    }

    set text(v) {
        this.t.text = v
        this.x = this._x
        this.y = this._y
    }

    get text() {
        return this.t.text
    }

    set x(v) {
        this._x = v
        if (this.hAlign == 'right') {
            console.log('set x right');
            this.t.x = this._x - this.t.width
        }
        else if (this.hAlign == 'center')
            this.t.x = this._x - .5 * this.t.width
        else
            this.t.x = this._x
    }
    get x() {
        return this._x
    }
    get y() {
        return this._y
    }

    set y(v) {
        this._y = v
        if (this.vAlign == 'bottom')
            this.t.y = this._y - this.t.height
        else if (this.vAlign == 'middle')
            this.t.y = this._y - .5 * this.t.height
        else
            this.t.y = this._y
    }
}
export class TextMaker {
    ctn: any
    lastX: number = 0
    lastY: number = 0
    constructor(parent) {
        this.ctn = parent
    }
    _cloneStyle(o) {
        let s: any = {}
        for (let k in o)
        { s[k] = o[k] }
        return s
    }

    add(option: { x: number, y: number, text?: string, style?: any, hAlign?: string, parent?: any }) {
        // this.idx++
        let s = option.style
        s = this._cloneStyle(s)
        let t = new PIXI.Text(option.text || '', s)

        if (option.parent)
            option.parent.addChild(t)
        else
            this.ctn.addChild(t)
        let tEx = new TextEx(t)
        tEx.hAlign = option.hAlign || 'left'
        tEx.x = option.x || 0
        tEx.y = option.y || 0
        this.lastX = tEx.x
        this.lastY = tEx.y
        return tEx
    }

}