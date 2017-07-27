import { imgLoader } from '../../utils/ImgLoader';
import { PokerPanel } from './PokerPanel';
import { PokerPlayer } from './PokerPlayer';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../webDBCmd";
declare let io;
export class PokerView {
    pokerPanel: PokerPanel
    constructor(stage) {
        let frameUrl
        for (let i = 0; i < 13; i++) {
        }
        imgLoader.loadTexArr([
            '/img/panel/bracket/final/playerBg1.png',
            '/img/panel/bracket/final/bg1.png',
            '/img/panel/bracket/final/bg2.png',
            '/img/panel/bracket/final/pokerBlack.png',
            '/img/panel/bracket/final/pokerRed.png',
        ], _ => {
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
            .on(`${WebDBCmd.sc_showPokerPlayer}`, (data) => {
                console.log('sc_showPokerPlayer', data);
                this.pokerPanel.showPokerPlayer(data)
            })
            .on(`${WebDBCmd.sc_showPoker}`, (data) => {
                this.pokerPanel.visible = data.visible
                if (data.visible) {
                    if (data.pokerNum == 8) {
                        this.pokerPanel.show8Player()
                    }
                    else if (data.pokerNum == 12)
                        this.pokerPanel.show12Player()
                    else if (data.pokerNum == 0)
                        this.pokerPanel.resetAll()
                }
                console.log('sc_bracketInit', data)
            })
    }
}