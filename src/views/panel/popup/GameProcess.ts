import { BaseAvatar } from '../base/BaseAvatar';
import { blink2 } from '../../utils/Fx';
import { fitWidth } from '../bracket/BracketGroup';
import { TweenEx } from '../../utils/TweenEx';
import { simplifyName } from '../score/Com2017';
import { ViewConst, FontName } from '../const';
import { IPopup } from './PopupView';
import { newBitmap, setScale } from '../../utils/PixiEx';
class PlayerItem extends PIXI.Container {
    flatBg: PIXI.Graphics
    lPlayerName: PIXI.Text
    rPlayerName: PIXI.Text
    lScoreText: PIXI.Text
    rScoreText: PIXI.Text
    lAvt: BaseAvatar
    rAvt: BaseAvatar
    constructor() {
        super()
        let flatBg = new PIXI.Graphics()
        flatBg.beginFill(0x303030)
            .drawRect(0, 0, 1377, 100)
        this.addChild(flatBg)
        flatBg.alpha = .2
        this.flatBg = flatBg

        let bg = newBitmap({ url: '/img/panel/process/playerBg.png' })
        this.addChild(bg)

        bg.x = (flatBg.width - 967) * .5
        bg.y = 8


        let ns = {
            fontFamily: FontName.MicrosoftYahei,
            fontWeight: 'bold',
            fontSize: '38px',
            fill: '#323232'
        }

        let lpn = new PIXI.Text('', ns)
        lpn.y = 10
        this.lPlayerName = lpn
        bg.addChild(lpn)

        let rpn = new PIXI.Text('', ns)
        rpn.y = lpn.y
        this.rPlayerName = rpn
        bg.addChild(rpn)

        ns.fontSize = '56px'
        ns.fill = '#fff'
        let lScore = new PIXI.Text('3', ns)
        lScore.y = 5
        lScore.x = 424
        this.lScoreText = lScore
        bg.addChild(lScore)

        let rScore = new PIXI.Text('2', ns)
        rScore.x = 510
        rScore.y = lScore.y
        this.rScoreText = rScore
        bg.addChild(rScore)


        this.lAvt = new BaseAvatar('/img/panel/score/m4/avtMask.png', 88)
        this.lAvt.x = 310
        this.lAvt.y = 2
        bg.addChild(this.lAvt)

        this.rAvt = new BaseAvatar('/img/panel/score/m4/avtMaskR.png', 88)
        this.rAvt.x = 568
        this.rAvt.y = this.lAvt.y
        bg.addChild(this.rAvt)
    }

    setStrip(odd) {
        if (odd)
            this.flatBg.alpha = .4
        else
            this.flatBg.alpha = .2
    }

    _fitName(labal: PIXI.Text) {
        if (labal.width > 300)
            labal.style.fontSize = '40px'
    }

    setPlayerName(l, r) {
        this.lPlayerName.text = simplifyName(l)
        fitWidth(this.lPlayerName, 270, 38)
        this.lPlayerName.x = 295 - this.lPlayerName.width
        this.rPlayerName.text = simplifyName(r)
        fitWidth(this.rPlayerName, 270, 38)
        this.rPlayerName.x = 670
    }

    setScore(l, r) {
        this.lScoreText.text = l
        this.rScoreText.text = r
    }

    setAvatar(l, r) {
        this.lAvt.load(l)
        this.rAvt.load(r)
    }

    setData(l, r) {
        this.setPlayerName(l.hupuID, r.hupuID)
        this.setScore(l.score, r.score)
        this.setAvatar(l.data.avatar, r.data.avatar)
    }

