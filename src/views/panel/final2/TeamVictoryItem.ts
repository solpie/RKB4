import { newBitmap } from '../../utils/PixiEx';
import { BaseAvatar } from '../base/BaseAvatar';
import { ViewConst, FontName } from '../const';
class DamageBar extends PIXI.Container {
    bar
    txtK: PIXI.Text
    txtD: PIXI.Text
    txtA: PIXI.Text
    txtDamage: PIXI.Text
    barMask
    create(isLeft) {
        let ctn = new PIXI.Container()
        this.addChild(ctn)

        ctn.addChild(newBitmap({ url: '/img/panel/final2/victory/barBg.png' }))
        this.bar = newBitmap({ url: '/img/panel/final2/victory/bar.png' })
        this.barMask = newBitmap({ url: '/img/panel/final2/victory/bar.png' })
        this.bar.mask = this.barMask
        ctn.addChild(this.bar)
        ctn.addChild(this.barMask)



        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '40px',
            fill: '#eee',
            fontWeight: 'bold'
        }
        let k = new PIXI.Text('3', ts)
        this.txtK = k
        k.y = -50
        this.addChild(k)


        let d = new PIXI.Text('4', ts)
        this.addChild(d)
        this.txtD = d

        let a = new PIXI.Text('5', ts)
        this.addChild(a)
        this.txtA = a

        ts.fontFamily = FontName.MicrosoftYahei
        ts.fontSize = '30px'
        let d2 = new PIXI.Text('8 (73%)', ts)
        this.addChild(d2)
        this.txtDamage = d2
        d2.y = 5
        a.y = d.y = k.y
        if (isLeft) {
            k.x = -270
            d.x = -160
            a.x = -50
            ctn.scale.x = -1
            d2.x = -200
            // this.barMask.x = 50
        }
        else {
            k.x = 20
            d.x = 130
            d2.x = 100

            a.x = 240
            // this.barMask.x = 20

        }
        return this
    }
    setData(data) {
        this.txtDamage.text = data.dmg + ' (' + data.dmgPerc + '%)'
        this.barMask.x = 255 * data.dmgPerc / 100
    }
}
export class TeamVictoryItem extends PIXI.Container {
    lAvt: BaseAvatar
    rAvt: BaseAvatar
    lBar: DamageBar
    rBar: DamageBar
    lPlayerName: PIXI.Text
    rPlayerName: PIXI.Text
    constructor() {
        super()
        let bg = newBitmap({ url: '/img/panel/final2/victory/itemBg.png' })
        this.addChild(bg)

        let lCtn = new PIXI.Container()
        lCtn.y = 252
        lCtn.x = 200
        this.addChild(lCtn)
        this.lAvt = new BaseAvatar('/img/panel/final2/victory/avtMask.png', 109)
        lCtn.addChild(this.lAvt)

        lCtn.addChild(newBitmap({ url: '/img/panel/final2/victory/itemFrame.png' }))

        let rCtn = new PIXI.Container()
        rCtn.y = lCtn.y
        rCtn.x = ViewConst.STAGE_WIDTH - 109 - lCtn.x
        this.addChild(rCtn)

        this.rAvt = new BaseAvatar('/img/panel/final2/victory/avtMask.png', 109)
        rCtn.addChild(this.rAvt)
        rCtn.addChild(newBitmap({ url: '/img/panel/final2/victory/itemFrame.png' }))
        
        this.lBar = new DamageBar().create(true)
        this.lBar.x = 755
        
        
        this.rBar = new DamageBar().create(false)
        this.rBar.x = 1165
        this.rBar.y = this.lBar.y = lCtn.y + 50
        this.addChild(this.lBar)
        this.addChild(this.rBar)
        this.test()


        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '40px',
            fill: '#eee',
            fontWeight: 'bold'
        }
        let lpn = new PIXI.Text('李观洋', ts)
        lpn.x = lCtn.x + 109 + 10
        this.lPlayerName = lpn
        this.addChild(lpn)

        let rpn = new PIXI.Text('李观洋', ts)
        this.rPlayerName = rpn
        this.rPlayerName.x = rCtn.x - this.rPlayerName.width - 10
        rpn.y = lpn.y = lCtn.y + 5
        this.addChild(rpn)

    }
    test() {
        this.lBar.setData({ dmg: 8, dmgPerc: 73 })
        this.rBar.setData({ dmg: 6, dmgPerc: 56 })
        this.lAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
        this.rAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
    }
}