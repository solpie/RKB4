import { GambleView } from './GambleView';
import { EventDispatcher } from '../../utils/EventDispatcher';
import { BaseGameView, getDoc, IBaseGameView } from './BaseGame';
import { getAllPlayer } from '../../utils/HupuAPI';
import { MatchType } from '../../panel/score/Com2017';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../../panel/webDBCmd";
import { GameMonthView } from "./GameMonthView";
let gmv = new GameMonthView()

let gamble = new GambleView()
export default class LiveDataView extends EventDispatcher {
    static EVENT_SET_GAME_INFO = 'EVENT_SET_GAME_INFO'
    static EVENT_INIT_BRACKET = 'EVENT_INIT_BRACKET'
    static EVENT_SET_SCORE = 'EVENT_SET_SCORE'
    static EVENT_SET_VS = 'EVENT_SET_VS'
    static EVENT_SHOW_CHAMPION = 'EVENT_SHOW_CHAMPION'
    static EVENT_SHOW_POKER_PANEL = 'EVENT_SHOW_POKER_PANEL'
    static EVENT_SHOW_POKER_PLAYER = 'EVENT_SHOW_POKER_PLAYER'
    static EVENT_REMAP_BRACKET = 'EVENT_REMAP_BRACKET'
    static EVENT_RESET_POKER_PICKER = 'EVENT_RESET_POKER_PICKER'
    static EVENT_CUSTOM_PLAYER = 'EVENT_CUSTOM_PLAYER'
    static EVENT_INIT_DOUBLE_ELIMATION = 'EVENT_INIT_DOUBLE_ELIMATION'
    static EVENT_ROLL_TEXT = 'EVENT_ROLL_TEXT'
    static EVENT_SHOW_PROCESS = 'EVENT_SHOW_PROGRESS'
    static EVENT_SHOW_PLAYER_PROCESS = 'EVENT_SHOW_PLAYER_PROCESS'
    static EVENT_SYNC_PLAYER = 'EVENT_SYNC_PLAYER'
    gameView: IBaseGameView
    gmv: GameMonthView
    $vm: any
    constructor() {
        super()
        this.gameView = gmv
        this.gmv = gmv
    }

    appendProp(gmv) {
        gmv['inputPlayerArr'] = ''
        gmv['timeInput'] = 0
        gmv['actPanel'] = '1'
        gmv['group'] = ''
        gmv['inputVS'] = ''
        gmv['inputRoomId'] = ''
        gmv['inputScore'] = ''
        gmv['inputChampion'] = ''
        gmv['inputRollText'] = ''
        //13-20
        gmv['pokerPlayerArrG1'] = [
            { name: 'p13', poker: 'LA', hupuID: '' },
        ]
        // //1-12
        gmv['pokerPlayerArrG2'] = [
            { name: 'p1', poker: 'LA', hupuID: '' },
        ]
        console.log('livedata view');
    }

    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }

    setLScore(score) {
        this.$vm.lScore = Number(score)
        this.emitScore()
    }

    setRScore(score) {
        this.$vm.rScore = Number(score)
        this.emitScore()
    }
    setLFoul(f) {
        this.$vm.lFoul = Number(f)
        this.emitScore()
    }
    setRFoul(f) {
        this.$vm.rFoul = Number(f)
        this.emitScore()
    }

    setGameInfo() {
        this.emit(WebDBCmd.cs_init, {})
    }

    emitScore() {
        let data: any = { _: null }
        data.leftScore = this.$vm.lScore
        data.rightScore = this.$vm.rScore
        data.leftFoul = this.$vm.lFoul
        data.rightFoul = this.$vm.rFoul
        this.emit(WebDBCmd.cs_score, data)
        $post(`/emit/${WebDBCmd.cs_score}`, data)
    }

    setTimer(state, sec?) {
        let data: any = { _: null, state: state }
        if (sec)
            data['sec'] = sec
        $post(`/emit/${WebDBCmd.cs_setTimer}`, data)
    }

    commit(isEnd = false) {
        this.setTimer(0, 0)
        this.setTimer(-1, 0)
        let data: any = { _: null, isEnd: isEnd }
        // this.gameView.commit()
        this.emit(WebDBCmd.cs_commit, data)
        $post(`/emit/${WebDBCmd.cs_setTimer}`, data)
    }
    ///game month
    initGameMonth(gameId) {
        // gmv.initGameMonth(gameId)
    }

    getGameInfo(row) {
        let gameIdx = row.gameIdx
        // gmv.setGameInfo(gameIdx, false)
        this.emit(LiveDataView.EVENT_SET_GAME_INFO, gameIdx)
        console.log('getGameInfo', row);
    }

    showGroup(g) {
        gmv['actPanel'] = '2'
        gmv['group'] = g
        gmv.showGroup(g)
    }

    showChampion(visible, groupName, title) {
        if (groupName) {
            this.emit(LiveDataView.EVENT_SHOW_CHAMPION, {
                visible: visible,
                groupName: groupName,
                title: title,

            })
        }
        // if (groupName) {
        //     if (groupName == 'hide')
        //         gmv.hideChampion()
        //     else
        //         gmv.showChampion(groupName, title)
        // }
    }

    hideGroup() {
        gmv.hideGroup()
    }

    setVS(vsStr) {
        // gmv.setVS(vsStr)
        this.emit(LiveDataView.EVENT_SET_VS, vsStr)

    }

    setScore(scoreStr) {
        this.emit(LiveDataView.EVENT_SET_SCORE, scoreStr)
        // gmv.setScore(scoreStr)
    }

    initBracket() {
        // gmv.initMaster()
        this.emit(LiveDataView.EVENT_INIT_BRACKET)
    }

    clearMaster(s) {
        gmv.clearMaster(s)
    }

    showGamePlayerInfo(v) {
        gmv.showGamePlayerInfo(v)
    }

    showPokerPanel(visible, pokerNum) {
        this.emit(LiveDataView.EVENT_SHOW_POKER_PANEL, { visible: visible, pokerNum: pokerNum })
    }

    showPoker(visible, playerName, pokerStr) {
        this.emit(LiveDataView.EVENT_SHOW_POKER_PLAYER, { visible: visible, playerName: playerName, pokerStr: pokerStr })
    }

    reMapBracket() {
        this.emit(LiveDataView.EVENT_REMAP_BRACKET)
    }

    resetPokerPicker() {
        this.emit(LiveDataView.EVENT_RESET_POKER_PICKER)
    }
    // 
    initDoubleElimation() {
        this.emit(LiveDataView.EVENT_INIT_DOUBLE_ELIMATION)
    }
    setPlayerArr(jsonStr) {
        let playerArr = JSON.parse(jsonStr)
        this.emit(LiveDataView.EVENT_CUSTOM_PLAYER, playerArr)
    }

    showRollText(text, visible = true) {
        this.emit(LiveDataView.EVENT_ROLL_TEXT, { text: text, visible: visible })
    }

    showGameProcess(visible, tab) {
        this.emit(LiveDataView.EVENT_SHOW_PROCESS, { visible: visible, tab: tab })
    }

    syncPlayer() {
        this.emit(LiveDataView.EVENT_SYNC_PLAYER)
    }

    showPlayerProcess(name, player) {
        this.emit(LiveDataView.EVENT_SHOW_PLAYER_PROCESS, { player: player })
    }

    startGamble(roomId,left,right) {
        gamble.startGamble(roomId,left,right)
    }

    testRandomGame() {
        this.emit('testRandomGame')
    }

}