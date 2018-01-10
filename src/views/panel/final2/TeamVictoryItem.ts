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
    txtShuChu: PIXI.Text
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
        ts.fill = '#dadada'
        let d2 = new PIXI.Text('8 (73%)', ts)
        this.addChild(d2)
        this.txtDamage = d2
        d2.y = 5
        a.y = d.y = k.y

        ts.fontSize = '25px'
        let shuchu = new PIXI.Text('damage', ts)
        this.addChild(shuchu)
        shuchu.y = d2.y + 3
        if (isLeft) {
            k.x = -270
            d.x = -160
            a.x = -50
            ctn.scale.x = -1
            d2.x = -200
            // this.barMask.x = 50
            shuchu.x = -410
        }
        else {
            k.x = 20
            d.x = 130
            d2.x = 100

            a.x = 240
            // this.barMask.x = 20
            shuchu.x = 310

        }
        return this
    }
    setData(data) {
        if (!data) {
            this.txtDamage.text =''
                this.txtK.text =
                this.txtD.text =
                this.txtA.text = '-'
            this.barMask.x = 280
        }
        else {
            this.txtK.text = data.k
            this.txtD.text = data.d
            this.txtA.text = data.a
            this.barMask.x = 280 * (1 - data.dmgPerc / 100)
            this.txtDamage.text = data.score + ' (' + data.dmgPerc + '%)'
        }
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
        this.rBar.y = this.lBar.y = lCtn.y + 63
        this.addChild(this.lBar)
        this.addChild(this.rBar)
        // this.test()


        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px',
            fill: '#eee',
            fontWeight: 'bold'
        }
        let lpn = new PIXI.Text('李观洋', ts)
        lpn.x = lCtn.x + 109 + 10
        this.lPlayerName = lpn
        this.addChild(lpn)

        let rpn = new PIXI.Text('李观洋', ts)
        this.rPlayerName = rpn
        this.rPlayerName.x = rCtn.x - this.rPlayerName.width - 30
        rpn.y = lpn.y = lCtn.y + 15
        this.addChild(rpn)

    }

    setData(lPlayerData, rPlayerData) {
        this.lAvt.load(lPlayerData.avatar)
        this.rAvt.load(rPlayerData.avatar)
        this.lPlayerName.text = lPlayerData.name
        this.lPlayerName.x = 448-this.lPlayerName.width
        this.rPlayerName.text = rPlayerData.name
        this.lBar.setData(lPlayerData.kda)
        this.rBar.setData(rPlayerData.kda)
        // this.lBar.txtK.text = lPlayerData.kda.k
        // this.lBar.txtK = lPlayerData.kda.k
    }

    test() {
        this.lBar.setData({ dmg: 8, dmgPerc: 73 })
        this.rBar.setData({ dmg: 6, dmgPerc: 56 })
        this.lAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
        this.rAvt.load('http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg')
    }
}