import { newBitmap } from '../../utils/PixiEx';
import { BaseAvatar } from '../base/BaseAvatar';
import { BloodBar } from './BloodBar';
export class Final2Score extends PIXI.Container {
    lPlayerAvt: BaseAvatar
    rPlayerAvt: BaseAvatar

    lBar: BloodBar
    rBar: BloodBar
    constructor() {
        super()
        let bg = newBitmap({ url: '/img/panel/final2/score/bg.png' })
        this.addChild(bg)

        let lAvt = new BaseAvatar('/img/panel/final2/score/avatarMaskL.png', 110)
        this.lPlayerAvt = lAvt
        lAvt.x = 470
        lAvt.y = 918
        this.addChild(lAvt)

        let rAvt = new BaseAvatar('/img/panel/final2/score/avatarMaskR.png', 110)
        this.rPlayerAvt = rAvt
        rAvt.x = 1343
        rAvt.y = lAvt.y
        this.addChild(rAvt)

        this.lBar = new BloodBar(true,true)
        this.addChild(this.lBar)
        
        this.rBar = new BloodBar(false)
        this.addChild(this.rBar)
    }

    setInit(data) {
        this.lPlayerAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
        this.rPlayerAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
    }

    setScoreFoul(data) {
        this.lBar.setBlood(data.leftScore)
        this.rBar.setBlood(data.rightScore)
    }

    setTime() {

    }

    showTips(str) {

    }
}