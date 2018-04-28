import { imgLoader } from '../../utils/ImgLoader';
import { newBitmap } from '../../utils/PixiEx';
import { FontName } from '../const';
import { ascendingProp, descendingProp } from '../../utils/JsFunc';
import { BaseAvatar } from '../base/BaseAvatar';
import { getVoteData } from '../../utils/HupuAPI';
import { TweenEx } from '../../utils/TweenEx';
import { blink2 } from '../../utils/Fx';
let assets = [
    '/img/panel/score2018/vote/bg.png',
    '/img/panel/score2018/vote/itemBg.png',
]

//for rename
let playerArr = [
    { 'id': 27342, "playerId": "p6", "name": "Aaron", "hwa": [175, 65, 26] },
    { 'id': 1754, "playerId": "p7", "name": "孟亚东", "hwa": [191, 88, 21] },
    { 'id': 44, "playerId": "p5", "name": "方良超", "hwa": [174, 75, 26] },
    { 'id': 30994, "playerId": "p3", "name": "伍志勋", "hwa": [192, 78, 26] },
    { 'id': 574, "playerId": "p9", "name": "黄宇军", "hwa": [172, 68, 24] },
    { 'id': 27935, "playerId": "p4", "name": "杨澍", "hwa": [184, 70, 26] },
    { 'id': 30995, "playerId": "p8", "name": "顾希欣", "hwa": [180, 70, 31] },
    { 'id': 30993, "playerId": "p2", "name": "矫凯文", "hwa": [188, 90, 25] },
    { 'id': 30996, "playerId": "p10", "name": "王嵘", "hwa": [183, 74, 25] },
    { 'id': 160, "playerId": "p1", "name": "申屠逸斐", "hwa": [188, 83, 22] },
    { 'id': 0, "playerId": "p11", "name": "乔伊-海伍德", "hwa": [185, 77, 33] }
]
let barWidth = 320//+5
let maxVote = 21000
let isDebug = false
class ItemSmall extends PIXI.Container {
    bar: PIXI.Graphics
    playerName: PIXI.Text
    voteCount: PIXI.Text
    avt: BaseAvatar
    constructor() {
        super()
        let bg = new PIXI.Graphics()
        this.addChild(bg)
        bg.beginFill(0x111331)
            .drawRect(-90, 0, 325 + 90, 40)

        let bar = new PIXI.Graphics()
        this.addChild(bar)
        this.bar = bar
        bar.y = 37
        bar.beginFill(0xf89b2e)
            .drawRect(0, 0, 325, 3)


        let ns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '25px', fill: "#fff",
            // fontWeight: 'bold'
        }

        let name = new PIXI.Text('', ns)
        this.addChild(name)
        // name.x = 525
        name.y = 3
        this.playerName = name

        let voteCount = new PIXI.Text('', ns)
        this.addChild(voteCount)
        voteCount.y = name.y
        voteCount.x = 200
        this.voteCount = voteCount

        let mask = new PIXI.Graphics()
        mask.x = -85
        mask.y = 2
        mask.beginFill(0xff0000)
            .drawRect(0, 0, 55, 36)
        this.addChild(mask)
        let avt = new BaseAvatar(null, 55, mask)
        this.addChild(avt)
        this.avt = avt
    }

    setInfo(playerName, count, avt?) {
        this.playerName.text = playerName + ''

        fixCount(count, this.voteCount)
        this.voteCount.x = 318 - this.voteCount.width
        let w = count / maxVote * barWidth + 5
        this.bar
            .clear()
            .beginFill(0xf89b2e)
            .drawRect(0, 0, w, 3)


        if (avt) {
            this.avt.load(avt)
        }
    }
}
function fixCount(count, text) {
    if (count > 9999) {
        count = (count / 10000).toFixed(2)
        text.text = count + '万票'
    }
    else {
        text.text = count + '票'
    }
}
class Item extends PIXI.Container {
    playerName: PIXI.Text
    voteCount: PIXI.Text
    bar: PIXI.Graphics
    avt: BaseAvatar
    constructor() {
        super()
        let bar = new PIXI.Graphics()
        this.addChild(bar)
        this.bar = bar
        bar.x = 512
        bar.y = 336
        bar.beginFill(0xf89b2e)
            .drawRect(0, 0, 325, 6)

        let bg = newBitmap({ url: '/img/panel/score2018/vote/itemBg.png' })
        this.addChild(bg)

        let ns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px', fill: "#fff",
            fontWeight: 'bold'
        }

        let name = new PIXI.Text('', ns)
        this.addChild(name)
        name.x = 525
        name.y = 285
        this.playerName = name

        let voteCount = new PIXI.Text('', ns)
        this.addChild(voteCount)
        voteCount.y = name.y
        voteCount.x = 700
        this.voteCount = voteCount


        let mask = new PIXI.Graphics()
        mask.x = 400
        mask.y = 279
        mask.beginFill(0xff0000)
            .drawRect(0, 0, 78, 62)
            .moveTo(78, 0)
            .lineTo(78, 62)

            .lineTo(100, 62)
            .lineTo(106, 50)
            .lineTo(78, 0)
        // mask.alpha = 0.3

        let avt = new BaseAvatar(null, 106, mask)
        this.addChild(avt)
        this.avt = avt

