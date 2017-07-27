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
    pokerPlayerArr: Array<PokerPlayer> = []
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

        for (let i = 0; i < 10; i++) {
            let pp = new PokerPlayer();
            pp.x = 1130 + (i + 1) * 50
            pp.y = pokerPlayer.y
            this.pokerPlayerArr.push(pp)
            this.pokerCtn.addChildAt(pp, 1)
        }
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
            // if (!this.isInit) {
            // this.isInit = true
            setTimeout(_ => {
                $post(`/emit/${WebDBCmd.cs_bracket20Created}`, { _: null })
            }, 3000)
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
                TweenEx.delayedCall(2500, _ => {
                    let gameIdx = data.pokerStr.substring(1)
                    let pos = this.bracket.posMap[gameIdx]
                    console.log('toPos', pos, gameIdx);
                    if (pos) {
                        this.pokerPlayer.toPos(1130, 640, pos[0], pos[1], _ => {
                            for (let i = 0; i < this.pokerPlayerArr.length; i++) {
                                let pp = this.pokerPlayerArr[i];
                                TweenEx.to(pp, i * 80, { x: 1130 + (i + 1) * 50 })
                            }
                        })
                        for (let i = 0; i < this.pokerPlayerArr.length; i++) {
                            let pp = this.pokerPlayerArr[i];
                            TweenEx.to(pp, i * 30, { x: 1130 })
                        }
                    }
                })
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