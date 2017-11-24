import { PlayerGroup } from './PlayerGroup2';
import { PlayerRoute } from './PlayerRoute';
import { imgLoader } from '../../utils/ImgLoader';
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
    gameIdxText: PIXI.Text
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
        let bg2 = newBitmap({ url: '/img/panel/process/playerBg.png' })
        this.addChild(bg2)

        bg.x = (flatBg.width - 967) * .5
        bg.y = 8

        bg2.x = bg.x
        bg2.y = bg.y

        let lMask = new PIXI.Graphics()
        lMask.beginFill(0xffffff)
            .drawRect(0, 0, 470, 84)
        lMask.x = bg.x
        this.addChild(lMask)
        bg.mask = lMask

        let rMask = new PIXI.Graphics()
        rMask.beginFill(0xffffff)
            .drawRect(470, 0, 470, 84)
        rMask.x = bg.x
        this.addChild(rMask)
        bg2.mask = rMask


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
        bg2.addChild(rpn)

        ns.fill = '#435359'
        let gtxt = new PIXI.Text("", ns)
        this.gameIdxText = gtxt
        gtxt.x = bg.x - 160
        gtxt.y = 15
        this.addChild(gtxt)

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
        bg2.addChild(rScore)


        this.lAvt = new BaseAvatar('/img/panel/score/m4/avtMask.png', 88)
        this.lAvt.x = 310
        this.lAvt.y = 2
        bg.addChild(this.lAvt)

        this.rAvt = new BaseAvatar('/img/panel/score/m4/avtMaskR.png', 88)
        this.rAvt.x = 568
        this.rAvt.y = this.lAvt.y
        bg2.addChild(this.rAvt)
    }

    odd: number
    setStrip(odd) {
        this.odd = odd
        if (odd)
            this.flatBg.alpha = .3
        else
            this.flatBg.alpha = .2
    }

    setPlayerName(l, r) {
        this.lPlayerName.text = simplifyName(l)
        fitWidth(this.lPlayerName, 270, 38)
        this.lPlayerName.x = 295 - this.lPlayerName.width
        this.rPlayerName.text = simplifyName(r)

        fitWidth(this.rPlayerName, 270, 38)
        this.rPlayerName.x = 670
    }

    setScore(l, r, tabIdx) {
        let v = !(l == 0 && r == 0)
        this.lScoreText.visible =
            this.rScoreText.visible = v
        let lP = this.lAvt.parent
        let rP = this.rAvt.parent
        lP.alpha = rP.alpha = 1
        if (v && (tabIdx == 2
            || tabIdx == 4
            || tabIdx == 6
            || tabIdx == 7
        )) {
            if (l < r) {
                lP.alpha = 0.5

            }
            else {
                rP.alpha = 0.5
            }
        }
        this.lScoreText.text = l
        this.rScoreText.text = r
    }

    setAvatar(l, r) {
        this.lAvt.load(l)
        this.rAvt.load(r)
    }
    setData(l, r, tabIdx, isShowRealName = false) {
        // this._setData(l,r,is)
        if (isShowRealName) {
            l.hupuID = l.data.realName
            r.hupuID = r.data.realName
        }
        this._setData(l, r, tabIdx)
    }
    // _setData(l, r) {
    _setData(l, r, tabIdx) {
        this.setPlayerName(l.hupuID, r.hupuID)
        this.setScore(l.score, r.score, tabIdx)

        this.setAvatar(l.data.avatar, r.data.avatar)
    }
    setGameIdx(gameIdx) {
        this.gameIdxText.text = gameIdx
    }

    setFocus(v) {
        let flatBgX = (this.flatBg.width - 967) * .5
        if (v) {
            this.flatBg.y = -5
            this.flatBg.alpha = .6
            this.x = -70
            this.gameIdxText.x = flatBgX - 110
            setScale(this, 1.1)
        }
        else {
            this.gameIdxText.x = flatBgX - 160
            this.flatBg.y = 0
            this.setStrip(this.odd)
            this.x = 0
            setScale(this, 1)
        }
    }
}
export class GameProcess extends PIXI.Container implements IPopup {
    static class = 'GameProcess'
    p: PIXI.Container
    title: PIXI.Text
    titleCtn: PIXI.Sprite
    playerItemCtn: PIXI.Container
    playerItemArr: Array<PlayerItem>

    playerItemArr2: Array<PlayerGroup>
    tabIdxPosMap: any
    tabFocus: PIXI.Sprite
    final8Bg: PIXI.Sprite
    flatBg: PIXI.Graphics
    vs: PIXI.Sprite

    playerRoute: PlayerRoute

