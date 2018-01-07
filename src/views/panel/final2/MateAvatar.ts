import { BaseAvatar } from '../base/BaseAvatar';
import { newBitmap, setScale } from '../../utils/PixiEx';
import { FontName } from '../const';

export class MateAvatar extends PIXI.Container {
    avt: BaseAvatar
    playerName: PIXI.Text
    bloodNum: PIXI.Text
    constructor(isLeft) {
        super()
        let bgUrl = isLeft ? 'L' : 'R';
        this.avt = new BaseAvatar(`/img/panel/final2/score/mateMask${bgUrl}.png`, 76)
        this.avt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
        this.addChild(this.avt)

        let bg = newBitmap({ url: `/img/panel/final2/score/mateBgR.png` })
        bg.x = -8
        bg.y = -10

        this.addChild(bg)

        let tts = {
            fontFamily: FontName.Impact,
            fontSize: '28px',
            // fill: "#de172f",
            fontWeight: 'bold'
        }
        let ps = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '24px',
            fontWeight: 'bold'
        }
        setScale(this, 0.85)

        let pn = new PIXI.Text('利君沙', ps)
        this.playerName = pn
        pn.x = 3
        pn.y = 61
        this.addChild(pn)

        let bn = new PIXI.Text('2', tts)
        bn.x = 7
        bn.y = -12
        this.bloodNum = bn
        this.addChild(bn)

        if (isLeft) {
            this.scale.x *= -1
            pn.scale.x *= -1
            bn.scale.x *= -1
            this.avt.scale.x *= -1
            this.avt.x = 76
            pn.x = 73
            bn.x = 20
        }

    }

    setData(data) {
        this.playerName.text = data.name
        this.avt.load(data.avatar)
    }
}