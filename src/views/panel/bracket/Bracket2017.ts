import { loadImg, loadImgArr } from '../../utils/JsFunc';
import { groupPosMap } from './BracketGroup';
import { TweenEx } from '../../utils/TweenEx';
import { blink2 } from '../../utils/Fx';
import { ViewConst } from '../const';
import { imgToTex, loadRes, newBitmap } from '../../utils/PixiEx';
export class Bracket2017 extends PIXI.Container {
    comingTitle: PIXI.Sprite
    hint1Tex: PIXI.Texture
    hint2Tex: PIXI.Texture
    constructor(parent: PIXI.Container) {
        super()
        parent.addChild(this)

        let bg = newBitmap({
            url: "/img/panel/bracket/tile2.png",
            isTiling: true,
            width: ViewConst.STAGE_WIDTH,
            height: ViewConst.STAGE_HEIGHT
        });
        bg.alpha = 0.8;
        this.addChild(bg)
        let hintCtn = new PIXI.Container()
        this.addChild(hintCtn)

        let frame = newBitmap({
            url: '/img/panel/bracket/bg1.png'
        })
        this.addChild(frame)

        this.comingTitle = newBitmap({ url: '/img/panel/bracket/coming.png' })
        this.comingTitle.visible = false
        this.addChild(this.comingTitle)

        for (let idx in groupPosMap) {
            var ctn = new PIXI.Container()
            this.addChild(ctn)

            let g = groupPosMap[idx];
            console.log(g)
            ctn.x = g.x
            ctn.y = g.y

            // let rect = new PIXI.Graphics()
            //     .beginFill(0xff0000, .4)
            //     .drawRect(0, 0, 200, 120)
            // ctn.addChild(rect)

            let h1 = new PIXI.Sprite()
            h1.x = g.x + 170
            h1.y = g.y + 50
            h1.scale.y = -1
            hintCtn.addChild(h1)
            g.hint1 = h1

            let h2 = new PIXI.Sprite()
            h2.x = h1.x
            h2.y = g.y + 49
            hintCtn.addChild(h2)
            g.hint2 = h2

            ctn.addChild(g.scores[0])
            ctn.addChild(g.scores[1])
            ctn.addChild(g.labels[0])
            ctn.addChild(g.labels[1])
        }
        loadImgArr(['/img/panel/bracket/hint1.png', '/img/panel/bracket/hint2.png'], (img) => {
            let tex = imgToTex(img[0])
            this.hint1Tex = tex
            this.hint2Tex = imgToTex(img[1])
            console.log('load tex', hintCtn.children)
            for (let c of hintCtn.children) {
                (c as PIXI.Sprite).texture = tex
            }
        })
    }
    setWinHint(sp: PIXI.Sprite, isFlip = false) {
        sp.texture = this.hint2Tex
        // if (isFlip)
        //     sp.scale.y = -1
    }
    hideComing() {
        this.comingTitle.visible = false;
    }
    showComingIdx(idx) {
        let g = groupPosMap[idx];
        this.comingTitle.visible = false
        TweenEx.delayedCall(610, () => {
            if (g) {
                this.comingTitle.visible = true;
                this.comingTitle.x = g.x - 38;
                this.comingTitle.y = g.y - 43;
                blink2({ target: this.comingTitle, time: 600 });
            }
        })
    }
}