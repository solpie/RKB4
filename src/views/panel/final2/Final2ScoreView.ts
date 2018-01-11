import { Final2Score } from './Final2Score';
import { WebDBCmd } from '../webDBCmd';
import { TimerState, FontName } from '../const';
import { TweenEx } from '../../utils/TweenEx';
import { TeamVictory } from './TeamVictory';
import { Game3v3 } from './Game3v3';
import { getUrlQuerys } from '../../utils/WebJsFunc';
declare let $;
declare let io;
export class Final2ScoreView {
    localWS
    scorePanel: Final2Score
    teamVictory: TeamVictory
    game3v3: Game3v3
    stage: any
    constructor(stage) {
        this.stage = stage

        //preload font
        let f1 = this.preLoadFont(FontName.DigiLED)
        stage.addChild(f1)
        let f2 = this.preLoadFont(FontName.Impact)
        stage.addChild(f2)
        TweenEx.delayedCall(2000, _ => {
            this.localWS = this.initLocalWs()
            stage.removeChild(f1)
            stage.removeChild(f2)
            this.initPanel()
            // stage.addChild(teamVictory)
        })
    }
    initPanel() {
        let is3v3 = getUrlQuerys('g3') == 1
        if (is3v3) {
            this.show3v3()
        }
        else {
            this.scorePanel = new Final2Score()
            this.stage.addChild(this.scorePanel)
            let teamVictory = new TeamVictory(this.stage)
            this.teamVictory = teamVictory
        }

    }
    preLoadFont(fontName) {
        let t = new PIXI.Text('', {
            fontFamily: fontName,
        })
        t.text = '0'
        t.alpha = 0
        return t
    }

    initLocalWs() {
        let localWs = io.connect(`/rkb`)
            .on(`${WebDBCmd.sc_init}`, (data) => {
                console.log('sc_init', data);
                this.scorePanel.setInit(data)
            })
            .on(`${WebDBCmd.sc_score}`, (data) => {
                console.log('sc_score', data);
                this.scorePanel.setScoreFoul(data)
            })
            .on(`${WebDBCmd.sc_showRollText}`, (data) => {
                console.log('sc_showRollText', data);
                // this.scorePanel.setScoreFoul(data)
                // if (data.visible)
                this.scorePanel.showTips(data)
                // else {
                // this.scorePanel.tips.hide()
                // }
            })
            .on(`${WebDBCmd.sc_setTimer}`, (data) => {
                console.log('webdbcmd', data);
                let s = data.state
                if (s == TimerState.RUNNING) {
                    // this.scorePanel.resetTimer()
                    console.log('start timer');
                    this.scorePanel.toggleTimer(Number(s))
                }
                else if (s == TimerState.PAUSE) {
                    this.scorePanel.toggleTimer(s)
                }
                else if (s == TimerState.RESET) {
                    this.scorePanel.resetTimer()
                }
                if ('sec' in data) {
                    this.scorePanel.setTimer(data.sec)
                }
            })
            .on(WebDBCmd.sc_3v3Init, data => {
                this.show3v3(data)
            })
            .on(WebDBCmd.sc_timeOut, data => {
                console.log('sc_timeOut', data);
                this.scorePanel.setTimeOut(data)
            })
            .on(WebDBCmd.sc_showVictory, data => {
                console.log('sc_showVictory', data);
                if (data.visible)
                    this.teamVictory.show(data)
                else
                    this.teamVictory.hide()
            })
    }


    show3v3(data?) {
        if (!this.game3v3) {
            this.game3v3 = new Game3v3()
            this.stage.addChild(this.game3v3)
        }
        this.game3v3.setTeamInfo(data)
    }
}