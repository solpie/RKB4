import { imgLoader } from '../../utils/ImgLoader';
import { newBitmap } from '../../utils/PixiEx';
import { FontName } from '../const';
let assets = [
    '/img/panel/score2018/vote/bg.png',
    '/img/panel/score2018/vote/itemBg.png',
]

let playerArr = [
    { "playerId": "p6", "name": "阿隆-史密斯", "hwa": [175, 65, 26], "title": "NCAA美式后卫", "rankType": 6, "rank": "", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p7", "name": "孟亚东", "hwa": [191, 88, 21], "title": "路人王新生代魔王", "rankType": 1, "rank": "2", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p5", "name": "方良超", "hwa": [174, 75, 26], "title": "路人王无畏大师", "rankType": 1, "rank": "43", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p3", "name": "伍志勋", "hwa": [192, 78, 26], "title": "国民校草 前CUBA云南财经大学队员", "rankType": 1, "rank": "", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p9", "name": "黄宇军", "hwa": [172, 68, 24], "title": "路人王明星球员", "rankType": 1, "rank": "", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p4", "name": "杨澍", "hwa": [184, 70, 26], "title": "青年演员 中国传媒大学篮球赛MVP", "rankType": 1, "rank": "", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p8", "name": "顾希欣", "hwa": [180, 70, 31], "title": "上海知名野球手", "rankType": 1, "rank": "", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p2", "name": "矫凯文", "hwa": [188, 90, 25], "title": "NBL总冠军成员", "rankType": 1, "rank": "", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p10", "name": "王嵘", "hwa": [183, 74, 25], "title": "CUBA总冠军北大女篮单挑王", "rankType": 1, "rank": "", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p1", "name": "申屠逸斐", "hwa": [188, 83, 22], "title": "前CBA山西队后卫", "rankType": 1, "rank": "20", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" },
    { "playerId": "p11", "name": "乔伊-海伍德", "hwa": [185, 77, 33], "title": "上帝之手", "rankType": 1, "rank": "20", "avatar": "http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e" }
]
let barWidth = 320//+5
let maxVote = 1000
let isDebug = true
class ItemSmall extends PIXI.Container {
    bar: PIXI.Graphics
    playerName: PIXI.Text
    voteCount: PIXI.Text
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

        let name = new PIXI.Text('好天气', ns)
        this.addChild(name)
        // name.x = 525
        name.y = 3
        this.playerName = name

        let voteCount = new PIXI.Text('3000票', ns)
        this.addChild(voteCount)
        voteCount.y = name.y
        voteCount.x = 200
        this.voteCount = voteCount
    }

    setInfo(playerName, count) {
        this.playerName.text = playerName + ''
        this.voteCount.text = count + '票'
        let w = count / maxVote * barWidth + 5
        this.bar
            .clear()
            .beginFill(0xf89b2e)
            .drawRect(0, 0, w, 3)
    }
}
class Item extends PIXI.Container {
    playerName: PIXI.Text
    voteCount: PIXI.Text
    bar: PIXI.Graphics
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

        let name = new PIXI.Text('好天气', ns)
        this.addChild(name)
        name.x = 525
        name.y = 285
        this.playerName = name

        let voteCount = new PIXI.Text('3000票', ns)
        this.addChild(voteCount)
        voteCount.y = name.y
        voteCount.x = 700
        this.voteCount = voteCount

    }
    setInfo(playerName, count) {
        this.playerName.text = playerName + ''
        this.voteCount.text = count + '票'
        let w = count / maxVote * barWidth + 5
        this.bar
            .clear()
            .beginFill(0xf89b2e)
            .drawRect(0, 0, w, 6)
    }
}
export class Vote extends PIXI.Container {
    p: any
    itemArr: any
    playerMap: any
    constructor(parent) {
        super()
        this.p = parent
        this.itemArr = []
        this.playerMap = {}
        for (let i = 0; i < playerArr.length; i++) {
            let p = playerArr[i];
            this.playerMap[p.playerId] = p
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
    test() {
        for (let i = 0; i < this.itemArr.length; i++) {
            let p = this.playerMap['p'+(i + 1)]
            let item = this.itemArr[i];
            item.setInfo(p.name, Math.floor(Math.random() * 1000))
        }
    }
    show() {
        this.p.addChild(this)
        if (isDebug) {
            this.test()
        }
    }
}