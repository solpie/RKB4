import { BaseAvatar } from "../base/BaseAvatar";
import { FontName } from "../const";
import { newBitmap, setScale } from "../../utils/PixiEx";
import { fitWidth } from "../bracket/BracketGroup";
import { simplifyName } from "../score/Com2017";

export class PlayerGroup extends PIXI.Container {
    lAvt: BaseAvatar
    rAvt: BaseAvatar
    lPlayerName: PIXI.Text
    rPlayerName: PIXI.Text
    constructor(idx) {
        super()
        let mask1 = new PIXI.Graphics()
        mask1.beginFill(0xffffff)
            .drawRect(0, 0, 388, 84)
        this.addChild(mask1)

        let mask2 = new PIXI.Graphics()
        mask2.beginFill(0xffffff)
            .drawRect(0, 84, 388, 84)
        this.addChild(mask2)

        let bg = newBitmap({ url: '/img/panel/process/playerBg2.png' })
        this.addChild(bg)
        bg.mask = mask1

        let bg2 = newBitmap({ url: '/img/panel/process/playerBg2.png' })
        this.addChild(bg2)
        bg2.mask = mask2

        this.lAvt = new BaseAvatar('/img/panel/score/m4/avtMask.png', 84)
        this.lAvt.x = 295
        this.lAvt.y = 3
        bg.addChild(this.lAvt)

        this.rAvt = new BaseAvatar('/img/panel/score/m4/avtMask.png', 84)
        this.rAvt.x = this.lAvt.x
        this.rAvt.y = 88
        bg2.addChild(this.rAvt)

        let ns = {
            fontFamily: FontName.MicrosoftYahei,
            fontWeight: 'bold',
            fontSize: '38px',
            fill: '#323232'
        }

        let lpn = new PIXI.Text('', ns)
        lpn.y = 8
        this.lPlayerName = lpn
        bg.addChild(lpn)

        let rpn = new PIXI.Text('', ns)
        rpn.x = lpn.x
        rpn.y = 95
        this.rPlayerName = rpn
        bg2.addChild(rpn)

        let xmap = {
            1: [55, 38],
            2: [55, 260],
            3: [30, 530],
            4: [30, 710],
            5: [440, 502],
            6: [440, 670],
            7: [830, 534],
            8: [648, 80],
            9: [1220, 528],
            10: [1132, 178],
        }

        let pos = xmap[idx]
        this.x = pos[0]
        this.y = pos[1]

        if (idx == 3
            || idx == 4
            || idx == 5
            || idx == 6
            || idx == 7
            || idx == 9
        )
            setScale(this, 0.8)

        if (idx == 10)
            setScale(this, 1.2)

        if (idx == 7) {
            mask2.y = bg2.y = 120
        }
        if (idx == 8) {
            mask2.y = bg2.y = 130
        }
        if (idx == 10) {
            mask2.y = bg2.y = 20
        }
        // let gameIdx
    }
    setData(l, r) {
        this.lPlayerName.text = simplifyName(l.hupuID)
        fitWidth(this.lPlayerName, 270, 38)
        this.lPlayerName.x = 285 - this.lPlayerName.width

        this.rPlayerName.text = simplifyName(r.hupuID)
        fitWidth(this.rPlayerName, 270, 38)
        this.rPlayerName.x = 285 - this.rPlayerName.width

        if (l.data.avatar)
            this.lAvt.load(l.data.avatar)
        if (r.data.avatar)
            this.rAvt.load(r.data.avatar)
        // let dotFilter = new PIXI.filters['DropShadowFilter']()
        let lScore = l.score, rScore = r.score
        this.lAvt.visible = this.rAvt.visible = true
        let lP = this.lAvt.parent
        let rP = this.rAvt.parent
        console.log('socre', lScore, rScore);
        if (lScore == undefined || rScore == undefined) {
            lP.alpha = rP.alpha = 1
        }
        else {
            if (lScore == 0 && rScore == 0) {
                lP.alpha = rP.alpha = 1
            }
            else {
                if (lScore < rScore) {
                    lP.alpha = 0.5
                    rP.alpha = 1
                }
                else {
                    lP.alpha = 1
                    rP.alpha = 0.5
                }
            }

        }
    }

    showNameAvatar(l, r) {
        if (l) {
            this.lPlayerName.text = simplifyName(l.hupuID)
            fitWidth(this.lPlayerName, 270, 38)
            this.lPlayerName.x = 285 - this.lPlayerName.width
            this.lAvt.visible = true
            this.lAvt.load(l.data.avatar)
        }
        else {
            this.lAvt.visible = false
            this.lPlayerName.text = ''
        }
        if (r) {
            this.rPlayerName.text = simplifyName(r.hupuID)
            fitWidth(this.rPlayerName, 270, 38)
            this.rPlayerName.x = 285 - this.rPlayerName.width
            this.rAvt.visible = true
            this.rAvt.load(r.data.avatar)
        }
        else {
            this.rAvt.visible = false
            this.rPlayerName.text = ''
        }
    }
}