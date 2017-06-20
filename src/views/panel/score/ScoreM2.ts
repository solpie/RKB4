import { getFtName } from './Com2017';
import { FoulText } from './FoulText';
import { blink2 } from '../../utils/Fx';
import { TweenEx } from '../../utils/TweenEx';
import { FoulGroup } from './FoulGroup';
import { _avatar } from '../../utils/HupuAPI';
import { proxy } from '../../utils/WebJsFunc';
import { TextTimer } from '../../utils/TextTimer';
import { Direction, SpriteGroup } from '../../utils/SpriteGroup';
import { FontName, TimerState, ViewConst } from '../const';
import { loadImg, paddy } from '../../utils/JsFunc';
import { BitmapText, imgToTex, loadRes, newBitmap } from '../../utils/PixiEx';
const skin = {
    light: {
        bg: '/img/panel/score/m2/bg.png',
        fontColor: '#fff',
        score: '/img/panel/score/m2/score.png',
        foul: '/img/panel/score2017/foul.png',
        foulHint: '/img/panel/score2017/foulHintLight.png',
        section1: '/img/panel/score2017/section1Light.png',
        section2: '/img/panel/score2017/section2Light.png',
        section3: '/img/panel/score2017/section3Light.png'
    },
    dark: {
        bg: '/img/panel/score/m2/bg.png',
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
export class ScoreM2 {
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
    lFoulText: FoulText
    rFoulText: FoulText
    timer: TextTimer
    winScoreText: PIXI.Text
    gameIdx: PIXI.Text

    lPlayerName: PIXI.Text
    lPlayerInfo: PIXI.Text
    rPlayerName: PIXI.Text
    rPlayerInfo: PIXI.Text

    lAvatar: PIXI.Sprite
    rAvatar: PIXI.Sprite

    // lFtName: PIXI.Text
    // rFtName: PIXI.Text
    _lFtId: string
    _rFtId: string

    lFrame: PIXI.Sprite
    rFrame: PIXI.Sprite

    _tex = {}
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

            let leftScoreNum = new BitmapText(sheet)
            // leftScoreNum.frameWidth = 56
            this.leftScoreText = leftScoreNum
            leftScoreNum.x = 825
            leftScoreNum.y = 188
            leftScoreNum.align = 'center'
            ctn.addChild(leftScoreNum as any)

            let rightScoreNum = new BitmapText(sheet)
            // rightScoreNum.frameWidth = 56
            this.rightScoreText = rightScoreNum
            rightScoreNum.x = leftScoreNum.x + 222
            rightScoreNum.y = leftScoreNum.y
            rightScoreNum.align = 'center'
            ctn.addChild(rightScoreNum as any)
        })

        let lf = new FoulGroup({ dir: Direction.e, invert: 29, img: this.skin.foul, count: 4 })
        // ctn.addChild(lf)
        lf.x = 771
        lf.y = 262
        this.leftFoul = lf

        let rf = new FoulGroup({ dir: Direction.w, invert: 29, img: this.skin.foul, count: 4 })
        // ctn.addChild(rf)
        rf.x = 1037
        rf.y = lf.y
        this.rightFoul = rf
        // this.setGameIdx(1,true)

        let fts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '30px', fill: "#fff",
            fontWeight: 'bold'
        }
        let lft = new FoulText(this.skin.foulHint)
        lft.hasHint = false
        lft.x = 490
        lft.y = 255
        lft.setFoul(0)
        ctn.addChild(lft)
        this.lFoulText = lft

        let rft = new FoulText(this.skin.foulHint)
        rft.hasHint = false
        rft.x = 1290
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
        t.y = 248
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
            fontSize: '18px', fill: "#fff",
            fontWeight: 'bold'
        }
        let gi = new PIXI.Text("", gis)
        this.gameIdx = gi
        gi.x = 915
        gi.y = 168
        ctn.addChild(gi)

        let pns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '28px', fill: this.skin.fontColor,
            stroke: '#000',
            strokeThickness: 2,
            fontWeight: 'bold',
        }
        let pis = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '22px', fill: this.skin.fontColor,
            stroke: '#000',
            strokeThickness: 2,
            fontWeight: 'bold'
        }
        let lpn = new PIXI.Text("", pns)
        lpn.y = 160
        this.lPlayerName = lpn
        ctn.addChild(lpn)

        let lpInfo = new PIXI.Text("", pis)
        lpInfo.y = 215
        this.lPlayerInfo = lpInfo
        ctn.addChild(lpInfo)

        let rpn = new PIXI.Text("", pns)
        rpn.y = lpn.y
        rpn.x = 1288
        this.rPlayerName = rpn
        ctn.addChild(rpn)

        let rpInfo = new PIXI.Text("", pis)
        rpInfo.x = rpn.x - 10
        rpInfo.y = lpInfo.y
        this.rPlayerInfo = rpInfo
        ctn.addChild(rpInfo)

        let lm = newBitmap({ url: '/img/panel/score/m2/mask.png' })
        lm.x = 650
        lm.y = 163
        ctn.addChild(lm)

        let rm = newBitmap({ url: '/img/panel/score/m2/maskR.png' })
        rm.x = 1122
        rm.y = lm.y
        ctn.addChild(rm)

        let la = new PIXI.Sprite()
        la.x = lm.x
        la.y = lm.y
        la.mask = lm
        this.lAvatar = la
        ctn.addChild(this.lAvatar)

        let ra = new PIXI.Sprite()
        ra.x = rm.x
        ra.y = rm.y
        ra.mask = rm
        this.rAvatar = ra
        ctn.addChild(this.rAvatar)


        let ftns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '22px', fill: '#fff',
            fontWeight: 'bold'
        }

        // let lftn = new PIXI.Text('', ftns)
        // this.lFtName = lftn
        // lftn.y = 267
        // ctn.addChild(lftn)

        // let rftn = new PIXI.Text('', ftns)
        // ctn.addChild(rftn)
        // this.rFtName = rftn
        // rftn.y = lftn.y
        // ctn.addChild(rftn)

        // let lFrame = new PIXI.Sprite()
        // lFrame.scale.x = lFrame.scale.y = 0.97
        // this.lFrame = lFrame
        // lFrame.x = 562
        // lFrame.y = 134
        // ctn.addChild(lFrame)

        // let rFrame = new PIXI.Sprite()
        // rFrame.scale.x = rFrame.scale.y = 0.97
        // this.rFrame = rFrame
        // rFrame.x = 1228
        // rFrame.y = lFrame.y
        // ctn.addChild(rFrame)
    }

    set35ScoreLight(winScore) {
        this.winScoreText.text = winScore + '球胜'
    }

    //1 车轮 2 大师 3 决赛    
    setGameIdx(gameIdx, matchType) {
        console.log('isMaster', matchType)
        if (matchType == 2) {
            // if (!this.gameSection2)
            //     loadImg(this.skin.section2, (img) => {
            //         this.gameSection2 = imgToTex(img)
            //         this.gameSection.texture = this.gameSection2
            //     })
            // else
            //     this.gameSection.texture = this.gameSection2
        }
        else if (matchType == 1) {
            // if (!this.gameSection1)
            //     loadImg(this.skin.section1, (img) => {
            //         this.gameSection1 = imgToTex(img)
            //         this.gameSection.texture = this.gameSection1
            //     })
            // else
            //     this.gameSection.texture = this.gameSection1
            this.gameIdx.text = '小组赛' + paddy(gameIdx, 2) + '场'
        }
        else if (matchType == 3) {
            // if (!this.gameSection3)
            //     loadImg(this.skin.section3, (img) => {
            //         this.gameSection3 = imgToTex(img)
            //         this.gameSection.texture = this.gameSection3
            //     })
            // else
            //     this.gameSection.texture = this.gameSection3
        }
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
        let s = v + ' Foul'
        if (Number(v) > 3) {
            s = '  犯满'
        }
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
    setLeftPlayerInfo(name: string, avatar: string, weight, height, ftId: string, level: Number) {
        this._lFtId = ftId
        this._loadFrame(level, this.lFrame)
        //cm kg
        this.lPlayerName.text = name
        this.cutName(this.lPlayerName, 160)
        this.lPlayerName.x = 634 - this.lPlayerName.width
        loadRes(avatar, (img) => {
            let avt = this.lAvatar
            avt.texture = imgToTex(img)
            let s = 155 / img.width
            avt.x = avt.mask.x// - avt.texture.width * .5 * s
            avt.y = avt.mask.y// - avt.texture.height * .5 * s
            avt.scale.x = avt.scale.y = s
        }, true);
        // loadImg(proxy(avatar), (img) => {
        //     this.lAvatar.texture = imgToTex(img)
        // })
        if (!height)
            height = 0
        if (!weight)
            weight = 0
        this.lPlayerInfo.text = height + 'CM  ' + weight + "KG"
        this.lPlayerInfo.x = 640 - this.lPlayerInfo.width

        // this.lFtName.text = ft
        // this._fixFtName(this.lFtName, getFtName(ftId))
        // this.lFtName.x = 630 - this.lFtName.width * .5
    }
    _loadFrame(level, frame: PIXI.Sprite) {
        // // level = Math.ceil(Number(level) / 5)
        // level = Number(level)
        // if (level > 0) {
        //     let frameUrl = '/img/panel/score2017/frame' + level + '.png'
        //     frame.visible = true
        //     if (!this._tex[frameUrl]) {
        //         loadImg(frameUrl, (img) => {
        //             this._tex[frameUrl] = frame.texture = imgToTex(img)
        //         })
        //     }
        //     else
        //         frame.texture = this._tex[frameUrl]
        // }
        // else
        //     frame.visible = false
    }
    setRightPlayerInfo(name: string, avatar: string, weight, height, ftId: string, level: Number) {
        this._rFtId = ftId
        this._loadFrame(level, this.rFrame)

        this.rPlayerName.text = name
        this.cutName(this.rPlayerName, 160)
        loadRes(avatar, (img) => {
            let avt = this.rAvatar
            avt.texture = imgToTex(img)
            let s = 155 / img.width
            avt.x = avt.mask.x //- avt.texture.width * .5 * s
            avt.y = avt.mask.y //- avt.texture.height * .5 * s
            avt.scale.x = avt.scale.y = s
        }, true);

        if (!height)
            height = 0
        if (!weight)
            weight = 0
        this.rPlayerInfo.text = height + 'CM ' + weight + "KG"

        // this._fixFtName(this.rFtName, getFtName(ftId))
        // this.rFtName.x = 1293 - this.rFtName.width * .5
    }
    getPlayerInfo(isLeft) {
        let player: any = {}
        if (isLeft) {
            player.name = this.lPlayerName.text
            player.info = this.lPlayerInfo.text
            player.ftId = this._lFtId
        }
        else {
            player.name = this.rPlayerName.text
            player.info = this.rPlayerInfo.text
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