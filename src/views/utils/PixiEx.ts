import { ViewConst } from '../panel/const';
import { loadImg } from "./JsFunc";
import { proxy } from "./WebJsFunc";

export function imgToTex(img): PIXI.Texture {
    return new PIXI.Texture(new PIXI.BaseTexture(img))
}
function makeSprite(parameters): PIXI.Sprite {
    let url = parameters.url;
    let isCrossOrigin = parameters.isCrossOrigin;
    let callback = parameters.callback;

    let s = new PIXI.Sprite();

    loadRes(url, (img) => {
        s.texture = imgToTex(img);
        if (callback)
            callback(s)
    }, isCrossOrigin);
    return s;
}

export function loadRes(url: string, callback, isCrossOrigin?: boolean) {
    if (isCrossOrigin) {
        let req = new XMLHttpRequest();
        req.open('GET', proxy(url), true);
        req.onload = function (res) {
            loadImg(req.responseText, callback);
        };
        req.send();
    }
    else {
        loadImg(url, callback);
    }
}

let _nullTex = imgToTex(null);
function makeTilingSprite(options): PIXI.extras.TilingSprite {
    let width = options.width;
    let height = options.height;
    let url = options.url;
    let callback = options.callback;
    let isCrossOrigin = options.isCrossOrigin;
    loadRes(url, (img) => {
        t.texture = imgToTex(img);
        if (callback)
            callback(t)
    }, isCrossOrigin);
    let t = new PIXI.extras.TilingSprite(_nullTex, width, height);
    return t
}
export function newBitmap(options: {
    url: string
    isCrossOrigin?: boolean
    callback?,
    isTiling?: boolean,
    x?: number,
    y?: number,
    width?: number,
    height?: number
}): PIXI.Sprite {
    let isTiling = options.isTiling;
    let s;
    if (isTiling) {
        s = makeTilingSprite(options);
    }
    else {
        s = makeSprite(options);
    }
    s.x = options.x ? options.x : 0;
    s.y = options.y ? options.y : 0;
    return s
}

export class BitmapText extends PIXI.Container {
    _tex: PIXI.Texture
    private mapSprite = {}
    private animations
    private frames: Array<Array<number>>
    private digis: any//<PIXI.Sprite>

    private _frameWidth: number
    private _frameHeight: number
    private _digiWidth: number
    private _digiCtn: PIXI.Container

    constructor(options: { img?: string, texture?: PIXI.Texture, text: string, frames: Array<Array<number>>, animations: any }) {
        super()
        let text = options.text
        this.animations = options.animations
        this.frames = options.frames
        this.digis = {}
        this._digiCtn = new PIXI.Container
        this.addChild(this._digiCtn)
        this.text = text;
        if (options.texture) {
            this._tex = options.texture
            this.updateTex()
        }
        else if (options.img) {
            loadRes(options.img, (img) => {
                this._tex = imgToTex(img)
                this.updateTex()
            })
        }
    }
    private updateTex() {
        for (var k in this.digis) {
            var digi = this.digis[k]
            digi['sp'].texture = this._tex
        }
    }

    // set frameWidth(v) {
    //     this._frameWidth = v
    // }

    set text(v: string) {
        var digiIdx = 0
        var num = v.charAt(digiIdx)
        while (num != '') {
            let idx = this.animations[num]
            if (idx > -1) {
                let frame = this.frames[idx]
                let ofsX = frame[0]
                let ofsY = frame[1]
                if (!this._frameWidth)
                    this._frameWidth = frame[2]
                if (!this._frameHeight)
                    this._frameHeight = frame[3]
                if (!this.digis[digiIdx]) {
                    this.digis[digiIdx] = this._makeFrame(this._frameWidth, this._frameHeight)
                }
                let digiFrame = this.digis[digiIdx]
                digiFrame.x = digiIdx * this._frameWidth
                digiFrame['idx'] = digiIdx
                digiFrame['sp'].x = - ofsX
                digiFrame['sp'].y = - ofsY

                digiIdx += 1
                num = v.charAt(digiIdx)
            }
        }
        this._digiWidth = (digiIdx - 1) * this._frameWidth
    }

    set align(align: string) {
        console.log('align right', this._digiWidth)
        if (align == 'left') {
            this._digiCtn.x = 0
        }
        else if (align == 'center') {
            this._digiCtn.x = -this._digiWidth * .5
        }
        else if (align == 'right') {
            this._digiCtn.x = -this._digiWidth
        }

    }

    _makeFrame(width, height) {
        let ctn = new PIXI.Container
        this._digiCtn.addChild(ctn)

        let msk = new PIXI.Graphics
        msk.beginFill(0xff0000)
            .drawRect(0, 0, width, height)
            .endFill()
        ctn.addChild(msk)

        let s = new PIXI.Sprite(this._tex)
        ctn.addChild(s)
        s.mask = msk
        ctn['sp'] = s
        return ctn
    }
}
export const newModal = (alpha = 0.8, width?, height?) => {
    if (!width)
        width = ViewConst.STAGE_WIDTH
    if (!height)
        height = ViewConst.STAGE_HEIGHT
    let m = new PIXI.Graphics()
    m.drawRect(0, 0, width, height)
        .alpha = alpha
    return m
}
export let newWhiteMask = (url) => {
    let sp = newBitmap({
        url: url, callback: () => {
            var filter = new PIXI.filters.ColorMatrixFilter();
            filter.brightness(100)
            sp.filters = [filter]
            sp.cacheAsBitmap = true
        }
    })
    return sp
}

export let makeColorRatio = (colorArr: Array<string>, ratioArr: Array<number>) => {
    var a = []
    for (var i = 0; i < colorArr.length; i++) {
        var col = colorArr[i];
        for (var j = 0; j < ratioArr[i]; j++) {
            a.push(col)
        }
    }
    return a
}
// namespace PIXI{
class TextEx extends PIXI.Text {
    align
    set text(t) {
        this._text = t
        if (this.align == 'center') {

        }
        // super.text = t
    }
}
// }

export let setPivot = (obj, x, y) => {
    //set obj x y before call this
    obj.pivot = new PIXI.Point(x, y)
    obj.x += x
    obj.y += y
}
export let PIXI_MOUSE_EVENT = {
    mousedown: 'mousedown',
    click: 'click',
}

export function polygon(g: PIXI.Graphics, radius, sides) {
    if (sides < 3) return;
    var a = (Math.PI * 2) / sides;
    g.moveTo(radius, 0);
    for (var i = 1; i < sides; i++) {
        g.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
    }
}