    bgCtn: PIXI.Sprite
    create(parent: any) {
        this.p = parent
        let bg = newBitmap({ url: '/img/panel/process/bg.png' })
        this.addChild(bg)
        this.bgCtn = bg


        this.playerRoute = new PlayerRoute()
        this.playerRoute.x = -42
        this.addChild(this.playerRoute)

        let titleBg = newBitmap({ url: '/img/panel/process/title.png' })
        titleBg.x = (ViewConst.STAGE_WIDTH - 1377) * .5
        titleBg.y = 122
        this.titleCtn = titleBg

        let titleTex = newBitmap({ url: '/img/panel/process/titleTex.png' })
        titleTex.x = 520
        titleTex.y = -2


        let final8Bg = newBitmap({ url: '/img/panel/process/final8Bg.png' })
        final8Bg.x = (ViewConst.STAGE_WIDTH - 1652) * .5
        final8Bg.y = 155
        this.final8Bg = final8Bg
        this.addChild(final8Bg)

        let final8Line = newBitmap({ url: '/img/panel/process/final8Line.png' })
        final8Bg.addChild(final8Line)

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
        this.playerItemCtn.x = titleBg.x
        this.addChild(this.playerItemCtn)
        this.playerItemArr = []
        for (let i = 0; i < 8; i++) {
            let playerItem = new PlayerItem()
            playerItem.y = titleBg.y + 80 + 105 * i
            playerItem.setStrip((i) % 2)
            this.playerItemCtn.addChild(playerItem)
            this.playerItemArr.push(playerItem)
        }
        this.toPosX = 0
        this.initVSFocus(this.playerItemCtn)


        this.playerItemArr2 = []
        for (let i = 0; i < 10; i++) {
            let playerItem2 = new PlayerGroup(i + 1)
            this.playerItemArr2.push(playerItem2)
            final8Bg.addChild(playerItem2)
        }


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
        this.bgCtn.addChild(tabFocus)
        blink2({ target: tabFocus, time: 500 })
        this.tabFocus = tabFocus
    };

    initVSFocus(ctn) {
        let vs = newBitmap({ url: '/img/panel/process/vs.png' })
        this.vs = vs
        vs.x = 645
        vs.y = 225
        ctn.addChild(vs)
    }

    toPosX: number
    show(data) {
        console.log('show process data:', data);
        if (data.playerRoute) {
            this.showPlayerRoute(data)
        }
        else {
            let processParam = data.processParam
            let gamePlayerArr = processParam.gamePlayerArr

            let playerAvtArr = []
            for (let i = 0; i < gamePlayerArr.length; i++) {
                let playerArr = gamePlayerArr[i];
                if (playerArr[0].data.avatar)
                    playerAvtArr.push(playerArr[0].data.avatar)
                if (playerArr[1].data.avatar)
                    playerAvtArr.push(playerArr[1].data.avatar)
            }
            imgLoader.loadTexArr(playerAvtArr, _ => {
                // for(let p)
                this.setTitle(processParam.title)
                this.titleCtn.y = 122

                let tabIdx = processParam.idx
                this.tabFocus.x = this.tabIdxPosMap[tabIdx]
                //            final  8
                if (tabIdx == 8 || tabIdx == 9) {
                    for (let i = 0; i < gamePlayerArr.length; i++) {
                        let playerArr = gamePlayerArr[i];
                        let pi = this.playerItemArr2[i]
                        pi.setData(playerArr[0], playerArr[1], processParam.isShowRealName)
                    }
                    this.showPanel(GameProcess.PANEL_8)
                }
                else {//group
                    for (let pi of this.playerItemArr) {
                        pi.visible = false
                    }

                    this.vs.visible = false
                    for (let i = 0; i < gamePlayerArr.length; i++) {
                        let playerArr = gamePlayerArr[i];
                        let pi = this.playerItemArr[i]
                        pi.setData(playerArr[0], playerArr[1], tabIdx,processParam.isShowRealName)
                        if (processParam.gameIdx == processParam.start + i) {
                            this.setFucosPlayerItem(pi)
                        }
                        else
                            pi.setFocus(false)
                        pi.setGameIdx(processParam.start + i)
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

                    this.showPanel(GameProcess.PANEL_GROUP)
                }
                console.log('this.tabIdxPosMap', this.tabFocus.x);
                this.p.addChild(this)
            }, true)
        }
    }

    setTitle(text) {
        this.title.text = text
        this.title.x = (1377 - this.title.width) * .5
    }

    showPlayerRoute(param) {
        this.titleCtn.y = 243
        let tabData = param.tabData
        let title = ''
        if (tabData.title.substr(0, 3) == '败') {
            title = ''
        }

        this.setTitle(tabData.title.substr(0, 3))
        let tabIdx = tabData.idx
        this.tabFocus.x = this.tabIdxPosMap[tabIdx]
        this.playerRoute.show(param)
        this.bgCtn.visible = false
        this.showPanel(GameProcess.PANEL_PLAYER_ROUTE)

        if (param.isFx) {
            TweenEx.delayedCall(5500, _ => {
                this.hide()
            })
        }
    }
    static PANEL_GROUP = 1
    static PANEL_8 = 2
    static PANEL_PLAYER_ROUTE = 3
    showPanel(type) {
        this.playerRoute.visible = false
        this.playerItemCtn.visible = false
        this.flatBg.visible = false
        this.final8Bg.visible = false
        if (type == GameProcess.PANEL_PLAYER_ROUTE) {
            this.playerRoute.visible = true
        }
        else if (type == GameProcess.PANEL_GROUP) {
            this.playerItemCtn.visible = true
            this.flatBg.visible = true
            this.bgCtn.visible = true

        }
        else if (type == GameProcess.PANEL_8) {
            this.bgCtn.visible = true

            this.final8Bg.visible = true
            this.playerItemCtn.visible = false
            this.flatBg.visible = false
        }
        this.p.addChild(this)
    }

    setFucosPlayerItem(pi: PlayerItem) {
        TweenEx.delayedCall(500, _ => {
            this.vs.visible = true
            this.vs.y = pi.y + 30
            pi.setFocus(true)
        })
    }
    setFinal8() {

    }

    hide() {
        this.bgCtn.visible = true
        this.p.removeChild(this)
    }

}