        this.addChild(mask)
    }
    setInfo(playerName, count, avt?) {
        this.playerName.text = playerName + ''
        fixCount(count, this.voteCount)
        this.voteCount.x = 825 - this.voteCount.width
        let w = count / maxVote * barWidth + 5
        this.bar
            .clear()
            .beginFill(0xf89b2e)
            .drawRect(0, 0, w, 6)

        if (avt) {
            this.avt.load(avt)
        }
    }
}

export class Vote extends PIXI.Container {
    p: any
    itemArr: any
    playerMap: any
    lName: any
    rName: any
    lHeight: any
    lWeight: any
    lAge: any
    rHeight: any
    rWeight: any
    rAge: any

    topAvt:BaseAvatar
    constructor(parent) {
        super()
        this.p = parent
        this.itemArr = []
        this.playerMap = {}
        for (let i = 0; i < playerArr.length; i++) {
            let p = playerArr[i];
            this.playerMap[p.id] = p
        }
        imgLoader.loadTexArr(assets, _ => {
            let bg = newBitmap({ url: '/img/panel/score2018/vote/bg.png' })
            this.addChild(bg)
            for (let i = 0; i < 3; i++) {
                let item1 = new Item()
                this.addChild(item1)
                item1.y = i * 73
                this.itemArr.push(item1)
            }
            for (let i = 0; i < 7; i++) {
                let item2 = new ItemSmall()
                this.addChild(item2)
                item2.x = 512
                item2.y = 500 + i * 53
                this.itemArr.push(item2)
            }

            let ns = {
                fontFamily: FontName.MicrosoftYahei,
                fontSize: '30px', fill: "#fff",
                fontWeight: 'bold'
            }

            let lHeight = new PIXI.Text('??', ns)
            this.addChild(lHeight)
            lHeight.x = 1140
            lHeight.y = 336
            this.lHeight = lHeight

            let rHeight = new PIXI.Text('185', ns)
            this.addChild(rHeight)
            rHeight.x = 1290
            rHeight.y = lHeight.y
            this.rHeight = rHeight

            let lWeight = new PIXI.Text('??', ns)
            this.addChild(lWeight)
            lWeight.x = 1160
            lWeight.y = 407
            this.lWeight = lWeight

            let rWeight = new PIXI.Text('77', ns)
            this.addChild(rWeight)
            rWeight.x = 1290
            rWeight.y = lWeight.y
            this.rWeight = rWeight


            let lAge = new PIXI.Text('??', ns)
            this.addChild(lAge)
            lAge.x = 1160
            lAge.y = 476
            this.lAge = lAge

            let rAge = new PIXI.Text('33', ns)
            this.addChild(rAge)
            rAge.x = 1290
            rAge.y = lAge.y
            this.rAge = rAge

            ns.fontSize = '35px'
            let lName = new PIXI.Text('????', ns)
            this.addChild(lName)
            lName.x = 1050 - lName.width * .5
            lName.y = 572
            this.lName = lName

            let rName = new PIXI.Text('Joey Haywood', ns)
            this.addChild(rName)
            rName.x = 1314
            rName.y = lName.y
            this.rName = rName
            blink2({ target: lName, time: 500 })

            let mask= new PIXI.Graphics()
            mask.beginFill(0xff0000)
            .drawRect(0,0,200,200)
            mask.x = 926
            mask.y = 316
            this.addChild(mask)

            this.topAvt = new BaseAvatar(null,200,mask)
            this.addChild(this.topAvt)
            this.show()

        })
    }

    initWS() {
        let remoteWS;
        remoteWS.on('connect', (msg) => {
            console.log('Bo3 connect', window.location.host)
        })
            .on('data', (data) => {
                // calc maxVote
                // sort 1 2 3
            })
    }
    fillData(data) {
        console.log('fill data', data);
        let maxv = 0
        for (let d of data) {
            maxv = Math.max(d.amount, maxv)
        }
        maxVote = maxv
        let sortArr = data.sort(descendingProp('amount'))
        for (let i = 0; i < this.itemArr.length; i++) {
            let p = this.playerMap[data[i].id]
            let item = this.itemArr[i];
            item.setInfo(p.name, data[i].amount, data[i].header)
        }
        //set top player
        let idx = 0
        let p0 = this.playerMap[data[idx].id]
        console.log('top player', p0);
        this.lHeight.text = p0.hwa[0] + ''
        this.lWeight.text = p0.hwa[1] + ''
        this.lAge.text = p0.hwa[2] + ''
        this.lName.text = p0.name
        this.lName.x = 1030 - this.lName.width * .5
        this.topAvt.load(data[idx].header)
    }
    // test() {
    //     let data = []
    //     for (let i = 0; i < this.itemArr.length; i++) {
    //         let p = this.playerMap['p' + (i + 1)]
    //         let item = this.itemArr[i];
    //         data.push({ name: p.name, amount: Math.floor(Math.random() * 21000) })
    //     }
    //     this.fillData(data)
    // }
    getData() {
        getVoteData(data => {
            console.log('get data', data);
            let voteData = JSON.parse(data)
            this.fillData(voteData.data)
        })
    }
    show() {
        this.getData()
        this.p.addChild(this)
        setInterval(_ => {
            this.getData()
        }, 3000)

        if (isDebug) {

            // this.test()
        }
    }
}