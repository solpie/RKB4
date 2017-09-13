import { ViewConst, FontName } from '../const';
import { IPopup } from './PopupView';
import { newBitmap } from '../../utils/PixiEx';
class PlayerItem extends PIXI.Container {
    flatBg: PIXI.Graphics
    lPlayerName: PIXI.Text
    rPlayerName: PIXI.Text
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
    }

    setStrip(odd) {
        if (odd)
            this.flatBg.alpha = .4
        else
            this.flatBg.alpha = .2
    }

    setPlayerName(l, r) {
        this.lPlayerName.text = l
        this.lPlayerName.x = 295 - this.lPlayerName.width
        this.rPlayerName.text = r
        this.rPlayerName.x = 670
    }
}
export class GameProcess extends PIXI.Container implements IPopup {
    static class = 'GameProcess'
    p: PIXI.Container

    playerItemArr: Array<PlayerItem>
    create(parent: any) {
        this.p = parent
        let bg = newBitmap({ url: '/img/panel/process/bg.png' })
        this.addChild(bg)

        let title = newBitmap({ url: '/img/panel/process/title.png' })
        title.x = (ViewConst.STAGE_WIDTH - 1377) * .5
        title.y = 122
        this.addChild(title)

        this.playerItemArr = []
        for (let i = 0; i < 8; i++) {
            let playerItem = new PlayerItem()
            playerItem.y = title.y + 80 + 105 * i
            playerItem.x = title.x
            playerItem.setStrip((i) % 2)
            this.addChild(playerItem)
            this.playerItemArr.push(playerItem)
        }

    };

    show(data) {
        console.log('show process', data);
        let processParam = data.processParam
        let gamePlayerArr = processParam.gamePlayerArr
        for (let i = 0; i < gamePlayerArr.length; i++) {
            let playerArr = gamePlayerArr[i];
            this.playerItemArr[i].setPlayerName(playerArr[0].hupuID, playerArr[1].hupuID)
        }
        // for (let playerArr of gamePlayerArr) {
        //     this.playerItemArr[i]
        // }
        this.p.addChild(this)
    }

    hide() {
        this.p.removeChild(this)
    }

}