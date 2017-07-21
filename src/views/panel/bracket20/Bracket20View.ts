import { Bracket20 } from './Bracket20';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../webDBCmd";
import { routeBracket } from "./Bracket20Route";
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
        routeBracket(rec)
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
                console.log('sc_bracketInit', data)
                this.onBracketData(data.rec);
            })
    }
}