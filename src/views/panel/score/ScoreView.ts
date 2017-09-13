import { ScoreM4 } from './ScoreM4';
import { ScoreM2 } from './ScoreM2';
import { WebDBCmd } from '../webDBCmd';
import { Score2017 } from './Score2017';
import { getUrlQuerys, $post } from '../../utils/WebJsFunc';
import { CommandId } from "./CommandId";
import { TimerState } from "../const";
import { getHupuWS } from "../../utils/HupuAPI";
import { TweenEx } from "../../utils/TweenEx";
import { ScoreM3 } from "./ScoreM3";
declare let io;
function logEvent(...a) {
    let d = new Date()
    let t = '[' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ']'
    console.info(t, a)
}
export class ScoreView {
    scorePanel: ScoreM4
    eventPanel: any
    delayTimeMS: number = 0
    localWS: any
    constructor(stage: PIXI.Container) {
        let gameId = getUrlQuerys('gameId')
        let isDark = getUrlQuerys('theme') == 'dark'
        let isMonth = getUrlQuerys('m') == '1'
        console.log(gameId, isDark)
        if (isMonth)
            this.scorePanel = new ScoreM4(stage, isDark)
        else {
            // this.scorePanel = new Score2017(stage, isDark)
            // this.initRemote()
        }
        // TweenEx.delayedCall(2000, _ => {
        this.localWS = this.initLocalWs()
        // })
    }

    initDefaultPlayer() {
        let p = 'http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg'
        this.scorePanel.setLeftPlayerInfo('Player 1', p, 78, 178, '', 0, {})
        this.scorePanel.setRightPlayerInfo('Player 2', p, 78, 178, '', 0, {})
    }


    isInit = false
    initLocalWs() {
        let localWs = io.connect(`/rkb`)
        localWs.on('connect', (msg) => {
            console.log('connect', window.location.host)
            if (!this.isInit) {
                this.isInit = true
                $post(`/emit/${WebDBCmd.cs_panelCreated}`, { _: null })
            }
        })
            .on(`${CommandId.sc_setDelayTime}`, (data) => {
                this.delayTimeMS = data.delayTimeMS
            })
            .on(`${CommandId.sc_toggleTheme}`, (data) => {
                // let isDark = data.isDark
                // let ob = this.$route.params.op != "op"
                // window.location.href = getScorePanelUrl(this.gameId, isDark, ob)
                // window.location.reload()
            })
            .on(`${CommandId.sc_toggleScorePanel}`, (data) => {
                data.visible ?
                    this.scorePanel.show()
                    : this.scorePanel.hide()
            })
            .on(`${CommandId.sc_toggleChampionPanel}`, (data) => {
                data.visible ?
                    this.eventPanel.champion.show()
                    : this.eventPanel.champion.hide()
            })
            .on(`${CommandId.sc_showNotice}`, (data) => {
                this.eventPanel.showNotice(data.title, data.content, data.isLeft, data.isBold)
                data.visible ?
                    this.eventPanel.noticeSprite.show()
                    : this.eventPanel.noticeSprite.hide()
            })
            //score fx
            .on(`${CommandId.sc_setFxPoint}`, (data) => {
                this.eventPanel.setFxPoint(data.mx, data.my)
            })
            .on(`${CommandId.sc_playScoreFx}`, (data) => {
                this.eventPanel.showScoreFx()
            })
            .on(`${CommandId.sc_setBdVisible}`, (data) => {
                this.eventPanel.showBd(data.v)
                data.v ? this.scorePanel.hide()
                    : this.scorePanel.show()
            })
            //new event
            .on(`${WebDBCmd.sc_init}`, (data) => {
                console.log('sc_init', data);
                if (data.leftPlayer) {
                    let p = data.leftPlayer
                    this.scorePanel.setLeftPlayerInfo(p.name, p.avatar, p.weight, p.height, p.groupId, p.level, {})
                    p = data.rightPlayer
                    this.scorePanel.setRightPlayerInfo(p.name, p.avatar, p.weight, p.height, p.groupId, p.level, {})
                    this.scorePanel.setGameIdx(data.gameIdx, data.matchType)
                    this.scorePanel.set35ScoreLight(data.winScore)
                    this.scorePanel.setLeftFoul(data.leftFoul)
                    this.scorePanel.setRightFoul(data.rightFoul)
                    this.scorePanel.setLeftScore(data.leftScore)
                    this.scorePanel.setRightScore(data.rightScore)
                    this.scorePanel.setExPlayerInfo(data)
                    // if (data.gameTitle) {
                    //     this.scorePanel.setGameTitle(data.gameTitle)
                    // }
                }
            })
            .on(`${WebDBCmd.sc_score}`, (data) => {
                this.scorePanel.setScoreFoul(data)
            })
            .on(`${WebDBCmd.sc_showScore}`, (data) => {
                data.visible ? this.scorePanel.show()
                    : this.scorePanel.hide()
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


        return localWs
    }
}