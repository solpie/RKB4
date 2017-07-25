import { EventDispatcher } from '../../utils/EventDispatcher';
import { BaseGameView, getDoc, IBaseGameView } from './BaseGame';
import { getAllPlayer } from '../../utils/HupuAPI';
import { MatchType } from '../../panel/score/Com2017';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../../panel/webDBCmd";
import { GameMonthView } from "./GameMonthView";
let gmv = new GameMonthView()
export default class LiveDataView extends EventDispatcher {
    EVENT_SET_GAME_INFO = 'EVENT_SET_GAME_INFO'
    EVENT_INIT_BRACKET = 'EVENT_INIT_BRACKET'
    static EVENT_SET_SCORE = 'EVENT_SET_SCORE'
    gameView: IBaseGameView
    gmv: GameMonthView
    $vm: any
    constructor() {
        super()
        this.gameView = gmv
        this.gmv = gmv
    }
    appendProp(gmv) {
        gmv['timeInput'] = 0
        gmv['actPanel'] = '1'
        gmv['group'] = ''
        gmv['inputVS'] = ''
        gmv['inputScore'] = ''
        gmv['inputChampion'] = ''
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

    commit() {
        this.setTimer(0, 0)
        this.setTimer(-1, 0)
        let data: any = { _: null }
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
        this.emit(this.EVENT_SET_GAME_INFO, gameIdx)
        console.log('getGameInfo', row);
    }

    showGroup(g) {
        gmv['actPanel'] = '2'
        gmv['group'] = g
        gmv.showGroup(g)
    }

    showChampion(groupName, title) {
        if (groupName) {
            if (groupName == 'hide')
                gmv.hideChampion()
            else
                gmv.showChampion(groupName, title)
        }
    }

    hideGroup() {
        gmv.hideGroup()
    }

    setVS(vsStr) {
        gmv.setVS(vsStr)
    }

    setScore(scoreStr) {
        this.emit(LiveDataView.EVENT_SET_SCORE, scoreStr)
        // gmv.setScore(scoreStr)
    }

    initMaster() {
        // gmv.initMaster()
        this.emit(this.EVENT_INIT_BRACKET)
    }

    clearMaster(s) {
        gmv.clearMaster(s)
    }

    showGamePlayerInfo(v) {
        gmv.showGamePlayerInfo(v)
    }
}