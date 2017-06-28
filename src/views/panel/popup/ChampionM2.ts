import { newBitmap, newModal, loadRes, imgToTex } from '../../utils/PixiEx';
import { TextEx, TextMaker } from '../../utils/TextMaker';
import { TweenEx } from '../../utils/TweenEx';
import { FontName, ViewConst } from '../const';
import { getFtName } from '../score/Com2017';
import { IPopup } from './PopupView';
function polygon(g: PIXI.Graphics, radius, sides) {
    if (sides < 3) return;
    var a = (Math.PI * 2) / sides;
    g.moveTo(radius, 0);
    for (var i = 1; i < sides; i++) {
        g.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
    }
}
export class ChampionM2 extends PIXI.Container implements IPopup {
    title: PIXI.Sprite
    playerName: TextEx
    playerInfo: TextEx
    playerLocation: TextEx
    top: PIXI.Sprite
    info: PIXI.Sprite
    avt: PIXI.Sprite
    light: PIXI.Sprite
    // rLight: PIXI.Sprite
    ctn: any
    create(ctn) {
        this.ctn = ctn

        let back = newBitmap({ url: '/img/panel/score/m2/championBack.png' })
        back.y = ViewConst.STAGE_HEIGHT - 306

        let top = newBitmap({ url: '/img/panel/score/m2/championTop.png' })
        top.y = ViewConst.STAGE_HEIGHT - 306 - 197
        this.addChild(top)
        this.top = top

        this.addChild(back)

        let info = newBitmap({ url: '/img/panel/score/m2/championInfo.png' })
        info.y = back.y
        this.addChild(info)
        this.info = info

        let title = newBitmap({ url: '/img/panel/score/m2/championTitle.png' })
        title.y = back.y + 90
        title.x = back.x + 80
        this.addChild(title)
        title.alpha = 0
        this.title = title

        let ns = {
            fill: '#fff',
            fontWeight: 'normal',
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '38px'
        }
        let tm = new TextMaker(info)
        this.playerName = tm.add({ x: 1205, y: 72, style: ns })
        this.playerInfo = tm.add({ x: tm.lastX, y: tm.lastY + 64, style: ns })
        this.playerLocation = tm.add({ x: tm.lastX, y: tm.lastY + 57, style: ns })

        let avtMask = new PIXI.Graphics()
            .beginFill(0xff0000)
        polygon(avtMask, 121, 6)
        avtMask.x = 960
        avtMask.y = 72 + 89
        info.addChild(avtMask)

        let avt = new PIXI.Sprite()
        info.addChild(avt)
        avt.x = avtMask.x - 121
        avt.y = avtMask.y - 121
        avt.mask = avtMask
        this.avt = avt

        let light = newBitmap({ url: '/img/panel/score/m2/victoryLight.png' })
        light.y = back.y - 136
        this.light = light
        this.addChild(light)
    }


    show(data) {
        loadRes(data.avatar, img => {
            let s = 242 / img.width
            this.avt.texture = imgToTex(img)
            this.avt.scale.x = this.avt.scale.y = s
            this.onLoad(data)
        }, true);
    }
    onLoad(data) {
        this.info.x = -800
        this.top.y = ViewConst.STAGE_HEIGHT - 306 - 197
        this.title.alpha = 0
        this.light.alpha = 1
        // this.title
        new TweenEx(this.top)
            .delay(5000)
            .call(_ => {
                TweenEx.to(this.title, 80, { alpha: 1 })
                TweenEx.to(this.info, 80, { x: 0 })
                TweenEx.to(this.light, 80, { alpha: 0 })
            })
            .to({ y: 1080 }, 200)
            .start()
        TweenEx.to(this.info, 100, { x: -200 })
        this.playerName.text = data.name
        this.playerInfo.text = data.info
        this.playerLocation.text = data.location
        this.ctn.addChild(this)
    }

    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }
}