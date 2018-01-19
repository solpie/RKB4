import { TextTimer } from "../../utils/TextTimer";
import { FontName, ViewConst } from "../const";
import { newBitmap, setScale } from '../../utils/PixiEx';
import { imgLoader } from '../../utils/ImgLoader';

export class Game3v3 extends PIXI.Container {
    lTeamLogo: PIXI.Sprite
    rTeamLogo: PIXI.Sprite

    lTeamName: PIXI.Text
    rTeamName: PIXI.Text

    timer: TextTimer
    lScore: PIXI.Text
    rScore: PIXI.Text
    bgMask: PIXI.Graphics
    constructor() {
        super()


        let bg = newBitmap({ url: '/img/panel/final2/3v3/bg.png' })
        this.addChild(bg)

        this.bgMask = new PIXI.Graphics()
        this.bgMask.beginFill(0xffffff)
            .drawRect(0, 0, ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT)
        this.addChild(this.bgMask)
        bg.mask = this.bgMask

        let ctn = new PIXI.Container()
        this.addChild(ctn)
        let s = {
            fontFamily: FontName.Impact,
            fontSize: '45px',
            fill: '#eee',
            fontWeight: 'bold'
        }
        this.timer = new TextTimer('', s)
        // this.timeText.x = 203
        this.timer.isMin = true
        this.timer.x = 200
        this.timer.y = 122
        ctn.addChild(this.timer)
        this.timer.setTimeBySec(15 * 60)
        // this.timeText.y = 128
        ctn.x = 1485
        ctn.y = 810

        s.fontSize = '45px'

        this.lScore = new PIXI.Text('0', s)
        this.lScore.x = 265
        this.lScore.y = 7
        ctn.addChild(this.lScore)

        this.rScore = new PIXI.Text('0', s)
        this.rScore.x = 262
        this.rScore.y = 66
        ctn.addChild(this.rScore)


        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '42px',
            fill: '#eee',
            fontWeight: 'bold'
        }

        this.lTeamName = new PIXI.Text('', ts)
        this.lTeamName.x = 88
        this.lTeamName.y = 8
        ctn.addChild(this.lTeamName)

        this.rTeamName = new PIXI.Text('', ts)
        this.rTeamName.x = 80
        this.rTeamName.y = 65
        ctn.addChild(this.rTeamName)

        this.lTeamLogo = new PIXI.Sprite()
        this.lTeamLogo.x = 25
        this.lTeamLogo.y = 5
        ctn.addChild(this.lTeamLogo)

        this.rTeamLogo = new PIXI.Sprite()
        this.rTeamLogo.x = 20
        this.rTeamLogo.y = 64
        ctn.addChild(this.rTeamLogo)
    }

    setTeamInfo(data?) {
        if (data) {
            if (data.isCustom) {
                this.lTeamName.text = data.leftTeam
                this.rTeamName.text = data.rightTeam
                this.lTeamName.x = 18
                this.rTeamName.x = 10
                this.bgMask.y = -148
                this.timer.visible = false
                this.lTeamName.style.fontSize = '30px'
                this.rTeamName.style.fontSize = '30px'
                this.lTeamName.y =14
                this.rTeamName.y =71
            }
            else {
                this.lTeamName.style.fontSize = '42px'
                this.rTeamName.style.fontSize = '42px'
                this.lTeamName.y =8
                this.rTeamName.y =65
                this.lTeamName.text = data.lTeamInfo.name
                this.rTeamName.text = data.rTeamInfo.name
                this.lTeamName.x = 88
                this.rTeamName.x = 80
                this.bgMask.y = 0
                this.timer.visible = true
                
                imgLoader.loadTex(
                    `/img/panel/final2/victory/team${data.lTeamInfo.id}.png`
                    , tex => {
                        this.lTeamLogo.texture = tex
                        setScale(this.lTeamLogo, 51 / tex.height)
                    })
                imgLoader.loadTex(
                    `/img/panel/final2/victory/team${data.rTeamInfo.id}.png`
                    , tex => {
                        this.rTeamLogo.texture = tex
                        setScale(this.rTeamLogo, 51 / tex.height)

                    })
            }
        }
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
    setScoreFoul(data) {
        this.lScore.text = data.leftScore
        this.rScore.text = data.rightScore
    }
}