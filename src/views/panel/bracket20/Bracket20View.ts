import { newModal } from '../../utils/PixiEx';
import { TweenEx } from '../../utils/TweenEx';
import { Bracket20 } from './Bracket20';
import { $post } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../webDBCmd";
import { routeBracket } from "./Bracket20Route";
import { PokerPlayer } from "../poker/PokerPlayer";
declare let $;
declare let io;

export class Bracket20View {
    bracket: Bracket20
    isMonth: boolean
    pokerPlayer: PokerPlayer

    pokerCtn: PIXI.Container
    constructor(stage) {
        this.bracket = new Bracket20(stage)

        this.pokerCtn = new PIXI.Container()
        stage.addChild(this.pokerCtn)
        this.initPokerPanel()

        this.initLocal()
    }
    initPokerPanel() {
        // TweenEx.delayedCall(1500, _ => {
        //     this.bracket.setFirstView()
        // })
        // let isPoker = getUrlQuerys('poker')
        let black = newModal(0.9, 1500, 1080)
        black.x = 1060
        this.pokerCtn.addChild(black)

        let pokerPlayer = new PokerPlayer()
        this.pokerPlayer = pokerPlayer
        pokerPlayer.x = 1130
        pokerPlayer.y = 640
        this.pokerCtn.visible = false
        this.pokerCtn.addChild(pokerPlayer)
    }

    onBracketData(rec) {
        let data = routeBracket(rec)
        this.bracket.setRec(rec, data.incoming)
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
            .on(`${WebDBCmd.sc_showPokerPlayer}`, (data) => {
                console.log('sc_showPokerPlayer', data, this.pokerPlayer)
                this.pokerPlayer.reset()
                this.pokerPlayer.setPoker(data.pokerStr)
                this.pokerPlayer.setInfo(data.playerData.data)
            })
            .on(`${WebDBCmd.sc_showPoker}`, (data) => {
                console.log('sc_showPokerPlayer', data, this.pokerPlayer)
                this.pokerCtn.visible = data.visible
                if (data.visible) {
                    this.bracket.setFirstView()
                }
            })
    }
}