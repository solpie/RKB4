import { BaseGameView, syncDoc } from '../livedata/BaseGame';
import LiveDataView from "../livedata/livedataView";
import { syncPlayerData } from "./Final2TeamConst";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";

let LVE = LiveDataView
let dbIdx = '1.20'
let playerDoc = '1.20.player'

export default class Final2TeamView extends BaseGameView {
    isLoadedCfg = false
    playerMap = {}
    gameInfoTable = []
    lRealName = ''
    rRealName = ''
    lHupuID =''
    rHupuID =''
    panelVersion = 'F2'
    liveDataView
    constructor(liveDataView: LiveDataView) {
        super()
        this.liveDataView = liveDataView
        this.initView2()
    }

    onSyncPlayer() {
        syncPlayerData(playerDoc)
    }

    initView2() {
        let lv = this.liveDataView
        syncDoc(playerDoc, doc => {
            for (let team of doc.teamArr) {
                for (let p of team.playerArr) {
                    this.playerMap[p.pid] = p
                }
            }
            console.log('init player data', doc, this.playerMap);
        })
        
        syncDoc(dbIdx, doc => {
            console.log('game db', doc);
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


        lv.on(LVE.EVENT_NEW_GAME, vsStr => {
            this.newGame(vsStr)
        })
    }

    emitGameInfo() {
        let data = { _: null }
        $post(`/emit/${WebDBCmd.cs_init}`, data)
    }

    newGame(vsStr) {
        this.gameIdx++
        let a = vsStr.split(' ')
        if (a.length == 2) {
            let p1 = a[0]
            let p2 = a[1]
            this.setPlayer(p1, p2)
            this.lFoul = this.rFoul = 0
            this.lScore = this.rScore = 0
            syncDoc(dbIdx, doc => {
                if (!doc.rec)
                    doc.rec = {}
                doc.gameIdx = this.gameIdx
                let r: any = doc['rec'][this.gameIdx] = {
                    player: [p1, p2],
                    score: [0, 0],
                    foul: [0, 0],
                }
                this.initView(doc)
            }, true)
        }
    }

    initView(doc) {
        let recMap = doc.rec
        let rowArr: any = []
        for (let idx in recMap) {
            let rec = recMap[idx]
            if (rec) {
                let row = { idx: 0, gameIdx: 0, vs: '', score: '', rPlayer: '', lPlayer: '' }
                row.gameIdx = Number(idx)
                row.idx = row.gameIdx
                row.vs = `[${rec.player[0]} : ${rec.player[1]}]`
                row.lPlayer = this.getRealName(rec.player[0])
                row.rPlayer = this.getRealName(rec.player[1])
                row.score = rec.score[0] + " : " + rec.score[1]
                // console.log('row', row);
                rowArr.push(row)
            }
        }
        this.gameInfoTable = rowArr
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
            if (o.playerId == playerId)
                return o.realName
        }
        return ''
    }


    initRecData() {
        syncDoc(dbIdx, doc => {
            let rec = []
            let a = ['1-2',
                '3-4',
                '1-5',
                '2-4',
                '3-5',
                '1-4',
                '2-3',
                '4-5',
                '1-3',
                '2-5']
            for (let i = 0; i < a.length; i++) {
                let s = a[i]
                let a2 = s.split('-')
                rec.push({
                    gameIdx: i + 1, team: ['t' + a2[0], 't' + a2[1]],
                    gameArr: [
                        {
                            player: ['p1', 'p2'],
                        }]
                })
            }
            doc.rec = {}
        }, true)
    }
}