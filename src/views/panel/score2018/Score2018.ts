import { newBitmap, BitmapText, loadRes, imgToTex, setScale } from '../../utils/PixiEx';
import { loadImgArr } from '../../utils/JsFunc';
import { imgLoader } from '../../utils/ImgLoader';
import { FontName } from '../const';
import { TextTimer } from '../../utils/TextTimer';
import { fitWidth } from '../bracket/BracketGroup';
import { VsTitle } from './VsTitle';
import { getUrlQuerys } from '../../utils/WebJsFunc';
const skin = {
    bg: '/img/panel/score2018/bg2.png',
    score: '/img/panel/score2018/score.png',
    scoreTex: '/img/panel/score2018/scoreTex.png',
    maskL: '/img/panel/score2018/avtMaskL.png',
    maskR: '/img/panel/score2018/avtMaskR.png',

}
const loadAvt = (avtSp, url) => {
    imgLoader.loadTex(url, tex => {
        let s = 112 / tex.width
        avtSp.texture = tex
        avtSp.x = avtSp.mask.x
        setScale(avtSp, s)
        avtSp.y = avtSp.mask.y - (avtSp.height - avtSp.mask.height) * .5
    })
}
export class Score2018 {
    p: PIXI.Container
    leftScoreText: BitmapText;
    rightScoreText: BitmapText;

    lAvt: PIXI.Sprite
    rAvt: PIXI.Sprite

    lFoul: PIXI.Text
    rFoul: PIXI.Text
    timer: TextTimer

    lIcon: PIXI.Sprite
    rIcon: PIXI.Sprite

    lName: PIXI.Text
    rName: PIXI.Text

    lHeightWeight: PIXI.Text
    rHeightWeight: PIXI.Text

    lRank: PIXI.Text
    rRank: PIXI.Text

    gameTitle: PIXI.Text

    bo3Score: PIXI.Text
    vsTitle: VsTitle
    constructor(stage) {
        this.p = stage
        let baseCtn = new PIXI.Container()
        let ctn = new PIXI.Container()
        ctn.y = 890

        this.p.addChild(baseCtn)

        let bg = newBitmap({ url: skin.bg })
        baseCtn.addChild(bg)
        baseCtn.addChild(ctn)

        let imgArr = []
        imgArr.push({ name: 'score', url: skin.score });
        // imgArr.push({ name: 'scoreTex', url: skin.scoreTex });

        loadImgArr(imgArr, imgCol => {
            // loadRes(skin.score, (img) => {
            let tex = imgToTex(imgCol['score'])
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

            let lScoreNum = new BitmapText(sheet)
            // leftScoreNum.frameWidth = 56
            this.leftScoreText = lScoreNum
            lScoreNum.x = 840
            lScoreNum.y = 27
            lScoreNum.align = 'center'
            ctn.addChild(lScoreNum as any)

            let rScoreNum = new BitmapText(sheet)
            this.rightScoreText = rScoreNum
            rScoreNum.x = lScoreNum.x + 187
            rScoreNum.y = lScoreNum.y
            rScoreNum.align = 'center'

            setScale(lScoreNum, 0.95)
            setScale(rScoreNum, 0.95)
            ctn.addChild(rScoreNum as any)
        })

        let avtMaskL = newBitmap({ url: skin.maskL })
        ctn.addChild(avtMaskL)
        avtMaskL.x = 710
        avtMaskL.y = 26

        let avtMaskR = newBitmap({ url: skin.maskR })
        ctn.addChild(avtMaskR)
        avtMaskR.x = 1099
        avtMaskR.y = avtMaskL.y


        let avtL = new PIXI.Sprite()
        this.lAvt = avtL
        avtL.mask = avtMaskL
        ctn.addChild(avtL)

        let avtR = new PIXI.Sprite()
        this.rAvt = avtR
        avtR.mask = avtMaskR
        ctn.addChild(avtR)


        let lIcon = new PIXI.Sprite()
        lIcon.x = 517
        lIcon.y = 25
        this.lIcon = lIcon
        // ctn.addChild(lIcon)

        let rIcon = new PIXI.Sprite()
        rIcon.x = 1365
        rIcon.y = lIcon.y
        this.rIcon = rIcon
        // ctn.addChild(rIcon)

        setScale(lIcon, 0.40)
        setScale(rIcon, 0.40)


        let fts = {
            fontFamily: FontName.Impact,
            fontSize: '30px', fill: "#c2c1d4",
        }

        let foulL = new PIXI.Text("0", fts)
        foulL.x = 716
        foulL.y = 115
        ctn.addChild(foulL)
        this.lFoul = foulL

        let foulR = new PIXI.Text("0", fts)
        foulR.x = 1190
        foulR.y = foulL.y
        ctn.addChild(foulR)
        this.rFoul = foulR



        let tts = {
            fontFamily: FontName.Impact,
            fontSize: '37px', fill: "#ff7e00",
            fontWeight: 'bold'
        }
        let t = new TextTimer('', tts)
        ctn.addChild(t)
        t.x = 915
        t.y = 103
        t.textInSec = 0
        this.timer = t

        let ns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px', fill: "#000520",
            fontWeight: 'bold'
        }

        let lName = new PIXI.Text('', ns)
        this.lName = lName
        this.lName.y = 28
        lName.x = 600 + 113 - lName.width
        ctn.addChild(lName)


        let rName = new PIXI.Text('', ns)
        this.rName = rName
        rName.x = 1200
        this.rName.y = this.lName.y
        ctn.addChild(rName)


