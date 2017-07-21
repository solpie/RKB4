import { Bracket20 } from './Bracket20';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../webDBCmd";
declare let $;
declare let io;
export class Bracket20View {
    bracket: Bracket20
    isMonth: boolean
    constructor(stage) {
        this.bracket = new Bracket20(stage)
        this.initLocal()
    }

    onBracketData(rec) {
        let route = (gameIdx, toWin, toLose) => {
            let rFrom = rec[gameIdx]
            let a = (toWin + '').split('.')
            let winGameIdx = a[0]
            let winPos = Number(a[1])

            a = (toLose + '').split('.')
            let loseGameIdx = a[0]
            let losePos = Number(a[1])

            let rWin = rec[winGameIdx]
            let rLose = rec[loseGameIdx]
            if (rFrom.score[0] == 0 && rFrom.score[1] == 0)
                return
            if (rFrom.score[0] > rFrom.score[1]) {
                rWin.player[winPos] = rFrom.player[0]
                rLose.player[losePos] = rFrom.player[1]
            }
            else {
                rWin.player[winPos] = rFrom.player[1]
                rLose.player[losePos] = rFrom.player[0]
            }
        }
        route(1, 9.1, 16.1)
        route(2, 10.1, 15.1)
        route(3, 11.1, 14.1)
        route(4, 12.1, 13.1)

        this.bracket.setRec(rec)
    }

    isInit: boolean
    initLocal() {
        let localWs = io.connect(`/rkb`)
        localWs.on('connect', (msg) => {
            if (!this.isInit) {
                this.isInit = true
                $post(`/emit/${WebDBCmd.cs_bracket20Created}`, { _: null })
            }
            console.log('connect', window.location.host)
        })
            .on(`${WebDBCmd.sc_bracket20Init}`, (data) => {
                console.log('sc_bracketInit',data)
                this.onBracketData(data.rec);
            })
    }
}