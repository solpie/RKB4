import { imgLoader } from '../../utils/ImgLoader';
import { newBitmap, BitmapText, setScale } from '../../utils/PixiEx';
import { FontName } from '../const';
import { getUrlQuerys } from '../../utils/WebJsFunc';
const loadAvt = (avtSp, url) => {
    imgLoader.loadTex(url, tex => {
        let s = 124 / tex.width
        avtSp.texture = tex
        avtSp.x = avtSp.mask.x
        setScale(avtSp, s)
        avtSp.y = avtSp.mask.y - (avtSp.height - avtSp.mask.height) * .5
    })
}
export class GroupItem extends PIXI.Container {
    lScore: any
    rScore: any
    lAvt: any
    rAvt: any
    lHwa: any
    rHwa: any
    lName: any
    rName: any
    lTitle: PIXI.Text
    rTitle: PIXI.Text
    constructor() {
        super()
        imgLoader.loadTex('/img/panel/score2018/score.png', tex => {
            let sheet = {
                text: '0',
                animations: {
                    "7": 0, "8": 1, "9": 2, "0": 3, "1": 4,
                    "2": 5, "3": 6, "4": 7, "5": 8, "6": 9
                },
                texture: tex,
                frames: [
                    [0, 0, 54, 80],
                    [55, 0, 54, 80],
                    [0, 81, 54, 80],
                    [55, 81, 54, 80],
                    [110, 0, 54, 80],
                    [110, 81, 54, 80],
                    [165, 0, 54, 80],
                    [165, 81, 54, 80],
                    [0, 162, 54, 80],
                    [55, 162, 54, 80]]
            }

            let bg = newBitmap({ url: '/img/panel/score2018/5group/itemBg.png' })
            this.addChild(bg)

            let lScoreNum = new BitmapText(sheet)
            bg.addChild(lScoreNum)
            setScale(lScoreNum, 0.9)
            lScoreNum.x = 840
            this.lScore = lScoreNum
            lScoreNum.text = '0'

            let rScoreNum = new BitmapText(sheet)
            bg.addChild(rScoreNum)
            setScale(rScoreNum, 0.9)
            rScoreNum.x = 1035
            lScoreNum.y = rScoreNum.y = 170
            this.rScore = rScoreNum
            rScoreNum.text = '0'


            let lAvt = new PIXI.Sprite()
            bg.addChild(lAvt)

            let rAvt = new PIXI.Sprite()
            bg.addChild(rAvt)

            let lAvtMask = newBitmap({ url: '/img/panel/score2018/5group/avtMaskL.png' })
            bg.addChild(lAvtMask)
            let rAvtMask = newBitmap({ url: '/img/panel/score2018/5group/avtMaskR.png' })
            bg.addChild(rAvtMask)

            lAvtMask.x = 693
            rAvtMask.x = 1103
            rAvtMask.y = lAvtMask.y = 160

            lAvt.mask = lAvtMask
            rAvt.mask = rAvtMask

            this.lAvt = lAvt
            this.rAvt = rAvt
            // this.setPlayer({})


            let ns = {
                fontFamily: FontName.MicrosoftYahei,
                fontSize: '35px', fill: "#000520",
                fontWeight: 'bold'
            }

            let lName = new PIXI.Text('', ns)
            this.lName = lName
            this.lName.y = 164
            lName.x = 600 + 113 - lName.width
            bg.addChild(lName)


            let rName = new PIXI.Text('', ns)
            this.rName = rName
            rName.x = 1226
            this.rName.y = this.lName.y
            bg.addChild(rName)

            let is = {
                fontFamily: FontName.Impact,
                fontSize: '28px', fill: "#000520"
            }
            let lHwa = new PIXI.Text('', is)
            this.lHwa = lHwa
            bg.addChild(lHwa)

            let rHwa = new PIXI.Text('', is)
            bg.addChild(rHwa)
            this.rHwa = rHwa
            this.rHwa.x = this.rName.x
            lHwa.y = rHwa.y = 215

            let ts = {
                fontFamily: FontName.MicrosoftYahei,
                fontSize: '24px', fill: "#eee"
            }
            let lTitle = new PIXI.Text('', ts)
            this.lTitle = lTitle
            bg.addChild(lTitle)

            let rTitle = new PIXI.Text('', ts)
            this.rTitle = rTitle
            bg.addChild(rTitle)
            lTitle.y = rTitle.y = 125
            rTitle.x = 1040
        })

    }
    setData(data, playerMap) {
        let lPlayer = playerMap[data.player[0]]
        let rPlayer = playerMap[data.player[1]]
        this.lScore.text = data.score[0] + ''
        this.rScore.text = data.score[1] + ''
        // let url = 'http://i4.hoopchina.com.cn/user/d5/9c/1e/d59c1e6c260173108808eb4ae4431dd3001.jpg@194h_194w_2e'
        loadAvt(this.lAvt, lPlayer.avatar)
        loadAvt(this.rAvt, rPlayer.avatar)
        console.log('lPlayer', lPlayer);
        // loadAvt(this.rAvt, url)
        // loadAvt(this.lAvt, url)
        this.lName.text = lPlayer.name
        this.lName.x = 692 - this.lName.width

        this.lTitle.text = lPlayer.title
        this.lTitle.x = 880 - this.lTitle.width

        this.rTitle.text = rPlayer.title

        this.rName.text = rPlayer.name
        this.lHwa.text = lPlayer.hwa[0] + 'cm | ' + lPlayer.hwa[1] + 'kg'
        this.lHwa.x = 692 - this.lHwa.width
        this.rHwa.text = rPlayer.hwa[0] + 'cm | ' + rPlayer.hwa[1] + 'kg'
    }
}
export class Group5 extends PIXI.Container {
    p: any;
    itemArr = []
    constructor(parent, data) {
        super()
        this.p = parent
        let imgArr = []
        imgArr.push('/img/panel/score2018/5group/itemBg.png')
        imgArr.push('/img/panel/score2018/5group/avtMaskL.png')
        imgArr.push('/img/panel/score2018/5group/avtMaskR.png')
        imgArr.push('/img/panel/score2018/score.png')
        this.itemArr = []
        imgLoader.loadTexArr(imgArr, _ => {
            for (let i = 0; i < 5; i++) {
                let item = new GroupItem()
                item.y = i * 170
                this.addChild(item)
                this.itemArr.push(item)
            }
            this.show(data)
        })
    }

    show(data) {
        if (this.itemArr.length) {
            let start = 0
            let isPage2 = getUrlQuerys('page2') == '1'
            console.log('is page2', isPage2);
            if (isPage2)
                start = 5
            for (let i = 0; i < 5; i++) {
                let item: GroupItem = this.itemArr[i]
                if (data.groupScore[start + i]) {
                    item.setData(data.groupScore[start + i], data.playerMap)
                    item.visible = true
                }
                else
                    item.visible = false

            }
        }
        this.p.addChild(this)
    }

    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }
}