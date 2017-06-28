import { TweenEx } from '../../utils/TweenEx';
import { cnWrap, loadImg, loadImgArr } from '../../utils/JsFunc';
import { getFtLogoUrl2, getFtLogoUrlgray } from '../score/Com2017';
import { loadRes, newBitmap, imgToTex } from '../../utils/PixiEx';
import { TextEx, TextMaker } from '../../utils/TextMaker';
import { IPopup } from './PopupView';
import { FontName, ViewConst } from '../const';
export class GamePlayerInfo extends PIXI.Container implements IPopup {
    ctn: any
    lAvt: PIXI.Sprite
    rAvt: PIXI.Sprite
    lFt: PIXI.Sprite
    rFt: PIXI.Sprite
    lName: TextEx
    rName: TextEx
    lInfo: TextEx
    rInfo: TextEx
    lIntro: TextEx
    rIntro: TextEx
    lLocation: TextEx
    rLocation: TextEx

    create(parent: any) {
        this.ctn = parent
        this.ctn.addChild(this)

        let modal = new PIXI.Graphics()
        modal.beginFill(0, .8)
            .drawRect(0, 0, ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT)
        this.addChild(modal)
        let bg = newBitmap({ url: '/img/panel/score/m2/gamePlayerBg.png' })
        bg.x = .5 * (ViewConst.STAGE_WIDTH - 1433)
        bg.y = 110
        this.addChild(bg)
        this.lFt = new PIXI.Sprite()
        this.lFt.x = 0
        this.lFt.y = 86
        // this.lFt.blendMode = PIXI.BLEND_MODES.MULTIPLY
        bg.addChild(this.lFt)

        this.rFt = new PIXI.Sprite()
        this.rFt.x = 715
        this.rFt.y = 86
        // this.rFt.blendMode = PIXI.BLEND_MODES.MULTIPLY
        bg.addChild(this.rFt)
        let strip = newBitmap({ url: '/img/panel/score/m2/gamePlayerStrip.png' })
        strip.blendMode = PIXI.BLEND_MODES.MULTIPLY
        strip.x = bg.x
        strip.y = bg.y + 86
        this.addChild(strip)

        let top = newBitmap({ url: '/img/panel/score/m2/gamePlayerTop.png' })
        top.x = bg.x
        top.y = bg.y
        this.addChild(top)

        let tm = new TextMaker(this)
        let nameStyle = {
            fill: '#000',
            fontWeight: 'bold',
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px'
        }

        this.lName = tm.add({ x: 567, y: 290, style: nameStyle })
        this.rName = tm.add({ x: 1348, y: this.lName.y, style: nameStyle, hAlign: 'right' })
        nameStyle.fontSize = '28px'
        this.lInfo = tm.add({ x: this.lName.x, y: this.lName.y + 64, style: nameStyle })
        this.lLocation = tm.add({ x: this.lName.x, y: this.lName.y + 120, style: nameStyle })

        this.rInfo = tm.add({ x: this.rName.x, y: this.lInfo.y, style: nameStyle, hAlign: 'right' })
        this.rLocation = tm.add({ x: this.rName.x, y: this.lLocation.y, style: nameStyle, hAlign: 'right' })

        nameStyle.fill = '#fff'
        nameStyle.fontSize = '30px'
        this.lIntro = tm.add({ x: 310, y: 680, style: nameStyle })
        this.rIntro = tm.add({ x: 1346 + 286, y: this.lIntro.y, style: nameStyle, hAlign: 'right' })

        nameStyle.fontSize = '50px'
        tm.add({ x: 310, y: 570, text: '参赛宣言', style: nameStyle })
        tm.add({ x: this.rIntro.x, y: 570, text: '参赛宣言', hAlign: 'right', style: nameStyle })

        this.lAvt = new PIXI.Sprite()
        this.lAvt.x = 310
        this.lAvt.y = 290
        this.addChild(this.lAvt)

        this.rAvt = new PIXI.Sprite()
        this.rAvt.x = 1464
        this.rAvt.y = this.lAvt.y
        this.addChild(this.rAvt)
    }

    _fixN(intro: string) {
        if (intro.search('微博') > 0) {
            intro = intro.replace('微博', '\n微博')
        }
        return intro
    }
    show(data: any) {
        let lPlayer = data.leftPlayer.data
        let rPlayer = data.rightPlayer.data
        this.lName.text = lPlayer.name
        this.rName.text = rPlayer.name
        this.lInfo.text = lPlayer.height + " cm/ " + lPlayer.weight + ' kg/ ' + lPlayer.age + " 岁"
        this.rInfo.text = rPlayer.height + " cm/ " + rPlayer.weight + ' kg/ ' + rPlayer.age + " 岁"
        // lPlayer.intro = this._fixN(lPlayer.intro)
        // rPlayer.intro = this._fixN(rPlayer.intro)
        lPlayer.intro = cnWrap(lPlayer.intro.replace('\n', ''), 32, 96)
        rPlayer.intro = cnWrap(rPlayer.intro.replace('\n', ''), 32, 96)
        this.lIntro.text = lPlayer.intro
        this.rIntro.text = rPlayer.intro

        this.lLocation.text = cnWrap(lPlayer.school, 20, 20) || '路人王'
        this.rLocation.text = cnWrap(rPlayer.school, 20, 20) || '路人王'

        loadRes(lPlayer.avatar, (img) => {
            this.lAvt.texture = imgToTex(img)
            let s = 164 / img.height
            this.lAvt.scale.x = this.lAvt.scale.y = s
        }, true);

        loadRes(rPlayer.avatar, (img) => {
            this.rAvt.texture = imgToTex(img)
            let s = 164 / img.height
            this.rAvt.scale.x = this.rAvt.scale.y = s
        }, true);


        loadImg(getFtLogoUrlgray(lPlayer.groupId), img => {
            this.lFt.texture = imgToTex(img)
            // let s = 670 / img.height
            // this.lFt.scale.x = this.lFt.scale.y = s
        })

        loadImg(getFtLogoUrlgray(rPlayer.groupId), img => {
            this.rFt.texture = imgToTex(img)
            // let s = 670 / img.height
            // this.rFt.scale.x = this.rFt.scale.y = s
        })

        this.ctn.addChild(this)
        TweenEx.delayedCall(6000, _ => {
            this.hide()
        })
    }

    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }
    // constructor() {

    // }
}