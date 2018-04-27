import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../../panel/webDBCmd";
import LiveDataView from "./livedataView";
let LVE = LiveDataView

export class Bo3BackView {
    gameCfg: any
    playerMap: any
    constructor(lv) {
        lv.on(LVE.EVENT_5GROUP, v => {
            this.emit5Group(v)
        })
    }
    emitBo3Score() {
        let data = {
            _: '',
            groupScore: this.gameCfg.groupScore
        }
        $post(`/emit/${WebDBCmd.cs_bo3Score}`, data)
    }
    updateBo3Data(gameCfg, playerMap) {
        this.gameCfg = gameCfg
        this.playerMap = playerMap
        // console.log('updateGroupScore', gameCfg.groupScore)
        this.emit5Group(true)
        this.emitBo3Score()
    }

    emit5Group(v) {
        let data = { _: '', groupScore: this.gameCfg.groupScore, playerMap: this.playerMap, visible: v }
        $post(`/emit/${WebDBCmd.cs_bo3_5group}`, data)
    }
}