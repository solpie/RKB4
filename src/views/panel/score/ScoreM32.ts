import { imgLoader } from '../../utils/ImgLoader';
import { getFtName } from './Com2017';
import { FoulText } from './FoulText';
import { FoulGroup } from './FoulGroup';
import { BitmapText, newBitmap, imgToTex, loadRes, polygon } from "../../utils/PixiEx";
import { SpriteGroup, Direction } from "../../utils/SpriteGroup";
import { TextTimer } from "../../utils/TextTimer";
import { ViewConst, FontName } from "../const";
import { paddy, loadImg } from "../../utils/JsFunc";
import { blink2 } from "../../utils/Fx";
import { FoulTextM2 } from "./FoulTextM2";
import { GameTypeMap } from '../bracketM4/Bracket24Route';
const skin = {
    light: {
        bg: '/img/panel/score/m3/bg2.png',
        fontColor: '#fff',
        score: '/img/panel/score/m2/score.png',
        foul: '/img/panel/score2017/foul.png',
        foulHint: '/img/panel/score2017/foulHintLight.png',
        section1: '/img/panel/score2017/section1Light.png',
        section2: '/img/panel/score2017/section2Light.png',
        section3: '/img/panel/score2017/section3Light.png'
    },
    dark: {
        bg: '/img/panel/score/m3/bg2.png',
        fontColor: '#1b5e80',
        score: '/img/panel/score/m2/score.png',
        foul: '/img/panel/score2017/foul.png',
        foulHint: '/img/panel/score2017/foulHintDark.png',
        section1: '/img/panel/score2017/section1Dark.png',
        section2: '/img/panel/score2017/section2Dark.png',
        section3: '/img/panel/score2017/section3Dark.png'
    }
}
interface Skin {
    bg: string
    section1: string
    section2: string
    section3: string
    score: string
    foul: string
    foulHint: string
    fontColor: string
}
export class ScoreM32 {
    stage: PIXI.Container
    //车轮战
    gameSection1: PIXI.Texture
    gameSection2: PIXI.Texture
    gameSection3: PIXI.Texture
    gameSection: PIXI.Sprite
    skin: Skin
    leftScoreText: BitmapText;
    rightScoreText: BitmapText;
    leftFoul: SpriteGroup
    rightFoul: SpriteGroup
    lFoulText: FoulTextM2
    rFoulText: FoulTextM2
    timer: TextTimer
    winScoreText: PIXI.Text
    gameIdx: PIXI.Text

    lPlayerName: PIXI.Text
    lPlayerHupuID: PIXI.Text
    lPlayerHeight: PIXI.Text
    lPlayerWeight: PIXI.Text

    rPlayerName: PIXI.Text
    rPlayerHupuID: PIXI.Text
    rPlayerHeight: PIXI.Text
    rPlayerWeight: PIXI.Text

    lAvatar: PIXI.Sprite
    rAvatar: PIXI.Sprite

    _lFtId: string
    _rFtId: string

    lFrame: PIXI.Sprite
    rFrame: PIXI.Sprite

    _tex = {}
    _texFt = {}
    lFtImg: PIXI.Sprite
    rFtImg: PIXI.Sprite

