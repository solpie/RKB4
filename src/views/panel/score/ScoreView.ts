import { ScoreM2 } from './ScoreM2';
import { WebDBCmd } from '../webDBCmd';
import { Score2017 } from './Score2017';
import { getUrlQuerys, $post } from '../../utils/WebJsFunc';
import { CommandId } from "./CommandId";
import { TimerState } from "../const";
import { getHupuWS } from "../../utils/HupuAPI";
import { TweenEx } from "../../utils/TweenEx";
declare let io;
function logEvent(...a) {
    let d = new Date()
    let t = '[' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ']'
    console.info(t, a)
}
export class ScoreView {
    scorePanel: Score2017
    eventPanel: any
    delayTimeMS: number = 0
    constructor(stage: PIXI.Container) {
        let gameId = getUrlQuerys('gameId')
        let isDark = getUrlQuerys('theme') == 'dark'
        let isMonth = getUrlQuerys('m') == '1'
        console.log(gameId, isDark)
        if (isMonth)
            this.scorePanel = new ScoreM2(stage, isDark)
        else
            this.scorePanel = new Score2017(stage, isDark)

        this.initLocalWs()
        this.initRemote()
    }

    initDefaultPlayer() {
        let p = 'http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg'
        this.scorePanel.setLeftPlayerInfo('Player 1', p, 78, 178, '', 0)
        this.scorePanel.setRightPlayerInfo('Player 2', p, 78, 178, '', 0)
    }

    initRemote() {
        // getHupuWs()
        let isRunning = false
        getHupuWS((hupuWsUrl) => {
            let remoteIO = io.connect(hupuWsUrl);
            let setPlayer = (leftPlayer, rightPlayer) => {
                console.log(leftPlayer)
                // player level 0 其他 1 至少一个胜场  2 大师赛 3冠军
                this.scorePanel.setLeftPlayerInfo(leftPlayer.name, leftPlayer.avatar, leftPlayer.weight, leftPlayer.height, leftPlayer.groupId, leftPlayer.level)
                this.scorePanel.setRightPlayerInfo(rightPlayer.name, rightPlayer.avatar, rightPlayer.weight, rightPlayer.height, rightPlayer.groupId, rightPlayer.level)
            };
            let gameId = getUrlQuerys('gameId')
            remoteIO.on('connect', () => {
                console.log('hupuAuto socket connected', hupuWsUrl);
                remoteIO.emit('passerbyking', {
                    game_id: gameId,
                    page: 'score'
                })

                TweenEx.delayedCall(2500, () => {
                    if (!isRunning)
                        this.initDefaultPlayer()
                });
            });

            remoteIO.on('wall', (data: any) => {
                let event = data.et;
                let eventMap = {};
                console.log('event:', event, data);

                eventMap['init'] = () => {
                    console.log("eventMap['init']", data);
                    logEvent('init', data);
                    this.scorePanel.set35ScoreLight(data.winScore);
                    this.scorePanel.setGameIdx(Number(data.gameIdx), Number(data.matchType));
                    setPlayer(data.player.left, data.player.right);
                    this.scorePanel.setLeftScore(data.player.left.leftScore);
                    this.scorePanel.setRightScore(data.player.right.rightScore);
                    this.scorePanel.setLeftFoul(data.player.left.leftFoul);
                    this.scorePanel.setRightFoul(data.player.right.rightFoul);
                    data.delayTimeMS = this.delayTimeMS

                    let gameStatus = Number(data.status)
                    if (data.status == 0) {//status字段吧 0 进行中 1已结束 2 ready
                        let gameTime = Math.floor(data.t / 1000 - Number(data.st))
                        this.scorePanel.setTimer(gameTime)
                        this.scorePanel.toggleTimer(TimerState.RUNNING);
                    }
                    else if (data.status == 2) {
                        this.scorePanel.toggleTimer(TimerState.PAUSE);
                        this.scorePanel.resetTimer();
                    }
                    // if (gameTime > 0)
                    //     this.scorePanel.toggleTimer(TimerState.RUNNING)
                    // this.emit('init', data)
                    //setup timer
                    // console.log('$opView', this.$opView);
                    // this.$opView.setSrvTime(data.t);

                    // this.$opView.liveTime = DateFormat(new Date(this.srvTime), "hh:mm:ss");


                    //test
                    // this.eventPanel.playerInfoCard.fadeInWinPlayer(true, data.player.left);
                    // this.eventPanel.playerInfoCard.fadeInWinPlayer(false, data.player.right);
                    // this.scorePanel.resetTimer();
                    // this.scorePanel.toggleTimer1(TimerState.RUNNING);
                    // Tween.get(this).wait(3000).call(()=> {
                    //     this.scorePanel.toggleTimer1(TimerState.PAUSE);
                    // });
                    // this.scorePanel.setRightFoul(3)
                    // this.scorePanel.setLeftFoul(4)

                };

                eventMap['updateScore'] = () => {
                    console.log('updateScore', data);
                    logEvent('updateScore', data);
                    if (data.leftScore != null)
                        this.scorePanel.setLeftScore(data.leftScore);
                    if (data.rightScore != null)
                        this.scorePanel.setRightScore(data.rightScore);
                    if (data.rightFoul != null)
                        this.scorePanel.setRightFoul(data.rightFoul);
                    if (data.leftFoul != null)
                        this.scorePanel.setLeftFoul(data.leftFoul);
                };

                eventMap['timeStart'] = () => {
                    console.log('timeStart', data);
                    this.scorePanel.toggleTimer(TimerState.RUNNING);
                }
                eventMap['startGame'] = () => {
                    console.log('startGame', data);
                    logEvent('startGame', data)
                    this.scorePanel.set35ScoreLight(data.winScore);
                    this.scorePanel.setGameIdx(data.gameIdx, Number(data.matchType));
                    setPlayer(data.player.left, data.player.right);
                    // window.location.reload();
                    this.scorePanel.toggleTimer(TimerState.PAUSE);
                    this.scorePanel.resetScore();
                    this.scorePanel.resetTimer();
                };

                eventMap['commitGame'] = () => {
                    console.log('commitGame', data)
                    logEvent('commitGame', data)
                    let player = data.player

                    this.eventPanel.showWin(player)
                    this.scorePanel.toggleTimer(TimerState.PAUSE);
                };
                if (eventMap[event]) {
                    isRunning = true
                    let d = this.delayTimeMS;
                    logEvent(event, 'delay', d, data)
                    if (event == 'init')
                        d = 0
                    // this.emit(event, data)
                    TweenEx.delayedCall(d, () => {
                        eventMap[event]();
                    });
                }
            });
        })
    }
    initLocalWs() {
        let localWs = io.connect(`/rkb`)
        localWs.on('connect', (msg) => {
            console.log('connect', window.location.host)
            $post(`/emit/${WebDBCmd.cs_panelCreated}`, { _: null })
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
            .on(`${CommandId.sc_showChampion}`, (data) => {
                let player = this.scorePanel.getPlayerInfo(data.isLeft)
                this.eventPanel.showChampion(data.title, player)
                this.eventPanel.champion.show()
                this.scorePanel.hide()
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
                this.scorePanel.setGameIdx(data.gameIdx, data.matchType)
            })
            .on(`${WebDBCmd.sc_score}`, (data) => {
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