import { IPopup } from './PopupView';
import { loadRes, imgToTex, newBitmap } from "../../utils/PixiEx";
import { getFtLogoUrl2, getFtName } from "../score/Com2017";
import { ViewConst } from "../const";

export class GroupRank extends PIXI.Container implements IPopup {
    static class = 'GroupRank'
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
        gt.style.fontSize = '50px'
        gt.x = 345
        gt.y = 170
        let bg = newBitmap({ url: '/img/panel/group/bg.png' })
        this.addChild(bg)
        bg.addChild(this.groupText)
        let xs = [100, 565, 835, 1080]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let pt = new PIXI.Text
                pt.x = xs[j]
                pt.y = 262 + i * 80
                pt.style.fontSize = '35px'
                pt.style.fontWeight = 'bold'
                this.playerTextArr.push(pt)
                bg.addChild(pt)
            }
            let avt = new PIXI.Sprite()
            avt.y = 252 + i * 80
            avt.x = 20
            bg.addChild(avt)
            this.avatarArr.push(avt)

            let ft = new PIXI.Sprite()
            ft.y = avt.y
            ft.x = 495
            bg.addChild(ft)
            this.ftArr.push(ft)
        }
        bg.x = (ViewConst.STAGE_WIDTH - 1200) * .5
        bg.y = ViewConst.STAGE_HEIGHT - 558
    }

    show(data) {
        let group = data.group
        let playerArr = data.playerArr
        this.groupText.text = group.toLocaleUpperCase() + '组'
        for (let i = 0; i < 4; i++) {
            let p = playerArr[i]
            let ptName = this.playerTextArr[i * 4]
            ptName.text = p.name
            let ptFt = this.playerTextArr[i * 4 + 1]
            ptFt.text = getFtName(p.groupId)
            let ptWin = this.playerTextArr[i * 4 + 2]
            ptWin.text = p.win || (0 + "")
            let ptScore = this.playerTextArr[i * 4 + 3]
            ptScore.text = p.dtScore || (0 + "")
            let avt = this.avatarArr[i]
            loadRes(p.avatar, (img) => {
                avt.texture = imgToTex(img)
                let s = 60 / img.width
                avt.scale.x = avt.scale.y = s
            }, true);

            let ft = this.ftArr[i]
            loadRes(getFtLogoUrl2(p.groupId), (img) => {
                ft.texture = imgToTex(img)
                let s = 60 / img.width
                ft.scale.x = ft.scale.y = s
            }, false);
        }

        this.p.addChild(this)
    }

    hide() {
        this.p.removeChild(this)
    }
}