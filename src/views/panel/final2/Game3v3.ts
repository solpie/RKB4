import { TextTimer } from "../../utils/TextTimer";
import { FontName } from "../const";
import { newBitmap, setScale } from '../../utils/PixiEx';
import { imgLoader } from '../../utils/ImgLoader';

export class Game3v3 extends PIXI.Container {
    lTeamLogo: PIXI.Sprite
    rTeamLogo: PIXI.Sprite

    lTeamName: PIXI.Text
    rTeamName: PIXI.Text

    timeText: TextTimer
    lScore: PIXI.Container
    rScore: PIXI.Container
    constructor() {
        super()


        let bg = newBitmap({ url: '/img/panel/final2/3v3/bg.png' })
        this.addChild(bg)

        let ctn = new PIXI.Container()
        this.addChild(ctn)
        let s = {
            fontFamily: FontName.Impact,
            fontSize: '45px',
            fill: '#eee',
            fontWeight: 'bold'
        }
        this.timeText = new TextTimer('', s)
        // this.timeText.x = 203
        this.timeText.x = 200
        this.timeText.y = 122
        ctn.addChild(this.timeText)
        this.timeText.setTimeBySec(15 * 60)
        // this.timeText.y = 128
        ctn.x = 1485
        ctn.y = 810

        s.fontSize = '45px'

        this.lScore = new PIXI.Text('0', s)
        this.lScore.x = 265
        this.lScore.y = 5
        ctn.addChild(this.lScore)

        this.rScore = new PIXI.Text('0', s)
        this.rScore.x = 262
        this.rScore.y = 64
        ctn.addChild(this.rScore)


        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '42px',
            fill: '#eee',
            fontWeight: 'bold'
        }

        this.lTeamName = new PIXI.Text('南方队', ts)
        this.lTeamName.x = 88
        this.lTeamName.y = 8
        ctn.addChild(this.lTeamName)

        this.rTeamName = new PIXI.Text('包邮队', ts)
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
            this.lTeamName.text = data.lTeamInfo.name
            this.rTeamName.text = data.rTeamInfo.name
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


    setScore() {

    }
}