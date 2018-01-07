import { BaseGameView, syncDoc } from '../livedata/BaseGame';
import LiveDataView from "../livedata/livedataView";
import { syncPlayerData, getPlayerArrByPlayerId } from "./Final2TeamConst";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";

let LVE = LiveDataView
let dbIdx = '1.20'
let playerDocIdx = '1.20.player'

export default class Final2TeamView extends BaseGameView {
    isLoadedCfg = false
    playerMap = {}
    gameInfoTable = []
    lRealName = ''
    rRealName = ''
    lHupuID = ''
    rHupuID = ''
    panelVersion = 'F2'
    lPlayerBloodStart = 2
    rPlayerBloodStart = 2
    liveDataView
    constructor(liveDataView: LiveDataView) {
        super()
        this.liveDataView = liveDataView
        this.initFinal2()
    }

    onSyncPlayer() {
        syncPlayerData(playerDocIdx)
    }

    initFinal2() {
        let lv = this.liveDataView
        syncDoc(playerDocIdx, doc => {
            for (let team of doc.teamArr) {
                for (let p of team.playerArr) {
                    this.playerMap[p.pid] = p
                }
            }

            console.log('init player data', doc, this.playerMap);
        })

        syncDoc(dbIdx, doc => {
            console.log('game db', doc);
            this.initDocToView(doc)
        })
        lv.on(WebDBCmd.cs_init, data => {
            // console.log('DoubleElimination cs_init', data);
            this.emitGameInfo()
        })

        lv.on(LVE.EVENT_UPDATE_SCORE, data => {
            this.emitScoreFoul(data)
        })

        lv.on(LVE.EVENT_SYNC_PLAYER, _ => {
            console.log('sync player info');
            this.onSyncPlayer()
        })

        lv.on(LVE.EVENT_SET_GAME_INFO, gameIdx => {
            console.log(this, 'EVENT_SET_GAME_INFO', gameIdx);
            this.setGameInfo(gameIdx)
        })

        lv.on(LVE.EVENT_INIT_BRACKET, _ => {
            this.initRecData()
        })
        lv.on(LVE.EVENT_NEW_GAME, vsStr => {
            this.newGame(vsStr)
        })
        lv.on(WebDBCmd.cs_commit, data => {
            console.log('cs_commit', data);
            this.commit(data)
        })
    }

    commit(data?) {
        syncDoc(dbIdx, doc => {
            let rec = doc['rec'][this.gameIdx]
            rec.player = [this.lPlayer, this.rPlayer]
            let lScore = this.rPlayerBloodStart - this.rScore
            let rScore = this.lPlayerBloodStart - this.lScore
            rec.score = [lScore, rScore]
            rec.blood = [this.lScore, this.rScore]

            this.gameIdx++
            doc.gameIdx = this.gameIdx
            console.log('commit rec', rec);
            this.initDocToView(doc)
        }, true)
    }

    emitGameInfo() {
        let data:any = { _: null }
        getPlayerArrByPlayerId(this.lPlayer, this.rPlayer, (lTeamInfo, rTeamInfo) => {
            console.log('');
            data.lPlayer = this.lPlayer
            data.rPlayer = this.rPlayer
            data.lTeamInfo = lTeamInfo
            data.rTeamInfo = rTeamInfo
            $post(`/emit/${WebDBCmd.cs_init}`, data)
        })
    }

    newGame(vsStr) {
        this.gameIdx++
        let a = vsStr.split(' ')
        if (a.length == 2) {
            let p1 = "p" + a[0]
            let p2 = "p" + a[1]
            this.setPlayer(p1, p2)
            this.lFoul = this.rFoul = 0
            this.lScore = this.rScore = 0
            syncDoc(dbIdx, doc => {
                if (!doc.rec)
                    doc.rec = {}
                doc.gameIdx = this.gameIdx
                let r: any = doc['rec'][this.gameIdx] = {
                    player: [p1, p2],
                    blood: [2, 2],
                    bonus: [0, 0],
                }
                this.initDocToView(doc)
            }, true)
        }
    }

    initDocToView(doc) {
        let recMap = doc.rec
        let rowArr: any = []
        if (recMap)
            for (let idx in recMap) {
                let rec = recMap[idx]
                if (rec) {
                    // for (let rec of game.roundArr) {
                    let row = { idx: 0, gameIdx: 0, vs: '', score: '', rPlayer: '', lPlayer: '' }
                    row.gameIdx = Number(idx)
                    row.idx = row.gameIdx
                    row.vs = `[${rec.player[0]} : ${rec.player[1]}]`
                    row.lPlayer = this.getRealName(rec.player[0])
                    row.rPlayer = this.getRealName(rec.player[1])
                    row.score = rec.blood[0] + " : " + rec.blood[1]
                    // console.log('row', row);
                    rowArr.push(row)
                    // }
                }
            }
        this.gameInfoTable = rowArr
        this.setGameInfo(doc.gameIdx)
    }
    setGameInfo(gameIdx) {
        syncDoc(dbIdx, doc => {
            let rec = doc['rec'][gameIdx]
            this.gameIdx = gameIdx
            this.lPlayer = rec.player[0]
            this.rPlayer = rec.player[1]
            this.lScore = Number(rec.blood[0]) || 0
            this.rScore = Number(rec.blood[1]) || 0
            this.lFoul = Number(rec.bonus[0]) || 0
            this.rFoul = Number(rec.bonus[1]) || 0
            this.lHupuID = this.getRealName(this.lPlayer)
            this.rHupuID = this.getRealName(this.rPlayer)
        })
    }
    setPlayer(lPlayerId, rPlayerId) {
        this.lPlayer = lPlayerId
        this.rPlayer = rPlayerId
        this.lRealName = this.getRealName(this.lPlayer)
        this.rRealName = this.getRealName(this.rPlayer)
    }

    getRealName(playerId) {
        for (let k in this.playerMap) {
            let o = this.playerMap[k]
            if (o.pid == playerId)
                return o.name
        }
        return ''
    }


    initRecData() {
        syncDoc(dbIdx, doc => {
            let rec: any = {}

            // for (let i = 0; i < a.length; i++) {
            //     let s = a[i]
            //     let a2 = s.split('-')
            //     let gameIdx = i + 1
            //     rec[gameIdx] = {
            //         gameIdx: i + 1, team: ['t' + a2[0], 't' + a2[1]],
            //         roundArr: [
            //             {
            //                 player: ['p1', 'p2'],
            //                 blood: [2, 2],
            //                 bonus: [0, 0]
            //             }]
            //     }
            // }
            if (!doc.rec)
                doc.rec = {}
            else
                for (let gameIdx in doc.rec) {
                    let r = doc.rec[gameIdx]
                    r.blood = [2, 2]
                    r.bonus = [0, 0]
                }
            doc.gameIdx = 0
            this.initDocToView(doc)
        }, true)
    }
}