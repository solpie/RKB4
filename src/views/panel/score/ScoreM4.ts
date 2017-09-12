import { TweenEx } from '../../utils/TweenEx';
import { imgLoader } from '../../utils/ImgLoader';
import { getFtName, simplifyName } from './Com2017';
import { FoulText } from './FoulText';
import { FoulGroup } from './FoulGroup';
import { alignCenter, BitmapText, imgToTex, loadRes, newBitmap, polygon, setScale } from '../../utils/PixiEx';
import { SpriteGroup, Direction } from "../../utils/SpriteGroup";
import { TextTimer } from "../../utils/TextTimer";
import { ViewConst, FontName } from "../const";
import { paddy, loadImg } from "../../utils/JsFunc";
import { blink2 } from "../../utils/Fx";
import { FoulTextM2 } from "./FoulTextM2";
declare let Font;
export class ScoreM4 {
    //车轮战
    gameSection1: PIXI.Texture
    gameSection2: PIXI.Texture
    gameSection3: PIXI.Texture
    gameSection: PIXI.Sprite
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
    lPlayerHeight: PIXI.Text
    lPlayerWeight: PIXI.Text
    rPlayerName: PIXI.Text
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

    // lRankingColor: PIXI.Graphics
    // rRankingColor: PIXI.Graphics
    lRankingText: PIXI.Text
    rRankingText: PIXI.Text
    ctn: PIXI.DisplayObject

    lRewardText: PIXI.Text
    rRewardText: PIXI.Text

    constructor(stage: PIXI.Container, isDark = false) {
        let bg = newBitmap({ url: '/img/panel/score/m4/bg.png' })
        stage.addChild(bg)
        this.ctn = bg
        let ctn = new PIXI.Container
        bg.addChild(ctn)
        ctn.y = ViewConst.STAGE_HEIGHT - 300
        // bg.scale.x = bg.scale.y = .87
        // bg.x = 122
        // bg.y = 146
        ////////
        this.gameSection = new PIXI.Sprite
        this.gameSection.x = 926
        this.gameSection.y = 174
        ctn.addChild(this.gameSection)
        loadRes('/img/panel/score/m2/score.png', (img) => {
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
            lScoreNum.x = 822
            lScoreNum.y = 140
            lScoreNum.align = 'center'
            ctn.addChild(lScoreNum as any)

            let rScoreNum = new BitmapText(sheet)
            // rightScoreNum.frameWidth = 56
            this.rightScoreText = rScoreNum
            rScoreNum.x = lScoreNum.x + 224
            rScoreNum.y = lScoreNum.y
            rScoreNum.align = 'center'
            ctn.addChild(rScoreNum as any)
        })

        let lft = new FoulTextM2()
        lft.x = 850
        lft.y = 225
        ctn.addChild(lft)
        this.lFoulText = lft

        let rft = new FoulTextM2()
        rft.x = 1464 - 335 - 162
        rft.y = lft.y

        ctn.addChild(rft)
        this.rFoulText = rft

        let tts = {
            fontFamily: FontName.DigiLED,
            fontSize: '38px', fill: "#de172f",
            fontWeight: 'normal'
        }
        let t = new TextTimer('', tts)
        ctn.addChild(t)
        t.x = 919
        t.y = 193
        this.timer = t
        //font load delay
        TweenEx.delayedCall(3000, _ => {
            t.textInSec = 0
            rft.setFoul(0)
            lft.setFoul(0)
        })

        let tts2 = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '30px', fill: "#fff",
            fontWeight: 'normal'
        }
        let winScoreText = new PIXI.Text("", tts2)
        winScoreText.x = t.x
        winScoreText.y = t.y
        winScoreText.visible = false
        ctn.addChild(winScoreText)
        this.winScoreText = winScoreText

