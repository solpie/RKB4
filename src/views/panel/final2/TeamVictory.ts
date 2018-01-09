import { newBitmap } from "../../utils/PixiEx";
import { TeamVictoryItem } from './TeamVictoryItem';
import { TweenEx } from '../../utils/TweenEx';
import { imgLoader } from "../../utils/ImgLoader";

export class TeamVictory extends PIXI.Container {
    p: any
    itemArr = []
    constructor(parent) {
        super()
        this.p = parent

    }
    isLoad = false
    preload(callback) {
        if (!this.isLoad)
            imgLoader.loadTexArr([
                '/img/panel/final2/victory/bg.png',
                '/img/panel/final2/victory/itemBg.png',
                '/img/panel/final2/victory/avtMask.png',
                '/img/panel/final2/victory/itemFrame.png',
                '/img/panel/final2/victory/barBg.png' ,
                '/img/panel/final2/victory/bar.png' ,
            ], _ => {
                let bg = newBitmap({ url: '/img/panel/final2/victory/bg.png' })
                this.addChild(bg)
                for (let i = 0; i < 5; i++) {
                    let item = new TeamVictoryItem()
                    this.addChild(item)
                    item['ty'] = 0 + i * 125
                    item['idx'] = i
                    item.x = 0
                    this.itemArr.push(item)
                }
                this.isLoad = true
                callback()
            })
        else {
            callback()
        }

    }
    show() {
        this.preload(_ => {
            this.p.addChild(this)
            for (let i = 0; i < this.itemArr.length; i++) {
                let item = this.itemArr[i];
                this.moveIn2(item)
            }
        })
    }
    moveIn2(item2) {
        item2.y = item2['ty'] - 500
        item2.alpha = 0
        TweenEx.delayedCall(item2['idx'] * 80, _ => {
            console.log('item idx', item2['idx']);
            TweenEx.to(item2, 120, { y: item2['ty'], alpha: 1 })
        })
    }
    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }
}