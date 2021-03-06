import { StatisticsView } from '../statistics/StatisticsView';
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
import { ScoreM32 } from './ScoreM32';
declare let io;
function logEvent(...a) {
    let d = new Date()
    let t = '[' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ']'
    console.info(t, a)
}
export class ScoreView {
    scorePanel: any
    eventPanel: any
    delayTimeMS: number = 0
    localWS: any
    statisticsView: StatisticsView
    constructor(stage: PIXI.Container) {
        let gameId = getUrlQuerys('gameId')
        let isDark = getUrlQuerys('theme') == 'dark'
        let isMonth = getUrlQuerys('m') == '1'
        let isMonitor = getUrlQuerys('monitor') == '1'

        console.log(gameId, isDark)
        if (isMonth)
            this.scorePanel = new ScoreM4(stage, isDark)
        else {
            this.scorePanel = new ScoreM32(stage, isDark)
            // this.initRemote()
        }
        // TweenEx.delayedCall(2000, _ => {
        this.localWS = this.initLocalWs()
        // })

        if (isMonitor) {
            this.initMonitor(stage)
        }

        if (getUrlQuerys('t') == '1')
            this.test()
    }
    test() {
        this.localWS.emit()
    }
    initDefaultPlayer() {
        let p = 'http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg'
        this.scorePanel.setLeftPlayerInfo('Player 1', p, 78, 178, '', 0, {})
        this.scorePanel.setRightPlayerInfo('Player 2', p, 78, 178, '', 0, {})
    }

    initMonitor(stage) {
        this.statisticsView = new StatisticsView(stage)
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
                    this.scorePanel.setExPlayerInfo(data)
                    let p = data.leftPlayer
                    this.scorePanel.setLeftPlayerInfo(p.realName, p.avatar, p.weight, p.height, p.groupId, p.level, { text: p.ranking }, p.name)
                    p = data.rightPlayer
                    this.scorePanel.setRightPlayerInfo(p.realName, p.avatar, p.weight, p.height, p.groupId, p.level, { text: p.ranking }, p.name)
                    this.scorePanel.setGameIdx(data.gameIdx, data.matchType, data)
                    this.scorePanel.set35ScoreLight(data.winScore)
                    this.scorePanel.setLeftFoul(data.leftFoul)
                    this.scorePanel.setRightFoul(data.rightFoul)
                    this.scorePanel.setLeftScore(data.leftScore)
                    this.scorePanel.setRightScore(data.rightScore)
                    // if (data.gameTitle) {
                    //     this.scorePanel.setGameTitle(data.gameTitle)
                    // }
                }

                if (this.statisticsView)
                    this.statisticsView.reset()

            })
            .on(`${WebDBCmd.sc_score}`, (data) => {
                this.scorePanel.setScoreFoul(data)
                if (this.statisticsView) {
                    this.statisticsView.setScore(data)
                }
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
            .on(WebDBCmd.sc_showVictory, data => {
                if (this.statisticsView)
                    this.statisticsView.reset()
                if (data.visible) {
                    this.scorePanel.hide()
                    TweenEx.delayedCall(2500, _ => {
                        this.scorePanel.show()
                    })
                }
            })
        return localWs
    }
}