import { BaseGameView, IBaseGameView } from './BaseGame';
import { getAllPlayer } from '../../utils/HupuAPI';
import { MatchType } from '../../panel/score/Com2017';
import { GameInfo } from './GameInfo';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../../panel/webDBCmd";
import { GameMonthView } from "./GameMonthView";
let gmv = new GameMonthView()
export default class LiveDateView {
    gameView: IBaseGameView
    gmv: GameMonthView
    timeInput: number = 0
    constructor() {
        this.gameView = gmv
        this.gmv = gmv

        gmv['timeInput'] = 0
        gmv['actPanel'] = '1'
        console.log('livedata view');
    }

    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }

    setLScore(score) {
        this.gameView.lScore = Number(score)
        this.emitScore()
    }
    setRScore(score) {
        this.gameView.rScore = Number(score)
        this.emitScore()
    }
    setLFoul(f) {
        this.gameView.lFoul = Number(f)
        this.emitScore()
    }
    setRFoul(f) {
        this.gameView.rFoul = Number(f)
        this.emitScore()
    }

    setGameInfo() {
        this.emitInfo()
    }

    emitInfo() {
        // let data: any = this.gameInfo.getGameData()
        // data._ = null
        let data: any = { _: null }
        data.gameIdx = 20
        data.matchType = MatchType.Master
        $post(`/emit/${WebDBCmd.cs_init}`, data)
    }
    emitScore() {
        let data: any = { _: null }
        data.leftScore = Number(this.gameView.lScore)
        data.rightScore = Number(this.gameView.rScore)
        data.leftFoul = Number(this.gameView.lFoul)
        data.rightFoul = Number(this.gameView.rFoul)
        $post(`/emit/${WebDBCmd.cs_score}`, data)
    }

    setTimer(state, sec?) {
        let data: any = { _: null, state: state }
        if (sec)
            data['sec'] = sec

        $post(`/emit/${WebDBCmd.cs_setTimer}`, data)
    }
    commit() {
        let data: any = { _: null }
        this.gameView.commit()
        $post(`/emit/${WebDBCmd.cs_setTimer}`, data)

    }
    ///game month
    initGameMonth(gameId) {
        gmv.initGameMonth(gameId)
    }
    getGameInfo(row) {
        let gameIdx = row.gameIdx
        gmv.setGameInfo(gameIdx)
        console.log('getGameInfo', row);
    }

}