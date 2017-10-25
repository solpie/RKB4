import { TweenEx } from '../../utils/TweenEx';
import { PlayerGroup } from './PlayerGroup2';
import { newBitmap, setScale } from '../../utils/PixiEx';
import { BaseAvatar } from '../base/BaseAvatar';
import { FontName } from '../const';
import { simplifyName } from '../score/Com2017';
import { FramesFx } from '../../utils/FramesFx';
let ns = {
    fontFamily: FontName.MicrosoftYahei,
    fontWeight: 'bold',
    fontSize: '38px',
    fill: '#323232'
}
export const newPlayerBg3Blue = () => {
    let bg = newBitmap({ url: '/img/panel/process/playerBg3Blue.png' })
    let avt = new BaseAvatar('/img/panel/score/m4/avtMask.png', 148)
    bg['avt'] = avt
    avt.x = 12
    avt.y = -1

    let label = new PIXI.Text('player', ns)
    label.y = 5
    label.x = 170
    bg.addChild(label)
    bg['label'] = label

    bg.addChild(avt)
    return bg
}

export const newPlayerBg3Red = () => {
    let bg = newBitmap({ url: '/img/panel/process/playerBg3Red.png' })
    let avt = new BaseAvatar('/img/panel/score/m4/avtMask.png', 148)
    avt.x = 298
    avt.y = 6
    bg['avt'] = avt
    bg.addChild(avt)


    let label = new PIXI.Text('player', ns)
    label.y = 53
    label.x = 170
    bg.addChild(label)
    bg['label'] = label

    return bg
}

export class PlayerRoute extends PIXI.Container {
    p1FromGroup: PlayerGroup
    p2FromGroup: PlayerGroup
    WinToGroup: PlayerGroup
    loseToGroup: PlayerGroup

    p1: PIXI.Sprite
    p2: PIXI.Sprite

    winTitle: PIXI.Text
    loseTitle: PIXI.Text
    fx: FramesFx
    fx2: FramesFx

    fxCtn: PIXI.Container
    constructor() {
        super()

        let fx2 = new FramesFx('/img/fx/playerRoute/fx2_', 0, 16)
        this.fx2 = fx2
        fx2.mc.animationSpeed = 0.2
        fx2.x = 42
        this.addChild(fx2)

        this.fxCtn = new PIXI.Container()
        this.addChild(this.fxCtn)

        let bg = newBitmap({ url: '/img/panel/process/routeBg.png' })
        this.fxCtn.addChild(bg)
        bg.x = 10
        bg.y = 10

        let p1Bg = newBitmap({ url: '/img/panel/process/playerGroup2Bg.png' })
        this.fxCtn.addChild(p1Bg)

        let p2Bg = newBitmap({ url: '/img/panel/process/playerGroup2Bg.png' })
        this.fxCtn.addChild(p2Bg)

        let pg1 = new PlayerGroup(1)
        p1Bg.addChild(pg1)

        let pg2 = new PlayerGroup(2)
        p2Bg.addChild(pg2)

        this.p1FromGroup = pg1
        this.p2FromGroup = pg2

        pg2.x = pg1.x = 20
        pg2.y = pg1.y = 17

        p1Bg.x = p2Bg.x = 320
        p1Bg.y = 370
        p2Bg.y = 580

        setScale(pg1, 0.7)
        setScale(pg2, 0.7)


        let winGroup = new PlayerGroup(3)
        this.fxCtn.addChild(winGroup)

        let loseGroup = new PlayerGroup(4)
        this.fxCtn.addChild(loseGroup)

        winGroup.x = loseGroup.x = 1425
        winGroup.y = 394
        loseGroup.y = 652

        setScale(winGroup, 0.8)
        setScale(loseGroup, 0.8)
        this.WinToGroup = winGroup
        this.loseToGroup = loseGroup

        this.p1 = newPlayerBg3Blue()
        this.p2 = newPlayerBg3Red()

        this.p1.x = 770
        this.p2.x = 800

        this.p1.y = 360
        this.p2.y = 567


        this.addChild(this.p1)
        this.addChild(this.p2)
        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontWeight: 'bold',
            fontSize: '23px',
            fill: '#ffffff'
        }

        let winTitle = new PIXI.Text('胜者组', ts)
        winTitle.x = 1435
        winTitle.y = 352
        this.winTitle = winTitle
        this.fxCtn.addChild(winTitle)

        let loseTitle = new PIXI.Text('败者组', ts)
        loseTitle.x = winTitle.x
        loseTitle.y = 610
        this.loseTitle = loseTitle
        this.fxCtn.addChild(loseTitle)


        let fx = new FramesFx('/img/fx/playerRoute/fx3_', 0, 31)
        this.fx = fx
        fx.mc.animationSpeed = 0.2
        fx.x = bg.x
        fx.y = bg.y
        this.addChild(fx)

    }

    show(data) {
        if (data.isFx) {
            this.fx2.visible = true
            this.fx.alpha = 1
            this.fx.playOnce()
            this.fx2.playOnce()
            this.p1.y = 360 - 500
            this.p2.y = 567 + 500

            TweenEx.delayedCall(500, _ => {
                TweenEx.to(this.p1, 200, {
                    y: 360
                })
                TweenEx.to(this.p2, 200, {
                    y: 567
                })
            })

            this.fxCtn.alpha = 0

            TweenEx.delayedCall(1200, _ => {
                TweenEx.to(this.fxCtn, 300, { alpha: 1 })
            })
        }
        else {
            this.fx2.visible = false
        }


        let curTitle = data.tabData.title
        if (curTitle.substr(0, 1) == '败') {
            this.winTitle.text = '败者组'
            this.loseTitle.text = '淘汰'
            this.loseToGroup.visible = false

        }
        else {
            this.winTitle.text = '胜者组'
            this.loseTitle.text = '败者组'
            this.loseToGroup.visible = true
        }
        this.WinToGroup.showNameAvatar(data.win[0], data.win[1])
        this.loseToGroup.showNameAvatar(data.lose[0], data.lose[1])
        if (data.from.length) {
            this.p1FromGroup.visible = true
            this.p2FromGroup.visible = true
            this.p1FromGroup.showNameAvatar(data.from[0][0], data.from[0][1])
            this.p2FromGroup.showNameAvatar(data.from[1][0], data.from[1][1])
        }
        else {
            this.p1FromGroup.visible = false
            this.p2FromGroup.visible = false
            this.p1FromGroup.showNameAvatar(null,null)
            this.p2FromGroup.showNameAvatar(null,null)
        }
        let cur = data.cur
        this.p1['avt'].load(cur[0].data.avatar)
        this.p2['avt'].load(cur[1].data.avatar)

        this.p1['label'].text = simplifyName(cur[0].hupuID)
        this.p2['label'].text = simplifyName(cur[1].hupuID)
        this.p2['label'].x = 290 - this.p2['label'].width
    }
}