    lRankingColor: PIXI.Graphics
    rRankingColor: PIXI.Graphics
    lRankingText: PIXI.Text
    rRankingText: PIXI.Text
    ctn: PIXI.DisplayObject
    constructor(stage: PIXI.Container, isDark = false) {
        this.stage = stage
        if (isDark)
            this.skin = skin.dark
        else
            this.skin = skin.light
        let bg = newBitmap({ url: this.skin.bg })
        stage.addChild(bg)
        this.ctn = bg
        let ctn = new PIXI.Container
        bg.addChild(ctn)
        ctn.y = ViewConst.STAGE_HEIGHT - 300
        bg.scale.x = bg.scale.y = .87
        bg.x = 122
        bg.y = 146
        ////////

        this.gameSection = new PIXI.Sprite
        this.gameSection.x = 926
        this.gameSection.y = 174
        ctn.addChild(this.gameSection)
        loadRes(this.skin.score, (img) => {
            let tex = imgToTex(img)
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
            lScoreNum.x = 808
            lScoreNum.y = 90
            lScoreNum.align = 'center'
            ctn.addChild(lScoreNum as any)

            let rScoreNum = new BitmapText(sheet)
            // rightScoreNum.frameWidth = 56
            this.rightScoreText = rScoreNum
            rScoreNum.x = lScoreNum.x + 232
            rScoreNum.y = lScoreNum.y
            rScoreNum.align = 'center'
            lScoreNum.scale.x = lScoreNum.scale.y = 1.3
            rScoreNum.scale.x = rScoreNum.scale.y = 1.3
            ctn.addChild(rScoreNum as any)
        })

        let lft = new FoulTextM2()
        lft.x = 780
        lft.y = 200
        lft.setFoul(0)
        ctn.addChild(lft)
        this.lFoulText = lft

        let rft = new FoulTextM2()
        rft.x = 1045
        rft.y = lft.y
        rft.setFoul(0)
        ctn.addChild(rft)
        this.rFoulText = rft

        let tts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '30px', fill: "#fff",
            fontWeight: 'bold'
        }

        let t = new TextTimer('', tts)
        ctn.addChild(t)
        t.x = 919
        t.y = 210
        t.textInSec = 0
        this.timer = t

        let winScoreText = new PIXI.Text("", tts)
        winScoreText.x = t.x
        winScoreText.y = t.y
        winScoreText.visible = false
        ctn.addChild(winScoreText)
        this.winScoreText = winScoreText

