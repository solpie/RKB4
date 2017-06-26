import { loadImg } from './JsFunc';
export class ScaleSprite extends PIXI.Container {
    lt: PIXI.Sprite
    t: PIXI.Sprite
    rt: PIXI.Sprite
    r: PIXI.Sprite
    rb: PIXI.Sprite
    b: PIXI.Sprite
    lb: PIXI.Sprite
    l: PIXI.Sprite
    _w: number
    _h: number
    constructor(img: HTMLImageElement, scaleRect: { x: number, y: number, width: number, height: number }) {
        super()
        let bt = new PIXI.BaseTexture(img)
        let _sp = (x, y, w, h) => {
            return new PIXI.Sprite(new PIXI.Texture(bt,
                new PIXI.Rectangle(x, y, w, h)))
        }
        let lt = _sp(0, 0, scaleRect.x, scaleRect.y)
        this.addChild(lt)
        this.lt = lt

        this.t = _sp(scaleRect.x, 0, scaleRect.width, scaleRect.y)
        this.t.x = scaleRect.x
        this.addChild(this.t)

        let rt = _sp(scaleRect.x + scaleRect.width, 0, bt.width - scaleRect.x - scaleRect.width, scaleRect.y)
        rt.x = scaleRect.x + scaleRect.width
        this.addChild(rt)
        this.rt = rt

        this.r = _sp(scaleRect.x + scaleRect.width, scaleRect.y, bt.width - scaleRect.x - scaleRect.width, scaleRect.height)
        this.r.x = scaleRect.x + scaleRect.width
        this.r.y = scaleRect.y
        this.addChild(this.r)

        this.rb = _sp(scaleRect.x + scaleRect.width, scaleRect.y + scaleRect.height, bt.width - scaleRect.x - scaleRect.width, bt.height - scaleRect.y - scaleRect.height)
        this.rb.x = scaleRect.x + scaleRect.width
        this.rb.y = scaleRect.y + scaleRect.height
        this.addChild(this.rb)

        this.b = _sp(scaleRect.x, scaleRect.y + scaleRect.height, scaleRect.width, bt.height - scaleRect.y - scaleRect.height)
        this.b.x = scaleRect.x
        this.b.y = scaleRect.y + scaleRect.height
        this.addChild(this.b)

        this.lb = _sp(0, scaleRect.y + scaleRect.height, scaleRect.x, bt.height - scaleRect.y - scaleRect.height)
        this.lb.y = scaleRect.y + scaleRect.height
        this.addChild(this.lb)

        this.l = _sp(0, scaleRect.y, scaleRect.x, scaleRect.height)
        this.l.y = scaleRect.y
        this.addChild(this.l)

    }
    get width() {
        return this._w
    }
    get height() {
        return this._h
    }
    resize(width, height) {
        this._w = width
        this._h = height
        
        let sw = width - this.lt.width - this.rt.width
        this.t.width = sw
        this.b.width = sw
        this.rt.x = this.lt.width + sw
        this.r.x = this.lt.width + sw
        this.rb.x = this.lt.width + sw

        let sh = height - this.lt.height - this.lb.height
        this.l.height = sh
        this.r.height = sh
        this.lb.y = this.lt.height + sh
        this.b.y = this.lt.height + sh
        this.rb.y = this.lt.height + sh
    }
} 