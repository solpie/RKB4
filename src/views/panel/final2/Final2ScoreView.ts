import { Final2Score } from './Final2Score';
import { WebDBCmd } from '../webDBCmd';
import { TimerState } from '../const';
declare let $;
declare let io;
export class Final2ScoreView {
    localWS
    scorePanel: Final2Score
    constructor(stage) {
        this.localWS = this.initLocalWs()
        this.scorePanel = new Final2Score()
        stage.addChild(this.scorePanel)
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