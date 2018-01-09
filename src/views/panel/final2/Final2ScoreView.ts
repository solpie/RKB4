import { Final2Score } from './Final2Score';
import { WebDBCmd } from '../webDBCmd';
import { TimerState, FontName } from '../const';
import { TweenEx } from '../../utils/TweenEx';
declare let $;
declare let io;
export class Final2ScoreView {
    localWS
    scorePanel: Final2Score
    constructor(stage) {

        //preload font
        let f1 = this.preLoadFont(FontName.DigiLED)
        stage.addChild(f1)
        let f2 = this.preLoadFont(FontName.Impact)
        stage.addChild(f2)
        TweenEx.delayedCall(2000, _ => {
            this.localWS = this.initLocalWs()
            this.scorePanel = new Final2Score()
            stage.removeChild(f1)
            stage.removeChild(f2)
            stage.addChild(this.scorePanel)
        })
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
    }
}