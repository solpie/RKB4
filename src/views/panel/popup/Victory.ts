import { loadImg } from '../../utils/JsFunc';
import { imgToTex, loadRes, newBitmap, newModal, newWhiteMask } from '../../utils/PixiEx';
import { TextEx, TextMaker } from '../../utils/TextMaker';
import { TweenEx } from '../../utils/TweenEx';
import { FontName } from '../const';
import { IPopup } from './PopupView';

export class Victory extends PIXI.Container implements IPopup {
    static class = 'Victory'
    ctn: any
    avt: PIXI.Sprite
    winLoseText: TextEx
    nameText: TextEx
    infoText: TextEx
    locationText: TextEx
    create(parent: any) {
        this.ctn = parent
        this.ctn.addChild(this)

        this.addChild(newModal(0.2))

        let bg = newBitmap({ url: '/img/panel/score/m2/victory.png' })
        this.addChild(bg)
        bg.y = 365

        let avt = new PIXI.Sprite()
        this.avt = avt
        avt.x = 840
        avt.y = 123 + 49
        bg.addChild(avt)


        let avtMask = new PIXI.Graphics()
        avtMask.beginFill(0xff0000)
        avtMask.drawCircle(115, 115, 115)
        avtMask.x = avt.x
        avtMask.y = avt.y
        avt.mask = avtMask
        bg.addChild(avtMask)


        let ns = {
            fill: '#fff',
            fontWeight: 'bold',
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '83px'
        }

        let tm = new TextMaker(bg)
        this.winLoseText = tm.add({ x: 480, y: 237, style: ns })
        ns.fontSize = '38px'
        ns.fontWeight = 'normal'
        this.nameText = tm.add({ x: 1205, y: 115 + 90, style: ns })
        this.infoText = tm.add({ x: tm.lastX, y: tm.lastY + 64, style: ns })
        this.locationText = tm.add({ x: tm.lastX, y: tm.lastY + 57, style: ns })

        let light = newBitmap({ url:'/img/panel/score/m2/victoryLight.png'})
        light.x = bg.x
        light.y = bg.y
        this.addChild(light)
    }

    show(param: any) {
        console.log('show Victory',param);
        this.winLoseText.text = param.rec.win + '胜' + param.rec.lose + '负'
        let win = param.winner
        this.nameText.text = win.name
        this.infoText.text = win.height + 'cm / ' + win.weight + 'kg / ' + win.age + '岁'
        this.locationText.text = win.school
        console.log('show victory', param)

        loadRes(win.avatar, img => {
            let s = 230 / img.width
            this.avt.texture = imgToTex(img)
            this.avt.scale.x = this.avt.scale.y = s
            
            this.ctn.addChild(this)
            TweenEx.delayedCall(4000, _ => {
                this.hide()
            })
        }, true);


    }

    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }
}