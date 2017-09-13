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
    }

    setStrip(odd) {
        if (odd)
            this.flatBg.alpha = .4
        else
            this.flatBg.alpha = .2
    }

    setPlayerName(l, r) {
        this.lPlayerName.text = simplifyName(l)
        this.lPlayerName.x = 295 - this.lPlayerName.width
        this.rPlayerName.text = simplifyName(r)
        this.rPlayerName.x = 670
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
    playerItemArr: Array<PlayerItem>
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

        let flatBg = new PIXI.Graphics()
        flatBg.beginFill(0x303030)
            .drawRect(0, 0, 1377, 30)
        flatBg.x = titleBg.x
        flatBg.y = 170
        flatBg.alpha = .2
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

        this.playerItemArr = []
        for (let i = 0; i < 8; i++) {
            let playerItem = new PlayerItem()
            playerItem.y = titleBg.y + 80 + 105 * i
            playerItem.x = titleBg.x
            playerItem.setStrip((i) % 2)
            this.addChild(playerItem)
            this.playerItemArr.push(playerItem)
        }
        this.toPosX = titleBg.x


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
            pi.setPlayerName(playerArr[0].hupuID, playerArr[1].hupuID)
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
        this.p.addChild(this)
    }

    hide() {
        this.p.removeChild(this)
    }

}