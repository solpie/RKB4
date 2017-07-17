import { BaseGameView, syncDoc } from './BaseGame';
import LiveDataView from './livedataView';
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
let gameDate = 730
export class DoubleEliminationView extends BaseGameView {
    //gameIdx from 1 - 39
    constructor(liveDataView: LiveDataView) {
        super()
        syncDoc(gameDate, doc => {
            console.log('sync doc', doc);
            if (!doc['rec']) {
                this.initBracket(doc)
            }
        })
        liveDataView.on(WebDBCmd.cs_init, data => {
            console.log('DoubleElimination cs_init', data);
            syncDoc(gameDate, doc => {
                $post(`/emit/${WebDBCmd.cs_bracket20Init}`, doc)
            })
        })
        liveDataView.on(WebDBCmd.cs_score, data => {
            console.log('DoubleElimination', data);
            this.lScore = data.leftScore || this.lScore
            this.rScore = data.rightScore || this.rScore
        })

        liveDataView.on(WebDBCmd.cs_commit, data => {
            console.log(this, 'cs_commit', data);
            this.gameIdx++
        })
    }

    initBracket(doc) {
        doc['rec'] = {}
        for (let i = 0; i < 39; i++) {
            doc['rec'][i + 1] = { gameIdx: i + 1, player: ['', ''], score: ['', ''], foul: ['', ''] }
        }
    }
}