import { newBitmap, setScale } from '../../utils/PixiEx';
import { imgLoader } from "../../utils/ImgLoader";

export class BaseAvatar extends PIXI.Container {
    msk: PIXI.Sprite
    avt: PIXI.Sprite
    avtWidth
    isLoaded = false
    constructor(maskUrl, width) {
        super()
        this.avtWidth = width
        imgLoader.loadTex(maskUrl, tex => {
            this.isLoaded = true
            this.msk = new PIXI.Sprite(tex)
            setScale(this.msk, this.avtWidth / tex.width)
            this.addChild(this.msk)

            this.avt = new PIXI.Sprite()
            this.addChild(this.avt)
            this.avt.mask = this.msk

            if (this.waitUrl) {
                this.load(this.waitUrl)
                this.waitUrl = null
            }
        })
    }
    waitUrl: string
    load(url) {
        if (url) {
            if (this.isLoaded)
                imgLoader.loadTex(url, tex => {
                    let avt = this.avt
                    avt.texture = tex
                    let s = this.avtWidth / tex.width
                    avt.x = avt.mask.x// - avt.texture.width * .5 * s
                    avt.scale.x = avt.scale.y = s
                    avt.y = avt.mask.y - (avt.height - avt.mask.height) * .5
                })
            else {
                this.waitUrl = url
            }
        }
    }
}