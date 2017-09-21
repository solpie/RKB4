import { routeBracket24 } from './Bracket24Route';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../webDBCmd";

declare let io;
export class Bracket24View {
    constructor() {

    }

    initLocal() {
        let localWs = io.connect(`/rkb`)
        localWs.on('connect', (msg) => {
            // if (!this.isInit) {
            // this.isInit = true
            setTimeout(_ => {
                $post(`/emit/${WebDBCmd.cs_bracket24Created}`, { _: null })
            }, 3000)
            console.log('connect', window.location.host)
        })
            .on(`${WebDBCmd.sc_bracket24Init}`, (data) => {
                console.log('sc_bracket32Init', data)
                this.onBracketData(data.rec);
            })
        
    }

    onBracketData(rec) {
        let data = routeBracket24(rec)
        // this.bracket.setRec(rec, data.incoming)
    }

}