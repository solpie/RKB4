import { IPopup } from './PopupView';
import { loadRes, imgToTex, newBitmap } from "../../utils/PixiEx";
import { getFtLogoUrl2, getFtName, getFtLogoUrlgray, getFtLogoUrlm } from "../score/Com2017";
import { FontName, ViewConst } from '../const';
function polygon(g: PIXI.Graphics, radius, sides) {
    if (sides < 3) return;
    var a = (Math.PI * 2) / sides;
    g.moveTo(radius, 0);
    for (var i = 1; i < sides; i++) {
        g.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
    }
}
export class GroupRankM2 extends PIXI.Container implements IPopup {
    static class = 'GroupRankM2'
    groupText: PIXI.Text
    p: any
    playerTextArr: Array<PIXI.Text> = []
    avatarArr: Array<PIXI.Sprite> = []
    ftArr: Array<PIXI.Sprite> = []
    create(parent) {
        this.p = parent
        // let modal = new PIXI.Graphics().drawRect(0, 0, ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT)
        // modal.alpha = 0.8
        // this.addChild(modal)
        let gt = this.groupText = new PIXI.Text
        gt.style.fill = '#fff'
        gt.style.fontFamily = FontName.MicrosoftYahei
        gt.style.fontSize = '50px'
        gt.x = 345
        gt.y = 170

        let bg = newBitmap({ url: '/img/panel/score/m2/groupBg.png' })
        this.addChild(bg)

        // bg.addChild(this.groupText)
        let leading = 128
        let xs = [50, 150, 790, 935]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let pt = new PIXI.Text
                pt.x = xs[j]
                pt.y = 125 + i * leading
                pt.style.fontSize = '35px'
                pt.style.fill = '#fff'
                pt.style.fontFamily = FontName.MicrosoftYahei
                pt.style.fontWeight = 'bold'
                this.playerTextArr.push(pt)
                bg.addChild(pt)
            }

            let avt = new PIXI.Sprite()
            avt.x = 145
            avt.y = 98 + i * leading
            bg.addChild(avt)
            this.avatarArr.push(avt)

            let avtMask = new PIXI.Graphics()
            avtMask.beginFill(0xff0000)
            avtMask.drawCircle(51, 51, 51)
            avtMask.x = avt.x
            avtMask.y = avt.y
            avt.mask = avtMask
            bg.addChild(avtMask)

            let ftBg = new PIXI.Graphics()
            ftBg.beginFill(0xbd9b5f)
            ftBg.x = 650
            ftBg.y = avt.y + 50
            polygon(ftBg, 52, 6)
            ftBg.rotation = 30 * PIXI.DEG_TO_RAD
            bg.addChild(ftBg)

            let ftWhite = new PIXI.Graphics()
            ftWhite.beginFill(0xffffff)
            ftWhite.x = ftBg.x
            ftWhite.y = ftBg.y
            polygon(ftWhite, 44, 6)
            ftWhite.rotation = 30 * PIXI.DEG_TO_RAD
            bg.addChild(ftWhite)


            let ft = new PIXI.Sprite()
            ft.x = ftBg.x - 35
            ft.y = ftBg.y - 35
            bg.addChild(ft)
            this.ftArr.push(ft)
        }
        bg.x = ViewConst.STAGE_WIDTH - 1018
        // bg.x = (ViewConst.STAGE_WIDTH - 1200) * .5
        bg.y = 170
    }

    show(data) {
        let group = data.group
        let playerArr = data.playerArr
        this.groupText.text = group.toLocaleUpperCase() + '组'
        for (let i = 0; i < 4; i++) {
            let p = playerArr[i]
            let ptGroupName = this.playerTextArr[i * 4]
            ptGroupName.text = group.toLocaleUpperCase()
            let ptName = this.playerTextArr[i * 4 + 1]
            ptName.text = p.name
            ptName.x = 400 - ptName.width * .5
            let ptWin = this.playerTextArr[i * 4 + 2]
            ptWin.text = p.win || (0 + "")
            let ptScore = this.playerTextArr[i * 4 + 3]
            ptScore.text = p.dtScore || (0 + "")
            let avt = this.avatarArr[i]
            loadRes(p.avatar, (img) => {
                avt.texture = imgToTex(img)
                let s = 102 / img.width
                avt.scale.x = avt.scale.y = s
            }, true);

            let ft = this.ftArr[i]
            loadRes(getFtLogoUrlm(p.groupId), (img) => {
                ft.texture = imgToTex(img)
                let s = 70 / img.width
                ft.scale.x = ft.scale.y = s
            }, false);
        }

        this.p.addChild(this)
    }

    hide() {
        this.p.removeChild(this)
    }
}