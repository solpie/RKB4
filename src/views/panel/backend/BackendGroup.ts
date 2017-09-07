import { fitWidth } from '../bracket/BracketGroup';
import { cutText, newBitmap } from '../../utils/PixiEx';
export class BackendGroup extends PIXI.Container {
    lPlayerName: PIXI.Text
    rPlayerName: PIXI.Text
    lScore: PIXI.Text
    rScore: PIXI.Text

    constructor(idx) {
        super()
        let bg1 = newBitmap({ url: '/img/panel/backend/playerPad.png' })
        // bg1.alpha = .4
        this.addChild(bg1)

        let bg2 = newBitmap({ url: '/img/panel/backend/playerPad.png' })
        bg2.y = 50
        this.addChild(bg2)


        let s = { font: '35px', fill: '#000', align: 'right', fontWeight: 'normal' };

        let pn = new PIXI.Text("player 1", s)
        pn.x = 10
        pn.y = 2
        bg2.alpha = .4

        bg1.addChild(pn)
        this.lPlayerName = pn

        pn = new PIXI.Text("player 2", s)
        pn.x = 10
        pn.y = 2
        bg2.addChild(pn)
        this.rPlayerName = pn

        // s.fill = '#fff'
        let score = new PIXI.Text('0', s)
        score.x = 215
        this.lScore = score
        bg1.addChild(score)

        let score2 = new PIXI.Text('0', s)
        score2.x = score.x
        this.rScore = score2
        bg2.addChild(score2)

        s.fill = '#fff'
        s.fontWeight = 'bold'
        s['fontSize'] = '50px'
        let idxText = new PIXI.Text(idx, s)
        idxText.x = -60
        idxText.y = 0
        this.addChild(idxText)
    }

    setRec(recData) {
        // console.log('recData', recData);
        this.lPlayerName.text = recData.player[0]
        cutText(this.lPlayerName, 180)
        this.rPlayerName.text = recData.player[1]
        cutText(this.rPlayerName, 180)
        if (recData.score[0] == 0 && recData.score[1] == 0) {
            this.lScore.text = ''
            this.rScore.text = ''
        }
        else {
            this.lScore.text = recData.score[0]
            this.rScore.text = recData.score[1]
        }
    }
}