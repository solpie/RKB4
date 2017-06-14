import { GameInfo } from './GameInfo';
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
        this.gameInfo.lScore = score
    }
    setRScore(score) {
        this.gameInfo.rScore = score
    }

    setLFoul(f) {
        this.gameInfo.lFoul = f
    }
    setRFoul(f) {
        this.gameInfo.rFoul = f
    }
}