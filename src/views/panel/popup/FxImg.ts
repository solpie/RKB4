import { blink2 } from '../../utils/Fx';
import { TweenEx } from '../../utils/TweenEx';
import { IPopup } from "./PopupView";
import { imgLoader } from "../../utils/ImgLoader";
import { ViewConst } from '../const';
import { alignCenter, alignScrCenter } from '../../utils/PixiEx';
let crowned = '/img/fx/m6/crowned.png'

function getStraight(s) {
    return '/img/fx/m6/kill' + s + '.png'
}

let killBgUrl = '/img/fx/m6/kill.png'
let perfectUrl = '/img/fx/m6/perfect.png'
let gkUrl = '/img/fx/m6/giantKilling.png'
let championUrl = '/img/fx/m6/champion.png'

export class FxImg extends PIXI.Container implements IPopup {
    static class = 'FxImg'
    p: any

    killSp: PIXI.Sprite
    killNum: PIXI.Sprite
    killCtn: PIXI.Container
    perfectSp: PIXI.Sprite
    giantKillingSp: PIXI.Sprite
    crowned: PIXI.Sprite
    championSp: PIXI.Sprite
    rowUpArr: any
    create(parent: any) {
        let ctn = new PIXI.Container()
        this.addChild(ctn)
        this.rowUpArr = []
        let killCtn = new PIXI.Container()
        ctn.addChild(killCtn)
        this.rowUpArr.push(killCtn)

        this.killCtn = killCtn


        this.killSp = new PIXI.Sprite()
        // killCtn.y = 400
        killCtn.addChild(this.killSp)

        this.killNum = new PIXI.Sprite()
        killCtn.addChild(this.killNum)

        this.crowned = new PIXI.Sprite()
        ctn.addChild(this.crowned)
        this.rowUpArr.push(this.crowned)

        this.championSp = new PIXI.Sprite()
        ctn.addChild(this.championSp)
        this.rowUpArr.push(this.championSp)

        this.perfectSp = new PIXI.Sprite()
        // this.perfectSp.y = 600
        ctn.addChild(this.perfectSp)

        this.rowUpArr.push(this.perfectSp)

        this.giantKillingSp = new PIXI.Sprite
        // this.giantKillingSp.y = 800
        ctn.addChild(this.giantKillingSp)
        this.rowUpArr.push(this.giantKillingSp)

        // ctn.y = -300
        // ctn.x =20
        this.p = parent
    };
    static isShowFxImg(data) {
        let stateMap: any = { state: 0, isPerfect: false, isGk: data.isGk }
        let rec = data.rec
        console.log('is show fx img', rec);
        let texArr = []
        stateMap.texArr = texArr
        let straight = rec.straight
        let killNum = getStraight(straight)//'/img/fx/m6/kill' + straight + '.png'
        let gameIdx = data.gameIdx

        if (straight == 6 && rec.lose == 0) {
            texArr.push(crowned)
            stateMap.state = 1
        }
        else if (gameIdx == 62) {
            if (rec.straight > 1) {
                texArr.push(killNum)
                texArr.push(killBgUrl)
                texArr.push(championUrl)
                stateMap.state = 2
            }
        }
        else if (rec.straight > 1) {
            stateMap.state = 3
            texArr.push(killNum)
            texArr.push(killBgUrl)
        }
        if (rec.score[0] == 0 || rec.score[1] == 0) {
            texArr.push(perfectUrl)
            stateMap.isPerfect = true
        }
        if(stateMap.isGk)
        {
            texArr.push(gkUrl)
        }
        return stateMap
    }


    _showWin(param) {
        let stateMap = FxImg.isShowFxImg(param)

        let straight = param.rec.straight
        let lose = param.rec.lose
        console.log('show fx img', straight, lose);

        this.killCtn.visible = false
        this.crowned.visible = false
        this.perfectSp.visible = false
        this.giantKillingSp.visible = false
        this.championSp.visible = false

        imgLoader.loadTexArr(stateMap.texArr, _ => {
            if (stateMap.state == 1) {
                this.crowned.texture = imgLoader.getTex('/img/fx/m6/crowned.png')
                this.crowned.visible = true
                alignScrCenter(this.crowned)
            }
            else if (stateMap.state == 2) {
                //败者组连胜冠
                this.killCtn.visible = true
                this.championSp.visible = true
                this.killNum.texture = imgLoader.getTex(getStraight(straight))
                this.killSp.texture = imgLoader.getTex(killBgUrl)

                this.killCtn.x = (ViewConst.STAGE_WIDTH - (this.killNum.texture.width + 80 + this.killSp.width)) * .5
                this.killSp.x = this.killNum.x + this.killNum.width + 80

                this.championSp.texture = imgLoader.getTex(championUrl)
                alignScrCenter(this.championSp)
            }
            else if (stateMap.state == 3) {
                //连胜
                this.killCtn.visible = true
                this.killNum.texture = imgLoader.getTex(getStraight(straight))
                this.killSp.texture = imgLoader.getTex(killBgUrl)

                this.killCtn.x = (ViewConst.STAGE_WIDTH - (this.killNum.texture.width + 80 + this.killSp.width)) * .5
                this.killSp.x = this.killNum.x + this.killNum.width + 80
            }
            if (stateMap.isPerfect) {
                this.perfectSp.visible = true
                this.perfectSp.texture = imgLoader.getTex(perfectUrl)
                alignScrCenter(this.perfectSp)
            }

            if (stateMap.isGk) {
                this.giantKillingSp.visible = true
                this.giantKillingSp.texture = imgLoader.getTex(gkUrl)
                alignScrCenter(this.giantKillingSp)
            }

            let rowY = 300
            let lastHeight = 0
            for (let obj of this.rowUpArr) {
                if (obj.visible) {
                    obj.y = rowY
                    lastHeight = obj.height
                    rowY += 50 + lastHeight
                }
            }
            console.log('loaded texture');
            this.p.addChild(this)

            // blink2({ target: this, loop: 15, time: 100 })

            TweenEx.delayedCall(2000, _ => {
                this.hide()
            })
        })
    }
    show(param: any) {
        this._showWin(param)
    };
    hide(param?: any) {
        if (this.parent)
            this.p.removeChild(this)
    };

}