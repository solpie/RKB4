import { Backend } from './Backend';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../webDBCmd";
import { routeBracket24 } from "../bracketM4/Bracket24Route";
declare let $;
declare let io;
export class BackendView {
    backend: Backend
    constructor(stage) {
        console.log('init backend view');
        this.backend = new Backend()
        stage.addChild(this.backend)
        this.initLocal()
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
                console.log('sc_bracket24Init', data)
                this.onBracketData(data.rec);
            })

    }
    onBracketData(rec) {
        let data = routeBracket24(rec)
        this.backend.setRec(rec, data.incoming)
    }
}