        let gis = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '24px', fill: "#fff",
            fontWeight: 'bold'
        }
        let gi = new PIXI.Text("", gis)
        this.gameIdx = gi
        gi.x = 908
        gi.y = 68
        ctn.addChild(gi)

        let pns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '30px', fill: this.skin.fontColor,
            // stroke: '#000',
            // strokeThickness: 2,
            fontWeight: 'bold',
        }

        let lpn = new PIXI.Text("", pns)
        lpn.y = 82
        this.lPlayerName = lpn
        ctn.addChild(lpn)


        let pis = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '28px', fill: this.skin.fontColor,
            stroke: '#000',
            strokeThickness: 2,
            fontWeight: 'bold'
        }

        let lHeight = new PIXI.Text("", pis)
        lHeight.y = 142
        this.lPlayerHeight = lHeight
        ctn.addChild(lHeight)

        let lWeight = new PIXI.Text("", pis)
        lWeight.y = lHeight.y
        this.lPlayerWeight = lWeight
        ctn.addChild(lWeight)


        let rpn = new PIXI.Text("", pns)
        rpn.y = lpn.y
        rpn.x = 1318
        this.rPlayerName = rpn
        ctn.addChild(rpn)

        let rHeight = new PIXI.Text("", pis)
        rHeight.x = rpn.x - 10
        rHeight.y = lHeight.y
        this.rPlayerHeight = rHeight
        ctn.addChild(rHeight)

        let rWeight = new PIXI.Text("", pis)
        rWeight.x = rpn.x - 10
        rWeight.y = lHeight.y
        this.rPlayerWeight = rWeight
        ctn.addChild(rWeight)



        let hupuIDstyle = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '25px', fill: "#ddd",
            // stroke: '#000',
            // strokeThickness: 2,
            fontWeight: 'bold',
        }

        let lHupuID = new PIXI.Text("", hupuIDstyle)
        lHupuID.y = 200
        lHupuID.text = ''
        lHupuID.x = 595 - lHupuID.width
        this.lPlayerHupuID = lHupuID
        ctn.addChild(lHupuID)

        let rHupuID = new PIXI.Text("", hupuIDstyle)
        rHupuID.y = lHupuID.y
        rHupuID.x = 1320
        this.rPlayerHupuID = rHupuID
        ctn.addChild(rHupuID)

        let lAvatar = new PIXI.Sprite()
        lAvatar.x = 595
        lAvatar.y = 76
        this.lAvatar = lAvatar
        ctn.addChild(this.lAvatar)

        let lm = newBitmap({ url: '/img/panel/score/m2/avtMask.png' })
        lm.x = lAvatar.x + 2
        lm.y = 76
        lAvatar.mask = lm
        ctn.addChild(lm)

        let rAvatar = new PIXI.Sprite()
        rAvatar.x = 1138
        rAvatar.y = lm.y

        this.rAvatar = rAvatar
        ctn.addChild(this.rAvatar)
        let rm = newBitmap({ url: '/img/panel/score/m2/avtMask.png' })
        rm.x = 1138
        rm.y = rAvatar.y
        rAvatar.mask = rm
        ctn.addChild(rm)

        let rRankingColor = new PIXI.Graphics()
        this._drawRankingColor(rRankingColor, 0xdddddd)
        rRankingColor.x = rm.x + 45
        rRankingColor.y = lm.y + 120
        ctn.addChild(rRankingColor)

        let lRankingColor = new PIXI.Graphics()
        this._drawRankingColor(lRankingColor, 0xdddddd)
        lRankingColor.x = lm.x + 45
        lRankingColor.y = lm.y + 120
        this.lRankingColor = lRankingColor
        this.rRankingColor = rRankingColor
        ctn.addChild(lRankingColor)

        let rs = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px', fill: "#fff",
        }
        let lRankingText = new PIXI.Text("", rs)
        // lRankingText.x = lRankingColor.x + 26
        lRankingText.y = lRankingColor.y + 5
        ctn.addChild(lRankingText)
        this.lRankingText = lRankingText

        let rRankingText = new PIXI.Text("", rs)
        // rRankingText.x = rRankingColor.x + 22
        rRankingText.y = lRankingText.y
        ctn.addChild(rRankingText)
        this.rRankingText = rRankingText
    }

    _drawRankingColor(g: PIXI.Graphics, col) {
        g.beginFill(col)
            .moveTo(25, 0)
            .lineTo(75, 0)
            .lineTo(100, 50)
            .lineTo(0, 50)
    }

    set35ScoreLight(winScore) {
        this.winScoreText.text = winScore + '球胜'
    }
    winSectionArr = [7, 8]
    loseSectionArr = [5, 6, 9, 10, 12]
    //1 车轮 2 大师 3 决赛    
    // setGameIdx(gameIdx, matchType, gameInfoData?) { }

    setGameIdx(gameIdx, matchType, gameInfoData?) {
        let gameIdxStr = paddy(gameIdx, 2)
        if (gameInfoData && gameInfoData.gameTitle) {
            this.gameIdx.text = gameInfoData.gameTitle
        }
        else {
            console.log('isMaster', matchType)
            if (gameIdx == 61) {
                this.gameIdx.text = '败者组决赛'
            }
            else if (gameIdx == 60) {
                this.gameIdx.text = '胜者组决赛'
            }
            else if (gameIdx == 62) {
                this.gameIdx.text = '决赛'
            }
            else {
                let gt = GameTypeMap[gameIdx]
                if (gt == 10) {
                    this.gameIdx.text = '分组赛' + gameIdxStr
                }
                else if (gt == 11) {
                    this.gameIdx.text = '胜者组' + gameIdxStr
                }
                else if (gt == 12) {
                    this.gameIdx.text = '败者组' + gameIdxStr
                }
            }
        }
        this.gameIdx.x = 960 - this.gameIdx.width * .5


        // gameIdx = Number(gameIdx)
        // console.log('isMaster', matchType, gameIdx)
        // if (matchType == 2) {
        //     if (this.winSectionArr.indexOf(gameIdx) > -1)
        //         this.gameIdx.text = '胜者组' + paddy(gameIdx, 2) + '场'
        //     else if (this.loseSectionArr.indexOf(gameIdx) > -1)
        //         this.gameIdx.text = '败者组' + paddy(gameIdx, 2) + '场'
        //     else if (gameIdx == 11)
        //         this.gameIdx.text = '胜者组决赛'
        //     else if (gameIdx == 13)
        //         this.gameIdx.text = '败者组决赛'
        //     else if (gameIdx == 14)
        //         this.gameIdx.text = '决赛'
        //     else
        //         this.gameIdx.text = '大师赛' + paddy(gameIdx, 2) + '场'
        // }
        // else if (matchType == 1) {
        //     this.gameIdx.text = '车轮战' + paddy(gameIdx, 2) + '场'
        // }
        // else if (matchType == 3) {
        //     this.gameIdx.text = '决赛'
        // }
        // this.gameIdx.x = 962 - this.gameIdx.width * .5
    }
    _showWinScore() {
        this.winScoreText.visible = true
        this.timer.visible = false
        blink2({
            target: this.winScoreText, time: 100, loop: 20, callback: () => {
                this.winScoreText.visible = false
                this.timer.visible = true
            }
        })
        // TweenEx.delayedCall(3000, () => {
        //     this.winScoreText.visible = false
        //     this.timer.visible = true
        // })
    }

    setLeftScore(v) {
        this.leftScoreText.text = v + ''
        this._showWinScore()
    }

    setScoreFoul(data) {
        if ('leftScore' in data)
            this.setLeftScore(data.leftScore)
        if ('rightScore' in data)
            this.setRightScore(data.rightScore)
        if ('leftFoul' in data)
            this.setLeftFoul(data.leftFoul)
        if ('rightFoul' in data)
            this.setRightFoul(data.rightFoul)
    }

    setRightScore(v) {
        this.rightScoreText.text = v + ''
        this._showWinScore()
    }

    _setFoulText(label: PIXI.Text, v) {
        let s = v + ''
        // if (Number(v) > 3) {
        //     s = '  犯满'
        // }
        label.text = s
    }
    setLeftFoul(v) {
        // v = Number(v)
        // this.leftFoul.setNum(v)
        this.lFoulText.setFoul(v)
    }

    setRightFoul(v) {
        // v = Number(v)
        // this.rightFoul.setNum(v)
        this.rFoulText.setFoul(v)
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

    resetScore() {
        this.setLeftScore(0);
        this.setRightScore(0);
        this.setLeftFoul(0);
        this.setRightFoul(0);
    }

    _fixFtName(label: PIXI.Text, name: string) {
        if (name.toUpperCase() == "GREENLIGHT") {
            name = "GREENLIGHT"
            label.style.fontSize = '13px'
        }
        else {
            label.style.fontSize = '22px'
        }
        label.text = name
        label.y = 280 - label.height * .5
    }

    cutName(n: PIXI.Text, width) {
        if (n.width > width) {
            n.text = n.text.substr(0, n.text.length - 1)
            this.cutName(n, width)
        }
    }
    //player
    setLeftPlayerInfo(name: string, avatar: string, weight, height, _: string, level: Number, rankingData: any, nickName: string) {
        // p.realName, p.avatar, p.weight, p.height, p.groupId, p.level, { text: p.ranking }, p.name
        this._setLeftPlayer({
            nickName: nickName, name: name, avatar: avatar,
            height: height,
            weight: weight,
            rankingData: rankingData
        })
    }
    _setLeftPlayer(data: any) {
        console.log('left player', data);
        this.lPlayerHupuID.text = data.nickName
        this.lPlayerHupuID.x = 595 - this.lPlayerHupuID.width
        this.cutName(this.lPlayerHupuID, this._NAME_WIDTH)

        // this._loadFrame(level, this.lFrame)
        //cm kg
        this.lPlayerName.text = data.name
        this.cutName(this.lPlayerName, this._NAME_WIDTH)
        this.lPlayerName.x = 604 - this.lPlayerName.width

        imgLoader.loadTex(data.avatar, tex => {
            let avt = this.lAvatar
            avt.texture = tex
            let s = 190 / tex.width
            avt.x = avt.mask.x// - avt.texture.width * .5 * s
            avt.y = avt.mask.y// - avt.texture.height * .5 * s
            avt.scale.x = avt.scale.y = s
        })
        this.lPlayerHeight.text = data.height
        this.lPlayerWeight.text = data.weight
        // this._setHeightWeight(height, weight, this.lPlayerHeight)
        this.lPlayerHeight.x = 390 - this.lPlayerHeight.width
        this.lPlayerWeight.x = 535 - this.lPlayerWeight.width

        // this._loadFt(ftId, this.lFtImg)
        console.log('lPlayer ranking data', data.rankingData);
        this._drawRankingColor(this.lRankingColor, data.rankingData.color)
        this.lRankingText.text = data.rankingData.text
        this.lRankingText.x = 693 - this.lRankingText.width * .5
    }
    _loadFrame(level, frame: PIXI.Sprite) {
    }


    _NAME_WIDTH = 250
    setRightPlayerInfo(name: string, avatar: string, weight, height, _: string, level: Number, rankingData: any, nickName: string) {
        // p.realName, p.avatar, p.weight, p.height, p.groupId, p.level, { text: p.ranking }, p.name
        this._setRightPlayerInfo({
            nickName: nickName, name: name, avatar: avatar,
            height: height,
            weight: weight,
            rankingData: rankingData
        })
    }
    _setRightPlayerInfo(data: any) {
        // this._rFtId = ftId
        this.rPlayerHupuID.text = data.nickName
        this.cutName(this.rPlayerHupuID, this._NAME_WIDTH)
        // this._loadFrame(level, this.rFrame)

        this.rPlayerName.text = data.name
        this.cutName(this.rPlayerName, this._NAME_WIDTH)
        // loadRes(avatar, (img) => {
        imgLoader.loadTex(data.avatar, tex => {
            let avt = this.rAvatar
            avt.texture = tex
            let s = 190 / tex.width
            avt.x = avt.mask.x //- avt.texture.width * .5 * s
            avt.y = avt.mask.y //- avt.texture.height * .5 * s
            avt.scale.x = avt.scale.y = s
        });

        this.rPlayerHeight.text = data.height
        this.rPlayerWeight.text = data.weight
        this.rPlayerHeight.x = 1420 - this.rPlayerHeight.width
        this.rPlayerWeight.x = 1558 - this.rPlayerWeight.width
        // this._loadFt(ftId, this.rFtImg)
        // this._fixFtName(this.rFtName, getFtName(ftId))
        // this.rFtName.x = 1293 - this.rFtName.width * .5
        this._drawRankingColor(this.rRankingColor, data.rankingData.color)
        this.rRankingText.text = data.rankingData.text
        this.rRankingText.x = 1235 - this.rRankingText.width * .5
    }
    getPlayerInfo(isLeft) {
        let player: any = {}
        if (isLeft) {
            player.name = this.lPlayerName.text
            player.info = this.lPlayerHeight.text + ' CM ' + this.lPlayerWeight.text + ' KG'
            player.ftId = this._lFtId
        }
        else {
            player.name = this.rPlayerName.text
            player.info = this.rPlayerHeight.text + ' CM ' + this.rPlayerWeight.text + ' KG'
            player.ftId = this._rFtId
        }
        return player
    }

    setExPlayerInfo(data) {

    }

    show() {
        this.ctn.visible = true
    }

    hide() {
        this.ctn.visible = false
    }
}