import { imgLoader } from '../../utils/ImgLoader';
import { PokerPanel } from './PokerPanel';
import { PokerPlayer } from './PokerPlayer';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../webDBCmd";
declare let io;
export class PokerView {
    pokerPlayer: Array<PokerPlayer>
    pokerMap: any
    pokerPanel: PokerPanel
    constructor(stage) {
        let frameUrl
        for (let i = 0; i < 13; i++) {
        }
        imgLoader.loadTexArr(['/img/panel/bracket/final/playerBg1.png'], _ => {
            this.pokerPanel = new PokerPanel()
            stage.addChild(this.pokerPanel)
            this.initLocal()
        }, false)

        // this.pokerPlayer = []
        // for (let i = 0; i < 12; i++) {
        //     let p = new PokerPlayer
        //     this.pokerPlayer.push(p)
        // }
        // this.pokerMap = {}
    }
    /**
     * p1 d1
     *
     * 
     */
    show(data) {
        let rowNum = data.rowNum
        if (rowNum == 4) {
            for (let i = 0; i < 4; i++) {
                let pokerPlayer = this.pokerPlayer[i];
                pokerPlayer.x = 20 + i * 150
                pokerPlayer.y = 200
            }
            for (let i = 0; i < 4; i++) {
                let pokerPlayer = this.pokerPlayer[4 + i];
                pokerPlayer.x = 20 + i * 150
                pokerPlayer.y = 200
            }
        }
        else if (rowNum == 6) {

        }
    }
    isInit = false
    initLocal() {
        let localWs = io.connect(`/rkb`)
        localWs.on('connect', (msg) => {
            // if (!this.isInit) {
            //     this.isInit = true
            //     $post(`/emit/${WebDBCmd.cs_bracket20Created}`, { _: null })
            // }
            // console.log('connect', window.location.host)
        })
            .on(`${WebDBCmd.sc_showPoker}`, (data) => {
                if (data.pokerNum == 8) {
                    this.pokerPanel.show8Player()
                }
                else if(data.pokerNum==12)
                    this.pokerPanel.show12Player()
                    
                console.log('sc_bracketInit', data)
            })
    }
}