        let is = {
            fontFamily: FontName.Impact,
            fontSize: '25px', fill: "#000520"
        }
        let lHeightWeight = new PIXI.Text('', is)
        this.lHeightWeight = lHeightWeight
        ctn.addChild(lHeightWeight)
        lHeightWeight.x = 713 - lHeightWeight.width
        lHeightWeight.y = 78

        let rHeightWeight = new PIXI.Text('', is)
        this.rHeightWeight = rHeightWeight
        ctn.addChild(rHeightWeight)
        rHeightWeight.x = 1200
        rHeightWeight.y = lHeightWeight.y



        let bo3Score = new PIXI.Text('0 - 0', {
            fontFamily: FontName.Impact,
            // fontWeight: 'bold',
            fontSize: '35px', fill: "#fff"

        })
        bo3Score.y = 22
        bo3Score.x = 960 - bo3Score.width * .5
        this.bo3Score = bo3Score
        ctn.addChild(bo3Score)

        let rs = {
            fontFamily: FontName.Impact,
            fontSize: '30px', fill: "#000520"
        }
        let lRank = new PIXI.Text('', rs)
        this.lRank = lRank
        // ctn.addChild(lRank)
        lRank.y = 32

        let rRank = new PIXI.Text('', rs)
        this.rRank = rRank
        // ctn.addChild(rRank)
        rRank.x = 1410
        rRank.y = lRank.y

        let gs = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '24px', fill: "#fff"
            , fontWeight: 'bold'
        }

        let gameTitle = new PIXI.Text('', gs)
        this.gameTitle = gameTitle
        // ctn.addChild(gameTitle)
        gameTitle.y = 55



        this.vsTitle = new VsTitle()
        this.vsTitle.create(baseCtn)
        this.test()
    }

    test() {
    }

    lPlayer: string
    rPlayer: string
    setInit(data) {
        this.gameTitle.text = data.gameTitle
        this.gameTitle.x = 960 - this.gameTitle.width * .5

        this.setScoreFoul(data)
        let lPlayer = data.leftPlayer
        let rPlayer = data.rightPlayer
        this.lPlayer = lPlayer.playerId
        this.rPlayer = rPlayer.playerId
        let lIconUrl = '/img/icon/' + lPlayer.rankType + '.png'
        let rIconUrl = '/img/icon/' + rPlayer.rankType + '.png'
        imgLoader.loadTex(lIconUrl, tex => {
            this.lIcon.texture = tex
        })
        imgLoader.loadTex(rIconUrl, tex => {
            this.rIcon.texture = tex
        })
        if (rPlayer.playerId == 'p11')
            rPlayer.avatar = '/img/player/bo3/p11.png'
        if (lPlayer.playerId == 'p11')
            lPlayer.avatar = '/img/player/bo3/p11.png'
        loadAvt(this.lAvt, lPlayer.avatar)
        loadAvt(this.rAvt, rPlayer.avatar)

        this.lName.text = lPlayer.name
        fitWidth(this.lName, 258, 35)
        this.lName.x = 718 - this.lName.width
        this.rName.text = rPlayer.name
        fitWidth(this.rName, 258, 35)

        if (lPlayer.hwa[0]) {
            this.lHeightWeight.text = lPlayer.hwa[0] + 'cm | ' + lPlayer.hwa[1] + 'kg'
            this.lHeightWeight.x = 713 - this.lHeightWeight.width
        }
        else {
            this.lHeightWeight.text = ''
        }

        if (rPlayer.hwa[0])
            this.rHeightWeight.text = rPlayer.hwa[0] + 'cm | ' + rPlayer.hwa[1] + 'kg'
        else
            this.rHeightWeight.text = ''
        this.lRank.text = lPlayer.rank
        this.lRank.x = 510 - this.lRank.width
        this.rRank.text = rPlayer.rank

        this.lIcon.visible = lPlayer.rank != ''
        this.rIcon.visible = rPlayer.rank != ''

        this.vsTitle.show({ vs: lPlayer.title + ' ' + rPlayer.title })
    }

    setScoreFoul(data) {
        if ('leftScore' in data) {
            this.leftScoreText.text = data.leftScore + ''
            if (Number(data.leftScore) > 9)
                setScale(this.leftScoreText, 0.85)
            else
                setScale(this.leftScoreText, 1)
            this.leftScoreText.x = 865 - this.leftScoreText.width * .5
        }
        if ('rightScore' in data) {
            this.rightScoreText.text = data.rightScore + ''
            if (Number(data.rightScore) > 9)
                setScale(this.rightScoreText, 0.85)
            else
                setScale(this.rightScoreText, 1)

            this.rightScoreText.x = 865 + 187 - this.rightScoreText.width * .5
        }
        if ('leftFoul' in data)
            this.lFoul.text = data.leftFoul + ''
        if ('rightFoul' in data)
            this.rFoul.text = data.rightFoul + ''
    }

    resetTimer() {
        this.timer.resetTimer()
    }

    setTimer(v) {
        this.timer.setTimeBySec(v)
    }

    setBo3Score(data) {
        console.log('set bo3 score ', this.lPlayer, this.rPlayer);
        for (let gs of data.groupScore) {
            if (gs.player[0] == this.lPlayer && gs.player[1] == this.rPlayer) {
                this.bo3Score.text = gs.score[0] + ' - ' + gs.score[1]
            }
        }
    }

    toggleTimer(v) {
        this.timer.toggleTimer(v)
    }
}