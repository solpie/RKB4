import { newBitmap } from '../../utils/PixiEx';
import { BaseAvatar } from '../base/BaseAvatar';
import { BloodBar } from './BloodBar';
import { FontName } from '../const';
import { TextTimer } from '../../utils/TextTimer';
import { MateAvatar } from './MateAvatar';
import { Fianl2Tips } from './Final2Tips';
export class Final2Score extends PIXI.Container {
    lPlayerAvt: BaseAvatar
    rPlayerAvt: BaseAvatar

    lPlayerName: PIXI.Text
    rPlayerName: PIXI.Text

    lPlayerRank: PIXI.Text
    rPlayerRank: PIXI.Text

    lBonus: PIXI.Text
    rBonus: PIXI.Text

    lBar: BloodBar
    rBar: BloodBar

    timer: TextTimer
    lMateAvtArr: Array<MateAvatar> = []
    rMateAvtArr: Array<MateAvatar> = []

    tips: Fianl2Tips
    constructor() {
        super()
        this.tips = new Fianl2Tips()
        this.addChild(this.tips)

        let bg = newBitmap({ url: '/img/panel/final2/score/bg.png' })
        this.addChild(bg)

        let lAvt = new BaseAvatar('/img/panel/final2/score/avatarMaskL.png', 110)
        this.lPlayerAvt = lAvt
        lAvt.x = 470
        lAvt.y = 918
        this.addChild(lAvt)

        let rAvt = new BaseAvatar('/img/panel/final2/score/avatarMaskR.png', 110)
        this.rPlayerAvt = rAvt
        // rAvt.x = 1343
        rAvt.x = 1375
        rAvt.y = lAvt.y
        this.addChild(rAvt)

        this.lPlayerAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
        this.rPlayerAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')

        this.lBar = new BloodBar(true, true)
        this.addChild(this.lBar)

        this.rBar = new BloodBar(false)
        this.addChild(this.rBar)

        let lMateAvtCtn = new PIXI.Container()
        this.addChild(lMateAvtCtn)
        for (let i = 0; i < 4; i++) {
            let maR = new MateAvatar(false)
            this.rMateAvtArr.push(maR)
            maR.x = 1500 + i * 80
            maR.y = 959
            this.addChild(maR)

            let maL = new MateAvatar(true)
            this.lMateAvtArr.push(maL)
            maL.x = 200 + i * 80
            maL.y = maR.y
            lMateAvtCtn.addChildAt(maL, 0)
        }

        let ps = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '30px',
            fill: '#fff',
            fontWeight: 'bold'
        }

        let lpn = new PIXI.Text('王佳委', ps)
        lpn.x = 478
        lpn.y = 1020
        this.lPlayerName = lpn
        this.addChild(lpn)

        let rpn = new PIXI.Text('王佳委', ps)
        rpn.x = 1390
        rpn.y = lpn.y
        this.rPlayerName = rpn
        this.addChild(rpn)

        ps.fontSize = '22px'
        ps.fill = '#bbb'
        let lpr = new PIXI.Text('实力榜:18', ps)
        lpr.x = 580
        this.addChild(lpr)

        let rpr = new PIXI.Text('实力榜:1', ps)
        rpr.x = 1260
        rpr.y = lpr.y = 1029
        this.addChild(rpr)

        let tts = {
            fontFamily: FontName.DigiLED,
            fontSize: '50px',
            fill: "#fff",
            // fill: "#de172f",
            dropShadow: true,
            dropShadowAngle: 90,
            fontWeight: 'normal'
        }

        let t = new TextTimer('', tts)
        this.addChild(t)
        t.x = 910
        t.y = 965
        this.timer = t
        this.timer.setTimeBySec(0)


        let bs = {
            fontFamily: FontName.DigiLED,
            fontSize: '45px',
            fill: '#ba2228',
            fontWeight: 'bold'
        }
        let lBns = new PIXI.Text('0', bs)
        lBns.x = 860
        lBns.y = 1022
        this.addChild(lBns)

        let rBns = new PIXI.Text('0', bs)
        rBns.x = 1040
        rBns.y = lBns.y
        this.addChild(rBns)

        this.test()
    }

    test()
    {
        this.tips.setText('南方队请求暂停')
    }
    setInit(data) {
    }

    setScoreFoul(data) {
        this.lBar.setBlood(data.leftScore)
        this.rBar.setBlood(data.rightScore)
    }

    resetTimer() {
        this.timer.resetTimer()
    }

    setTimer(v) {
        this.timer.setTimeBySec(v)
    }

    toggleTimer(v) {
        this.timer.toggleTimer(v)
    }

    showTips(str) {

    }
}