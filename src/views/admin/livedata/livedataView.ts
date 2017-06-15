import { getAllPlayer } from '../../utils/HupuAPI';
import { MatchType } from '../../panel/score/Com2017';
import { GameInfo } from './GameInfo';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../../panel/webDBCmd";
import { GameMonthView } from "./GameMonthView";
let gmv = new GameMonthView()
export default class LiveDateView {
    gameInfo: GameInfo

    constructor() {
        this.gameInfo = new GameInfo()
        console.log('livedata view');
    }

    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }

    setLScore(score) {
        this.gameInfo.lScore = Number(score)
        this.emitScore()
    }
    setRScore(score) {
        this.gameInfo.rScore = Number(score)
        this.emitScore()
    }
    setLFoul(f) {
        this.gameInfo.lFoul = Number(f)
        this.emitScore()
    }
    setRFoul(f) {
        this.gameInfo.rFoul = Number(f)
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
        data.leftScore = Number(this.gameInfo.lScore)
        data.rightScore = Number(this.gameInfo.rScore)
        data.leftFoul = Number(this.gameInfo.lFoul)
        data.rightFoul = Number(this.gameInfo.rFoul)
        $post(`/emit/${WebDBCmd.cs_score}`, data)
    }

    setTimer(state, sec?) {
        let data: any = { _: null, state: state }
        if (sec)
            data['sec'] = sec

        $post(`/emit/${WebDBCmd.cs_setTimer}`, data)
    }
    ///game month
    initGameMonth(gameId) {
        gmv.initGameMonth(gameId)
    }

}