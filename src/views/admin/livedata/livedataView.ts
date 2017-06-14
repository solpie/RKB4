import { GameInfo } from './GameInfo';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../../panel/webDBCmd";
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
    emitScore() {
        let data: any = { _: null }
        data.leftScore = Number(this.gameInfo.lScore)
        data.rightScore = Number(this.gameInfo.rScore)
        data.leftFoul = Number(this.gameInfo.lFoul)
        data.rightFoul = Number(this.gameInfo.rFoul)
        $post(`/emit/${WebDBCmd.cs_score}`, data)
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
}