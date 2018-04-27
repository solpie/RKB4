import { WebDBCmd } from '../webDBCmd';
import { TimerState, FontName } from '../const';
import { TweenEx } from '../../utils/TweenEx';
import { getUrlQuerys, $post } from '../../utils/WebJsFunc';
import { Score2018 } from './Score2018';
import { Group5 } from './5Group';
declare let $;
declare let io;
export class Bo3View {
    localWS
    scorePanel: Score2018
    _5group: Group5
    stage: any
    is3v3: Boolean = false
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
        if (getUrlQuerys('5g') != '1')
            this.scorePanel = new Score2018(this.stage)
        // let teamVictory = new TeamVictory(this.stage)
        // this.teamVictory = teamVictory
    }
    isInit = false
    initLocalWs() {
        let localWs = io.connect(`/rkb`)
        localWs.on('connect', (msg) => {
            console.log('Bo3 connect', window.location.host)
            if (!this.isInit) {
                this.isInit = true
                // $post(`/emit/${WebDBCmd.cs_panelCreated}`, { _: null })
            }
        })
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
                // this.scorePanel.showTips(data)
            })
            .on(`${WebDBCmd.sc_bo3Score}`, (data) => {
                console.log('sc_bo3Score', data);
                if (this.scorePanel)
                    this.scorePanel.setBo3Score(data)
            })
            .on(`${WebDBCmd.sc_bo3_5group}`, (data) => {
                console.log('sc_bo3_5group', data);
                if (getUrlQuerys('5g') == '1')
                    this.show5Group(data)
                // this.scorePanel.setBo3Score(data)
            })
            .on(`${WebDBCmd.sc_setTimer}`, (data) => {
                console.log('webdbcmd', data);
                let s = data.state
                // let panel = this.panel
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
    show5Group(data) {
        if (data.visible) {
            if (!this._5group) {
                this._5group = new Group5(this.stage, data)
            }
            this._5group.show(data)
        }
        else {
            if (this._5group)
                this._5group.hide()
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
}