import { BaseGameView, syncDoc } from "./BaseGame";
import LiveDataView from "./livedataView";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";

let LVE = LiveDataView
let dbIdx;
export default class CommonView extends BaseGameView {
    isLoadedCfg = false
    playerMap = {}
    gameInfoTable = []
    lHupuID = ''
    rHupuID = ''
    constructor(liveDataView: LiveDataView) {
        super()
        liveDataView.on(LVE.EVENT_ON_FILE, data => {
            this.loadGameCfg(data)
            this.initCommonView(liveDataView)
        })
    }
    initCommonView(lv: LiveDataView) {
        // lv.on(LVE.EVENT_ON_FILE, data => {
        //     this.loadGameCfg(data)
        // })
        lv.on(WebDBCmd.cs_init, data => {
            console.log('commonview cs_init', data);
            this.emitGameInfo()
        })
        lv.on(LVE.EVENT_SET_VS, vsStr => {
            this.newGame(vsStr)
        })
    }



    emitGameInfo() {
        syncDoc(dbIdx, doc => {
            let data: any = { _: null }
            data.winScore = 3
            data.gameIdx = this.gameIdx
            let lPlayerData = this.getPlayerInfo(this.lPlayer).data
            let rPlayerData = this.getPlayerInfo(this.rPlayer).data
            lPlayerData.rankingData = { ranking: 12, color: 0xffff00 }
            rPlayerData.rankingData = { ranking: 12, color: 0xffff00 }
            data.leftScore = this.lScore
            data.rightScore = this.rScore
            data.leftFoul = this.lFoul
            data.rightFoul = this.rFoul
            data.leftPlayer = lPlayerData
            data.rightPlayer = rPlayerData
            $post(`/emit/${WebDBCmd.cs_init}`, data)
        })
    }

    getPlayerInfo(playerId) {
        return this.playerMap[playerId]
    }

    loadGameCfg(data) {
        this.isLoadedCfg = true
        let gameCfg = JSON.parse(data)
        console.log('game title:', gameCfg.gameTitle);
        dbIdx = gameCfg.dbIdx;
        let playerArr = gameCfg.playerArr
        for (let p of gameCfg.playerArr) {
            this.playerMap[p.playerId] = p
            let data = JSON.parse(JSON.stringify(p))
            p.data = data
        }
        console.log('player count:', playerArr.length);
        //setGameInfo
        syncDoc(dbIdx, doc => {
            let game = doc.rec[doc.gameIdx]
            this.gameIdx = doc.gameIdx
            this.setPlayer(game.player[0], game.player[1])
        })
    }

    setPlayer(lPlayerId, rPlayerId) {
        this.lPlayer = lPlayerId
        this.rPlayer = rPlayerId
        this.lHupuID = this.getHupuId(this.lPlayer)
        this.rHupuID = this.getHupuId(this.rPlayer)
    }

    newGame(vsStr) {
        this.gameIdx++
        let a = vsStr.split(' ')
        if (a.length == 2) {
            let p1 = a[0]
            let p2 = a[1]
            this.setPlayer(p1, p2)
            syncDoc(dbIdx, doc => {
                if (!doc.rec)
                    doc.rec = {}
                doc.gameIdx = this.gameIdx
                let r: any = doc['rec'][this.gameIdx] = {
                    player: [p1, p2],
                    score: [0, 0],
                    foul: [0, 0],
                }
            }, true)
        }
    }

    onCommit() {

    }

    getHupuId(playerId) {
        for (let k in this.playerMap) {
            let o = this.playerMap[k]
            if (o.name == playerId)
                return o.hupuID
        }
        return ''
    }

    initGame() {
        syncDoc(dbIdx, doc => {
            doc.rec = {}
            doc.gameIdx = 0
        }, true)
    }
    initView() {

    }
}