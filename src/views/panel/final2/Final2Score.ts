import { newBitmap } from '../../utils/PixiEx';
import { BaseAvatar } from '../base/BaseAvatar';
import { BloodBar } from './BloodBar';
import { FontName } from '../const';
import { TextTimer } from '../../utils/TextTimer';
import { MateAvatar } from './MateAvatar';
import { Fianl2Tips } from './Final2Tips';
import { HeightWeightCtn } from './HeightWeightCtn';
export class Final2Score extends PIXI.Container {
    lPlayerAvt: BaseAvatar
    rPlayerAvt: BaseAvatar

    lPlayerName: PIXI.Text
    rPlayerName: PIXI.Text

    lTeamName: PIXI.Text
    rTeamName: PIXI.Text

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

    lTimeOutText: PIXI.Text
    rTimeOutText: PIXI.Text

    lHeightWeightCtn: HeightWeightCtn
    rHeightWeightCtn: HeightWeightCtn

    constructor() {
        super()


        let lHWC = new HeightWeightCtn(true)
        lHWC.x = 228
        lHWC.y = 917
        this.lHeightWeightCtn = lHWC
        this.addChild(lHWC)

        let rHWC = new HeightWeightCtn(false)
        rHWC.y = lHWC.y
        rHWC.x = 1491
        this.rHeightWeightCtn = rHWC
        this.addChild(rHWC)

        this.tips = new Fianl2Tips()
        this.addChild(this.tips)

        let bg = newBitmap({ url: '/img/panel/final2/score/bg.png' })
        this.addChild(bg)

        let lAvt = new BaseAvatar('/img/panel/final2/score/avatarMaskL.png', 110)
        // lAvt.isRemote = false
        this.lPlayerAvt = lAvt
        lAvt.x = 470
        lAvt.y = 917
        this.addChild(lAvt)

        let rAvt = new BaseAvatar('/img/panel/final2/score/avatarMaskR.png', 110)
        // rAvt.isRemote = false
        this.rPlayerAvt = rAvt
        // rAvt.x = 1343
        rAvt.x = 1375
        rAvt.y = lAvt.y
        this.addChild(rAvt)

        let lMateAvtCtn = new PIXI.Container()
        this.addChild(lMateAvtCtn)
        for (let i = 0; i < 4; i++) {
            let maR = new MateAvatar(false)
            this.rMateAvtArr.push(maR)
            maR.x = 1500 + i * 80
            maR.y = 976
            this.addChild(maR)

            let maL = new MateAvatar(true)
            this.lMateAvtArr.push(maL)
            maL.x = 182 + i * 80
            maL.y = maR.y
            lMateAvtCtn.addChildAt(maL, 0)
        }

        let ps = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '28px',
            fill: '#eee',
            fontWeight: 'bold'
        }

        let lpn = new PIXI.Text('P1', ps)
        lpn.x = 478
        lpn.y = 1024
        this.lPlayerName = lpn
        this.addChild(lpn)

        let rpn = new PIXI.Text('P2', ps)
        rpn.x = 1390
        rpn.y = lpn.y
        this.rPlayerName = rpn
        this.addChild(rpn)

        ps.fontSize = '22px'
        ps.fill = '#bbb'
        let lpr = new PIXI.Text('', ps)
        this.lPlayerRank = lpr
        lpr.x = 580
        this.addChild(lpr)

        let rpr = new PIXI.Text('', ps)
        rpr.x = 1240
        rpr.y = lpr.y = 1029
        this.rPlayerRank = rpr
        this.addChild(rpr)

        let ltn = new PIXI.Text('', ps)
        ltn.x = 737 - 381
        ltn.y = 923
        this.lTeamName = ltn
        this.addChild(ltn)

        let rtn = new PIXI.Text('', ps)
        rtn.x = 1120 + 380
        rtn.y = ltn.y
        this.rTeamName = rtn
        this.addChild(rtn)

        //team time up

