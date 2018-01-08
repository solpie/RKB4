import { BaseGameView, syncDoc } from '../livedata/BaseGame';
import LiveDataView from "../livedata/livedataView";
import { syncPlayerData, getPlayerArrByPlayerId } from "./Final2TeamConst";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { getPlayerInfoArr } from '../../utils/HupuAPI';

let LVE = LiveDataView
let dbIdx = '1.20'
let playerDocIdx = '1.20.player'

export default class Final2TeamView extends BaseGameView {
    playerMap = {}
    gameInfoTable = []
    lRealName = ''
    rRealName = ''
    lHupuID = ''
    rHupuID = ''
    lPlayerBloodStart = 2
    rPlayerBloodStart = 2

    liveDataView
    teamArr = [{ playerArr: [] }]
    constructor(liveDataView: LiveDataView) {
        super()
        this.dbIdx = dbIdx
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
            this.teamArr = doc.teamArr
            console.log('init player data', doc, this.playerMap);

            syncDoc(dbIdx, doc => {
                console.log('game db', doc);
                this.initDocToView(doc)
            })
        })


        lv.on(WebDBCmd.cs_init, data => {
            // console.log('DoubleElimination cs_init', data);
            this.emitGameInfo(data)
        })

        lv.on(LVE.EVENT_UPDATE_SCORE, data => {
            this.onScore(data)
        })

        lv.on(LVE.EVENT_SET_VS, vsStr => {
            let a = vsStr.split(' ')
            if (a.length == 2) {
                vsStr = 'p' + a[0] + ' p' + a[1]
                this.setVS(vsStr, doc => {
                    this.initDocToView(doc)
                })
            }

        })

        lv.on(LVE.EVENT_SYNC_PLAYER, _ => {
            console.log('sync player info');
            this.onSyncPlayer()
        })
        lv.on(LVE.EVENT_SAVE_PLAYER, _ => {
            console.log('EVENT_SAVE_PLAYER');
            this.onSavePlayer()
        })
        lv.on(LVE.EVENT_ROLL_TEXT, data => {
            this.sendRollText(data)
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

        lv.on(LVE.EVENT_SET_ROUND_END, _ => {
            syncDoc(dbIdx, doc => {
                let rec = doc.rec[this.gameIdx]
                console.log('set round end', rec);
            }, true)
            // console.log('');
        })

        lv.on(WebDBCmd.cs_commit, data => {
            console.log('cs_commit', data);
            this.commit(data)
        })

    }

    onScore(data) {
        let lPlayerData = this.getPlayerInfo(this.lPlayer)
        let rPlayerData = this.getPlayerInfo(this.rPlayer)
        console.log('player ', lPlayerData, rPlayerData);
        this.emitScoreFoul(data)
    }
    onSavePlayer() {
        syncDoc(playerDocIdx, doc => {
            doc.teamArr = this.teamArr
        }, true)
    }

    getPlayerInfo(groupName) {
        if (this.playerMap[groupName])
            return this.playerMap[groupName]
        return {}
    }

    getPlayerRank(lPlayer, rPlayer, callback) {
        getPlayerInfoArr([lPlayer.player_id, rPlayer.player_id], res => {
            console.log('player rank', res);
            let lRanking = 0, rRanking = 0;
            for (let d of res) {
                if (d.data.player_id == lPlayer.player_id)
                    lRanking = d.data.powerRank
                if (d.data.player_id == rPlayer.player_id)
                    rRanking = d.data.powerRank
            }
            callback([lRanking, rRanking])
        })
    }

    sendRollText(data) {
        console.log('send roll text', data)
        data._ = ''
        $post(`/emit/${WebDBCmd.cs_showRollText}`, data)
    }

    commit(data?) {
        syncDoc(playerDocIdx, doc => {
            let lPlayerData = this.getPlayerInfo(this.lPlayer)
            let rPlayerData = this.getPlayerInfo(this.rPlayer)
            lPlayerData.blood = this.lScore
            rPlayerData.blood = this.rScore
            doc.teamArr = this.teamArr
            // this.teamArr
        }, true)
        syncDoc(dbIdx, doc => {
            let rec = doc['rec'][this.gameIdx]
            rec.player = [this.lPlayer, this.rPlayer]
            let lScore = this.rPlayerBloodStart - this.rScore
            let rScore = this.lPlayerBloodStart - this.lScore
            rec.score = [lScore, rScore]
            rec.blood = [this.lScore, this.rScore]


            // this.gameIdx++
            // doc.gameIdx = this.gameIdx
            // console.log('commit rec', rec);
            this.initDocToView(doc)
        }, true)
    }

    emitGameInfo(param) {
        let data: any = { _: null }
        getPlayerArrByPlayerId(this.lPlayer, this.rPlayer, (lTeamInfo, rTeamInfo) => {
            data.lPlayer = this.lPlayer
            data.rPlayer = this.rPlayer
            data.lTeamInfo = lTeamInfo
            data.rTeamInfo = rTeamInfo
            data.is3Blood = param == 3

            let lPlayerData = this.getPlayerInfo(this.lPlayer)
            let rPlayerData = this.getPlayerInfo(this.rPlayer)
            this.getPlayerRank(lPlayerData, rPlayerData, rankingArr => {
                console.log('getPlayerRank', rankingArr, lPlayerData.player_id);
                data.lRanking = rankingArr[0]
                data.rRanking = rankingArr[1]
                $post(`/emit/${WebDBCmd.cs_init}`, data)
            })
            this.emitScoreFoul(this)
            // $post(`/emit/${WebDBCmd.cs_init}`, data)
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
            this.lRealName = this.lHupuID = this.getRealName(this.lPlayer)
            this.rRealName = this.rHupuID = this.getRealName(this.rPlayer)
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