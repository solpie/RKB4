import { BaseGameView, syncDoc } from '../livedata/BaseGame';
import LiveDataView from "../livedata/livedataView";
import { syncPlayerData, getPlayerArrByPlayerId, kdaBuilder, getTeamInfo } from './Final2TeamConst';
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { getPlayerInfoArr } from '../../utils/HupuAPI';
import { getGameProcess } from './Final2Process';

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
    lBlood = 2
    rBlood = 2
    lTimeOut = 0
    rTimeOut = 0
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
                    console.log(p.pid, p.name, p.avatar);
                }
            }
            this.teamArr = doc.teamArr


            console.log('init player data', doc, this.playerMap);

            syncDoc(dbIdx, doc => {
                console.log('game db', doc);
                this.initDocToView(doc)
            })
        })

        lv.on(LVE.EVENT_ON_FILE, data => {
            // console.log('game process', data);
            syncDoc(playerDocIdx, doc => {
                getGameProcess(doc, JSON.parse(data))
            })

        })
        lv.on(WebDBCmd.cs_init, data => {
            // console.log('DoubleElimination cs_init', data);
            this.emitGameInfo(data)
        })
        lv.on(WebDBCmd.cs_showVictory, data => {
            console.log('WebDBCmd.cs_showVictory', data);
            this.emitVictory(data)
        })

        lv.on(LVE.EVENT_UPDATE_SCORE, data => {
            this.onEmitScore(data)
        })

        lv.on(LVE.EVENT_UPDATE_TIME_OUT, _ => {
            this.onTimeOut()
        })

        lv.on(LVE.EVENT_SET_3V3, vsStr => {
            this.on3v3(vsStr)
        })

        lv.on(LVE.EVENT_SET_BLOOD, bloodStr => {
            this.onSetBlood(bloodStr)
        })
        lv.on(LVE.EVENT_SET_VS, vsStr => {
            let a = vsStr.split(' ')
            if (a.length == 2) {
                vsStr = 'p' + a[0] + ' p' + a[1]
                this.setVS(vsStr, (doc, game) => {
                    let lPlayerData = this.getPlayerInfo(this.lPlayer)
                    let rPlayerData = this.getPlayerInfo(this.rPlayer)
                    game.blood = [lPlayerData.blood, rPlayerData.blood]
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
            this.emitVictory({})
        })

        lv.on(WebDBCmd.cs_commit, data => {
            console.log('cs_commit', data);
            this.commit(data)
        })

    }

    on3v3(vsStr) {
        let a = vsStr.split(' ')
        if (a.length == 2) {
            let lTeamInfo = getTeamInfo(a[0])
            let rTeamInfo = getTeamInfo(a[1])
            let data: any = { _: null }
            data.lTeamInfo = lTeamInfo
            data.rTeamInfo = rTeamInfo
            $post(`/emit/${WebDBCmd.cs_3v3Init}`, data)
        }
    }

    onTimeOut() {
        let data: any = { _: '', lTimeOut: this.lTimeOut, rTimeOut: this.rTimeOut }
        $post(`/emit/${WebDBCmd.cs_timeOut}`, data)
    }

    onEmitScore(data?) {
        if (!data)
            data = {}
        this.emitScoreFoul(data, emitData => {
            emitData.leftBlood = this.lBlood - this.rScore
            emitData.rightBlood = this.rBlood - this.lScore
            console.log('lB', this.lBlood, 'lS', this.lScore);
        })
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
        syncDoc(dbIdx, doc => {
            let rec = doc['rec'][this.gameIdx]
            rec.player = [this.lPlayer, this.rPlayer]
            // let lScore = this.rPlayerBloodStart - this.rScore
            // let rScore = this.lPlayerBloodStart - this.lScore
            rec.score = [this.lScore, this.rScore]
            // rec.bonus = [thi]
            doc.gameIdx = this.gameIdx
            syncDoc(playerDocIdx, pdoc => {
                let lPlayerData = this.getPlayerInfo(this.lPlayer)
                let rPlayerData = this.getPlayerInfo(this.rPlayer)
                lPlayerData.blood = this.lBlood - this.rScore
                rPlayerData.blood = this.rBlood - this.lScore
                pdoc.teamArr = this.teamArr

                this.lScore = this.rScore = 0
                this.initDocToView(doc)
            }, true)
        }, true)
    }

    emitVictory(data) {
        getPlayerArrByPlayerId(this.lPlayer, this.rPlayer, (lTeamInfo, rTeamInfo) => {
            // data.lPlayer = this.lPlayer
            // data.rPlayer = this.rPlayer
            data.lTeamInfo = lTeamInfo
            data.rTeamInfo = rTeamInfo
            syncDoc(dbIdx, doc => {
                let ret = kdaBuilder(doc, this.gameIdx)
                data.kdaMap = ret.kda
                data.lTeamScore = ret.lTeamScore
                data.rTeamScore = ret.rTeamScore
                data.winTeamInfo = ret.winTeamInfo
                $post(`/emit/${WebDBCmd.cs_showVictory}`, data)
            })
        })

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
                this.onEmitScore()
            })

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
            let lPlayerData = this.getPlayerInfo(this.lPlayer)
            let rPlayerData = this.getPlayerInfo(this.rPlayer)

            syncDoc(dbIdx, doc => {
                if (!doc.rec)
                    doc.rec = {}
                doc.gameIdx = this.gameIdx
                let r: any = doc['rec'][this.gameIdx] = {
                    player: [p1, p2],
                    score: [0, 0],
                    blood: [Number(lPlayerData.blood), Number(rPlayerData.blood)],
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
                    row.lPlayer = this.getRealName(rec.player[0]) + '#' + rec.blood[0]
                    row.rPlayer = this.getRealName(rec.player[1]) + '#' + rec.blood[1]
                    row.score = rec.score[0] + " : " + rec.score[1]
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
            this.lScore = Number(rec.score[0]) || 0
            this.rScore = Number(rec.score[1]) || 0
            this.lBlood = Number(rec.blood[0]) || 0
            this.rBlood = Number(rec.blood[1]) || 0
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

    onSetBlood(bloodStr) {
        let a = bloodStr.split(' ')
        if (a.length == 2) {
            syncDoc(dbIdx, doc => {
                let rec = doc.rec[this.gameIdx]
                rec.blood = [Number(a[0]), Number(a[1])]
                this.initDocToView(doc)
            }, true)
        }
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
            if (!doc.rec)
                doc.rec = {}
            else
                for (let gameIdx in doc.rec) {
                    let r = doc.rec[gameIdx]
                    r.blood = [2, 2]
                    r.score = [0, 0]
                    r.bonus = [0, 0]
                }
            doc.gameIdx = 1
            this.initDocToView(doc)
        }, true)
    }
}