        let ps2 = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '25px',
            fill: '#bdbdbd',
            fontWeight: 'bold'
        }
        let lt = new PIXI.Text('0', ps2)
        this.lTimeOutText = lt
        lt.x = 275
        lt.y = 920
        this.addChild(lt)

        let rt = new PIXI.Text('0', ps2)
        this.rTimeOutText = rt
        rt.x = 1708
        rt.y = lt.y
        this.addChild(rt)

        let tts = {
            fontFamily: FontName.DigiLED,
            fontSize: '50px',
            fill: "#ccc",
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
            fill: '#838383',
            // fontWeight: 'bold'
        }

        let lBns = new PIXI.Text('0', bs)
        lBns.x = 860
        lBns.y = 1022
        this.lBonus = lBns
        this.addChild(lBns)

        let rBns = new PIXI.Text('0', bs)
        rBns.x = 1040
        rBns.y = lBns.y
        this.rBonus = rBns
        this.addChild(rBns)

        this.test()
    }

    test() {
        // this.tips.setText('南方队请求暂停')
    }

    setInit(data) {
        if (!this.lBar) {
            this.lBar = new BloodBar(true, data.is3Blood)
            this.addChild(this.lBar)
            this.rBar = new BloodBar(false, data.is3Blood)
            this.addChild(this.rBar)
        }
        else {
            this.lBar.initBar(data.is3Blood)
            this.rBar.initBar(data.is3Blood)
        }

        // }
        this.lTeamName.text = data.lTeamInfo.hz + data.lTeamInfo.name
        this.lTeamName.x = 420 - this.lTeamName.width
        this.rTeamName.text = data.rTeamInfo.hz + data.rTeamInfo.name
        let i = 0
        for (let p of data.lTeamInfo.playerArr) {
            if (p.pid != data.lPlayer) {
                let lMa = this.lMateAvtArr[i]
                lMa.setData(p)
                i++
            } else {
                this.lPlayerName.text = p.name
                this.lHeightWeightCtn.setData(p)
                this.lPlayerAvt.load(p.avatar)
                this.lPlayerRank.text = '实力榜:' + (data.lRanking || 'ss')
                // this.lBar.setBlood(p.blood)
            }
        }


        i = 0
        for (let p of data.rTeamInfo.playerArr) {
            if (p.pid != data.rPlayer) {
                let ma = this.rMateAvtArr[i]
                ma.setData(p)
                i++
            } else {
                this.rPlayerName.text = p.name
                this.rHeightWeightCtn.setData(p)
                this.rPlayerAvt.load(p.avatar)
                this.rPlayerRank.text = '实力榜:' + (data.rRanking || 'ss')
                // this.rBar.setBlood(p.blood)
            }
        }

        if (data.is3Blood) {
            this.lPlayerAvt.x = 468
            this.rPlayerAvt.x = 1343
            // this.lPlayerName.x = this.lPlayerAvt.x + 60 - this.lPlayerName.width * .5
            // this.rPlayerName.x = this.rPlayerAvt.x + 50 - this.rPlayerName.width * .5
        }
        else {
            this.lPlayerAvt.x = 468 - 38
            this.rPlayerAvt.x = 1343 + 38
        }

        this.lPlayerName.x = this.lPlayerAvt.x + 60 - this.lPlayerName.width * .5
        this.rPlayerName.x = this.rPlayerAvt.x + 50 - this.rPlayerName.width * .5
    }

    setScoreFoul(data) {
        this.lBar.setBlood(data.leftBlood)
        this.rBar.setBlood(data.rightBlood)
        this.lBonus.text = data.leftFoul
        this.rBonus.text = data.rightFoul
        if (data.leftFoul > 3)
            this.lBonus.style.fill = '#ba2228'
        else
            this.lBonus.style.fill = '#838383'

        if (data.rightFoul > 3)
            this.rBonus.style.fill = '#ba2228'
        else
            this.rBonus.style.fill = '#838383'

        // fill: '#ba2228',
        // 
    }
    setTimeOut(data) {
        this.lTimeOutText.text = data.lTimeOut
        this.rTimeOutText.text = data.rTimeOut
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

    showTips(data) {
        if (data.visible)
            this.tips.setText(data.text)
        else
            this.tips.hide()
    }
}