    setFocus(v) {
        if (v) {
            this.flatBg.alpha = .7
            setScale(this, 1.2)
        }
        else {
            setScale(this, 1)
        }
    }
}
export class GameProcess extends PIXI.Container implements IPopup {
    static class = 'GameProcess'
    p: PIXI.Container
    title: PIXI.Text
    playerItemCtn: PIXI.Container
    playerItemArr: Array<PlayerItem>
    tabIdxPosMap: any
    tabFocus: PIXI.Sprite
    final8Bg: PIXI.Sprite
    flatBg: PIXI.Graphics
    create(parent: any) {
        this.p = parent
        let bg = newBitmap({ url: '/img/panel/process/bg.png' })
        this.addChild(bg)

        let titleBg = newBitmap({ url: '/img/panel/process/title.png' })
        titleBg.x = (ViewConst.STAGE_WIDTH - 1377) * .5
        titleBg.y = 122

        let titleTex = newBitmap({ url: '/img/panel/process/titleTex.png' })
        titleTex.x = 520
        titleTex.y = -2


        let final8Bg = newBitmap({ url: '/img/panel/process/final8Bg.png' })
        final8Bg.x = (ViewConst.STAGE_WIDTH - 1652) * .5
        final8Bg.y = 155
        this.final8Bg = final8Bg
        this.addChild(final8Bg)

        let flatBg = new PIXI.Graphics()
        flatBg.beginFill(0x303030)
            .drawRect(0, 0, 1377, 30)
        flatBg.x = titleBg.x
        flatBg.y = 170
        flatBg.alpha = .2
        this.flatBg = flatBg
        let ns = {
            fontFamily: FontName.MicrosoftYahei,
            fontWeight: 'bold',
            fontSize: '56px',
            fill: '#fff'
        }
        this.title = new PIXI.Text('', ns)
        this.title.y = 1
        titleTex.mask = this.title
        titleBg.addChild(this.title)
        titleBg.addChild(titleTex)
        this.addChild(flatBg)
        this.addChild(titleBg)


        this.playerItemCtn = new PIXI.Container()
        this.addChild(this.playerItemCtn)
        this.playerItemArr = []
        for (let i = 0; i < 8; i++) {
            let playerItem = new PlayerItem()
            playerItem.y = titleBg.y + 80 + 105 * i
            playerItem.x = titleBg.x
            playerItem.setStrip((i) % 2)
            this.playerItemCtn.addChild(playerItem)
            this.playerItemArr.push(playerItem)
        }
        this.toPosX = titleBg.x


        let tab1x = 262
        this.tabIdxPosMap = [
            0,
            tab1x,
            tab1x + 163 * 1,
            tab1x + 163 * 2 + 8,
            tab1x + 12 + 163 * 3,
            tab1x + 10 + 163 * 4 + 12,
            tab1x + 163 * 5 + 12 + 12,
            tab1x + 163 * 6 + 30,
            tab1x + 163 * 7 + 36,
            tab1x + 163 * 8 + 38,
        ]
        let tabFocus = newBitmap({ url: '/img/panel/process/tabFocus.png' })
        tabFocus.x = 253
        tabFocus.y = 104
        this.addChild(tabFocus)
        blink2({ target: tabFocus, time: 500 })
        this.tabFocus = tabFocus



    };
    toPosX: number
    show(data) {
        console.log('show process', data);
        let processParam = data.processParam
        let gamePlayerArr = processParam.gamePlayerArr

        for (let pi of this.playerItemArr) {
            pi.visible = false
        }

        for (let i = 0; i < gamePlayerArr.length; i++) {
            let playerArr = gamePlayerArr[i];
            let pi = this.playerItemArr[i]
            pi.setData(playerArr[0], playerArr[1])
            let odd = i % 2
            if (odd) {
                pi.x = -pi.width
            }
            else
                pi.x = ViewConst.STAGE_WIDTH
            pi.visible = true
        }

        for (let i = 0; i < this.playerItemArr.length; i++) {
            let pi = this.playerItemArr[i]
            TweenEx.to(pi, 200, { x: this.toPosX })
        }
        // for(let p)
        this.title.text = processParam.title
        this.title.x = (1377 - this.title.width) * .5


        let tabIdx = processParam.idx
        this.tabFocus.x = this.tabIdxPosMap[tabIdx]
        if (tabIdx == 8 || tabIdx == 9) {
            this.final8Bg.visible = true
            this.playerItemCtn.visible = false
            this.flatBg.visible = false
        }
        else {
            this.playerItemCtn.visible = true
            this.flatBg.visible = true
            this.final8Bg.visible = false
        }
        console.log('this.tabIdxPosMap', this.tabFocus.x);
        this.p.addChild(this)
    }

    hide() {
        this.p.removeChild(this)
    }

}