        let gis = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '24px', fill: "#a0adb6",
            fontWeight: 'bold'
        }
        let gameInfoIdx = new PIXI.Text("", gis)
        this.gameIdx = gameInfoIdx
        gameInfoIdx.x = 908
        gameInfoIdx.y = 105
        ctn.addChild(gameInfoIdx)

        let pns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '34px', fill: '#fff',
            fontWeight: 'bold',
            stroke: '#000',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowAngle: Math.PI / 2,
            dropShadowColor: 0x0d5c92,
            dropShadowDistance: 5,
        }

        let lPlayerName = new PIXI.Text("", pns)
        lPlayerName.y = 136
        this.lPlayerName = lPlayerName
        ctn.addChild(lPlayerName)

        pns.dropShadowColor = 0x4a3138
        let rplayerName = new PIXI.Text("", pns)
        rplayerName.y = lPlayerName.y
        rplayerName.x = 1326
        this.rPlayerName = rplayerName
        ctn.addChild(rplayerName)
        let pis = {
            fontFamily: FontName.Impact,
            fontSize: '28px', fill: '#fff',
            // stroke: '#000',
            // strokeThickness: 2,
            dropShadow: true,
            dropShadowAngle: Math.PI / 2,
            dropShadowColor: 0x2b4555,
            dropShadowDistance: 5,
        }

        let lHeight = new PIXI.Text("", pis)
        lHeight.x = 420
        lHeight.y = 202
        this.lPlayerHeight = lHeight
        ctn.addChild(lHeight)

        let lWeight = new PIXI.Text("", pis)
        lWeight.y = lHeight.y
        this.lPlayerWeight = lWeight
        ctn.addChild(lWeight)


        pis.dropShadowColor = 0x353032
        let rHeight = new PIXI.Text("", pis)
        rHeight.x = 1235
        rHeight.y = lHeight.y
        this.rPlayerHeight = rHeight
        ctn.addChild(rHeight)

        let rWeight = new PIXI.Text("", pis)
        rWeight.x = rplayerName.x - 10
        rWeight.y = lHeight.y
        this.rPlayerWeight = rWeight
        ctn.addChild(rWeight)


        let lm = newBitmap({ url: '/img/panel/score/m4/avtMask.png' })
        ctn.addChild(lm)
        let lAvatar = new PIXI.Sprite()
        this.lAvatar = lAvatar
        ctn.addChild(this.lAvatar)

        let rm = newBitmap({ url: '/img/panel/score/m4/avtMaskR.png' })
        ctn.addChild(rm)
        let rAvatar = new PIXI.Sprite()
        this.rAvatar = rAvatar
        ctn.addChild(this.rAvatar)
        lAvatar.mask = lm
        rAvatar.mask = rm

        lm.x = 652
        lm.y = 122

        lAvatar.x = lm.x - 2
        lAvatar.y = 76

        rAvatar.x = 1100
        rAvatar.y = lm.y

        rm.x = 1118
        rm.y = rAvatar.y

        let rs = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '35px', fill: "#fff",
        }
        let lRankingText = new PIXI.Text("", rs)
        // lRankingText.x = lRankingColor.x + 26
        lRankingText.y = 956
        ctn.addChild(lRankingText)
        this.lRankingText = lRankingText

        let rRankingText = new PIXI.Text("", rs)
        // rRankingText.x = rRankingColor.x + 22
        rRankingText.y = lRankingText.y
        ctn.addChild(rRankingText)
        this.rRankingText = rRankingText

        let rewardStyle = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '28px', fill: "#fff",
        }
        let lRewardTex = newBitmap({ url: '/img/panel/score/m4/rewardTex.png' })
        ctn.addChild(lRewardTex)

        let rRewardTex = newBitmap({ url: '/img/panel/score/m4/rewardTex.png' })
        ctn.addChild(rRewardTex)

        let lRewardText = new PIXI.Text('￥20,000', rewardStyle)
        lRewardText.x = 695
        lRewardText.y = 238
        this.lRewardText = lRewardText

    
        ctn.addChild(lRewardText)

        let rRewardText = new PIXI.Text('￥20,000', rewardStyle)
        this.rRewardText = rRewardText
        rRewardText.x = 1227 - rRewardText.width
        rRewardText.y = lRewardText.y
        ctn.addChild(rRewardText)


        lRewardTex.x = lRewardText.x
        lRewardTex.y = lRewardText.y + 5
        lRewardTex.mask = lRewardText

        rRewardTex.x = rRewardText.x
        rRewardTex.y = rRewardText.y + 5
        rRewardTex.mask = rRewardText
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

    //1 车轮 2 大师 3 决赛    
    setGameIdx(gameIdx, matchType) {
        console.log('isMaster', matchType)
        if (matchType == 2) {
            this.gameIdx.text = '决赛' + paddy(gameIdx, 2) + '场'
        }
        else if (matchType == 1) {
            this.gameIdx.text = '车轮战' + paddy(gameIdx, 2) + '场'
        }
        else if (matchType == 3) {
            this.gameIdx.text = '总决赛'
        }
        this.gameIdx.x = 962 - this.gameIdx.width * .5
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
    setLeftPlayerInfo(name: string, avatar: string, weight, height, ftId: string, level: Number, rankingData: any) {
        this._lFtId = ftId
        this._loadFrame(level, this.lFrame)
        //cm kg
        this.lPlayerName.text = simplifyName(name)
        this.cutName(this.lPlayerName, this._NAME_WIDTH)
        this.lPlayerName.x = 595 - this.lPlayerName.width
        // loadRes(avatar, (img) => {
        //     let avt = this.lAvatar
        //     avt.texture = imgToTex(img)
        //     let s = 190 / img.width
        //     avt.x = avt.mask.x// - avt.texture.width * .5 * s
        //     avt.y = avt.mask.y// - avt.texture.height * .5 * s
        //     avt.scale.x = avt.scale.y = s
        // }, true);

        imgLoader.loadTex(avatar, tex => {
            let avt = this.lAvatar
            avt.texture = tex
            let s = 153 / tex.width
            avt.x = avt.mask.x// - avt.texture.width * .5 * s
            avt.y = avt.mask.y - (avt.height - avt.mask.height) * .5
            avt.scale.x = avt.scale.y = s
        })
        this.lPlayerHeight.text = height + ' cm   |    ' + weight + ' kg'
        // this.lPlayerWeight.text = weight + ' kg'
        alignCenter(this.lPlayerHeight, 515)
        // this.lPlayerWeight.x = 535 - this.lPlayerWeight.width

        // this._loadFt(ftId, this.lFtImg)
        if (rankingData) {
            console.log('lPlayer ranking data', rankingData);
            // this._drawRankingColor(this.lRankingColor, rankingData.color)
            this.lRankingText.text = rankingData.text
            this.lRankingText.x = 693 - this.lRankingText.width * .5
        }
    }

    _loadFrame(level, frame: PIXI.Sprite) {
    }


    _NAME_WIDTH = 280
    setRightPlayerInfo(name: string, avatar: string, weight, height, ftId: string, level: Number, rankingData: any) {
        this._rFtId = ftId
        this._loadFrame(level, this.rFrame)
        this.rPlayerName.text = simplifyName(name)
        this.cutName(this.rPlayerName, this._NAME_WIDTH)
        // loadRes(avatar, (img) => {
        imgLoader.loadTex(avatar, tex => {
            let avt = this.rAvatar
            avt.texture = tex
            let s = 153 / tex.width
            avt.x = avt.mask.x //- avt.texture.width * .5 * s
            avt.scale.x = avt.scale.y = s
            avt.y = avt.mask.y - (avt.height - avt.mask.height) * .5
            console.log('texture height', avt.texture.height, avt.height);
            // avt.y = avt.mask.y - (avt.texture.height - avt.mask.height) * .5

            // avt.alpha = 0.3
            // avt.mask = null
        });

        this.rPlayerHeight.text = height + ' cm   |    ' + weight + ' kg'
        alignCenter(this.rPlayerHeight, 1400)

        // this.rPlayerWeight.text = weight
        // this.rPlayerHeight.x = 1420 - this.rPlayerHeight.width
        // this.rPlayerWeight.x = 1558 - this.rPlayerWeight.width
        if (rankingData) {
            // this._drawRankingColor(this.rRankingColor, rankingData.color)
            this.rRankingText.text = rankingData.text
            this.rRankingText.x = 1235 - this.rRankingText.width * .5
        }
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

    show() {
        this.ctn.visible = true
    }

    hide() {
        this.ctn.visible = false
    }
}