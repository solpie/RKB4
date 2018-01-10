import { BaseAvatar } from '../base/BaseAvatar';
import { newBitmap, setScale } from '../../utils/PixiEx';
import { FontName } from '../const';

export class MateAvatar extends PIXI.Container {
    avt: BaseAvatar
    playerName: PIXI.Text
    bloodNum: PIXI.Text
    isLeft: Boolean
    constructor(isLeft) {
        super()
        this.isLeft = isLeft

        let bgUrl = isLeft ? 'L' : 'R';
        this.avt = new BaseAvatar(`/img/panel/final2/score/mateMask${bgUrl}.png`, 76)
        // this.avt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
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

        let pn = new PIXI.Text('p', ps)
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
    grayFilter: any
    setData(data) {
        this.playerName.text = data.name
        if (this.isLeft)
            this.playerName.x = this.playerName.width
        this.avt.load(data.avatar)
        this.bloodNum.text = data.blood

        if (data.blood < 1) {
            if (!this.grayFilter) {
                this.grayFilter = new PIXI.filters.ColorMatrixFilter();
                this.grayFilter.blackAndWhite(true)
            }
            this.filters = [this.grayFilter];
        }
        else
            this.filters = []
    }
}