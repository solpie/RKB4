import { dumpObj } from '../../utils/JsFunc';
import { ProcessView } from './ProcessView';
import { RewardModel } from '../../panel/bracketM4/Reward24';
import { BaseGameView, syncDoc, buildPlayerData } from "./BaseGame";
import LiveDataView from "./livedataView";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { PlayerInfo } from "./PlayerInfo";
import { getAllPlayer, getPlayerInfoArr, updatePlayerDoc } from '../../utils/HupuAPI';
import { routeBracket } from "../../panel/bracket20/Bracket20Route";
import { routeBracket24 } from "../../panel/bracketM4/Bracket24Route";

declare let io;
let gameDate = '930'
let playerDoc = '930.player'


export default class DoubleElimination24View extends BaseGameView {
    nameMapHupuId = {}
    pokerMapPlayer = {}
    gameInfoTable = []
    delayEmitGameInfo = 0
    lHupuID = ''
    rHupuID = ''

    lName = ''
    rName = ''
    liveDataView


    playerIdArr = [
        8066, 15619, 614, 16767,
        6874, 3836, 2988, 20375,
        8449, 9118, 7479, 2849,
        4257, 8052, 753, 23231,
        23877, 5091, 17085, 17795,
        1176, 3073, 14124, 10207,
        1906, 7686, 8204, 1163,
        22070, 8646, 13359, 18441
    ]

    constructor(liveDataView: LiveDataView) {
        super()
        this.dbIdx = gameDate
        this.liveDataView = liveDataView
        liveDataView.on(LiveDataView.EVENT_INIT_DOUBLE_ELIMATION, _ => {
            this.init()
        })

        // EVENT_INIT_DOUBLE_ELIMATION

        this.init()
    }

    initWS() {
        io.connect('/rkb')
            .on('connect', () => {
                console.log('connect DoubleEliminationView initWS')
            })
            .on(`${WebDBCmd.sc_bracket24Created}`, () => {
                console.log('sc_bracketCreated');
                this.emitBracket()
            })
            .on(`${WebDBCmd.sc_panelCreated}`, () => {
                console.log('sc_panelCreated');
                this.emitGameInfo2()
            })
    }

    syncPlayerDoc() {
        this.getAllPlayer2(playerDataArr => {
            syncDoc(playerDoc, doc => {
                doc.player = playerDataArr
            }, true)
        })
    }
    init() {
        let lv = this.liveDataView
        let LVE = LiveDataView
        syncDoc(gameDate, doc => {
            console.log('sync doc', doc);
            // if (!doc['rec']) {
            // this.initBracket(doc)
            this.initPlayer(_ => {
                this.initView(doc)
            })
            // }
        })
        lv.on(LVE.EVENT_ROLL_TEXT, data => {
            this.sendRollText(data)
        })
        lv.on(LVE.EVENT_INIT_BRACKET, _ => {
            this.initBracket()
        })

        lv.on(LVE.EVENT_SYNC_PLAYER, _ => {
            this.syncPlayerDoc()
        })

        lv.on(LVE.EVENT_SET_VS, vsStr => {
            this.setVS(vsStr, doc => {
                this.initView(doc)
            })
        })

        lv.on(LVE.EVENT_UPDATE_SCORE, data => {
            this.emitScoreFoul(data)
        })

        lv.on(LVE.EVENT_SET_SCORE, scoreStr => {
            this.setScore(scoreStr, doc => {
                this.initView(doc)
            })
        })

        lv.on(LVE.EVENT_SHOW_PROCESS, data => {
            syncDoc(gameDate, doc => {
                data._ = ''
                let processParam = ProcessView.showTab(doc.rec, data.tab, this.nameMapHupuId, this.gameIdx)
                processParam.gameIdx = this.gameIdx
                processParam['isShowRealName'] = data.isShowRealName
                data.processParam = processParam
                console.log('EVENT_SHOW_PROCESS', processParam);
                $post(`/emit/${WebDBCmd.cs_showGameProcess}`, data)
            })
        })

        lv.on(LVE.EVENT_SHOW_FINAL4_REWARD, _ => {
            syncDoc(gameDate, doc => {
                let data: any = { _: null }
                let playerArr = RewardModel.final4Reward(doc.rec, this.nameMapHupuId, data)
                $post(`/emit/${WebDBCmd.cs_showRollText}`, data)
            })
        })

        lv.on(LVE.EVENT_SHOW_PLAYER_PROCESS, data => {
            syncDoc(gameDate, doc => {
                data._ = ''
                if (data.curGame) {
                    ProcessView.curPlayerRoute(doc, this.nameMapHupuId, this.gameIdx, (d) => {
                        d._ = ''
                        d.visible = true
                        d.playerRoute = true
                        d.isFx = data.isFx
                        console.log('emit cs_showGameProcess', d);
                        let tabData = ProcessView.showTab(doc.rec, 'auto', this.nameMapHupuId, this.gameIdx)
                        d.tabData = tabData
                        $post(`/emit/${WebDBCmd.cs_showGameProcess}`, d)
                    })
                }
                else {
                    data = ProcessView.showPlayerProcess2(data, doc, this.gameIdx, this.nameMapHupuId)
                    if (data.visible)
                        $post(`/emit/${WebDBCmd.cs_showRollText}`, data)
                }
            })
        })

        lv.on(LVE.EVENT_SET_GAME_INFO, gameIdx => {
            console.log(this, 'EVENT_SET_GAME_INFO', gameIdx);
            this.setGameInfo(gameIdx)
        })

        lv.on("testRandomGame", endGameIdx => {
            this.testRandomGame(endGameIdx)
        })

        lv.on(WebDBCmd.cs_commit, data => {
            console.log('Double Elimation 24', 'cs_commit', data);
            this.commit(data)
        })

        lv.on(WebDBCmd.cs_init, data => {
            // console.log('DoubleElimination cs_init', data);
            this.emitGameInfo2()
        })

        this.initWS()
    }

    emitGameInfo2(doc?) {
        let _ = (doc) => {
            this.emitGameInfo(data => {
                let rewardArr = RewardModel.getReward(doc.rec, this.lPlayer, this.rPlayer)
                data.lReward = rewardArr[0]
                data.rReward = rewardArr[1]
            })
        }
        if (doc)
            _(doc)
        else
            syncDoc(gameDate, doc => {
                _(doc)
            })
    }

    sendRollText(data) {
        console.log('send roll text', data)
        data._ = ''
        $post(`/emit/${WebDBCmd.cs_showRollText}`, data)
    }
    getAllPlayer2(callback) {
        getPlayerInfoArr(this.playerIdArr, resArr => {
            let playerDataArr = []
            for (let res of resArr) {
                res.data.realName = res.data.name
                res.data.name = res.data.nickname
                playerDataArr.push(res.data)
            }
            console.log('get all player info', resArr);
            callback(playerDataArr)
        })
    }
    initPlayer(callback) {
        syncDoc(playerDoc, doc => {
            let playerOrderArr = doc.player
            let playerArr = []
            for (let i = 0; i < 32; i++) {
                let p = new PlayerInfo()
                p.id = i + 1
                p.hupuID = playerOrderArr[i].name
                p.name = 'p' + (i + 1)
                p.realName = playerOrderArr[i].realName
                p.ranking = 0
                console.log('player 32', p.hupuID, p.name, playerOrderArr[i].realName);
                p.data = playerOrderArr[i]
                p.data.ranking = p.ranking
                playerArr.push(p)
                this.nameMapHupuId[p.name] = p
            }
            console.log('player 32', playerArr);

            this.initPokerSelectView(playerArr)
            callback()
        })

    }
    initPokerSelectView(playerArr) {
        this['pokerPlayerArrG1'] = playerArr
    }
    //clear data
    initBracket() {
        syncDoc(gameDate, doc => {
            let rec = doc['rec']
            // = {}
            for (let i = 0; i < 62; i++) {
                if (i < 16) {
                    rec[i + 1].score = [0, 0]
                    rec[i + 1].foul = [0, 0]
                }
                else
                    rec[i + 1] = { gameIdx: i + 1, player: ['', ''], score: [0, 0], foul: [0, 0] }
            }
            doc['gameIdx'] = 1
            // for (let i = 0; i < 16; i++) {
            //     let gameIdx = i + 1
            //     rec[i + 1].player = ['p' + (gameIdx * 2 - 1), 'p' + gameIdx * 2]
            // }
        }, true)
    }


    initView(doc) {
        //  this.recMap = doc['recMap']
        let recMap = doc['rec']
        routeBracket24(recMap)

        let gameIdx = doc.gameIdx
        this.setGameInfo(gameIdx)
        //gameInfoTable
        let rowArr: any = []
        for (let idx in recMap) {
            // console.log('idx', idx, recMap);
            if (Number(idx) < 63) {
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
        }
        // console.log('init GameInfo Table', rowArr, this.nameMapHupuId);

        this.gameInfoTable = rowArr
    }

    setGameInfo(gameIdx) {
        syncDoc(gameDate, doc => {
            let rec = doc['rec'][gameIdx]
            this.gameIdx = gameIdx
            this.lPlayer = rec.player[0]
            this.rPlayer = rec.player[1]
            this.lScore = Number(rec.score[0]) || 0
            this.rScore = Number(rec.score[1]) || 0
            this.lFoul = Number(rec.foul[0]) || 0
            this.rFoul = Number(rec.foul[1]) || 0
            this.lHupuID = this.getHupuId(this.lPlayer)
            this.rHupuID = this.getHupuId(this.rPlayer)
        })
    }

    getHupuId(groupName) {
        for (let k in this.nameMapHupuId) {
            let o = this.nameMapHupuId[k]
            if (o.name == groupName)
                return o.hupuID
        }
        return ''
    }
    getRealName(groupName) {
        for (let k in this.nameMapHupuId) {
            let o = this.nameMapHupuId[k]
            if (o.name == groupName)
                return o.realName
        }
        return ''
    }


    emitBracket(doc?) {
        let setHupuIdAndEmit = (doc) => {
            // console.log('hupu id', doc);
            let cloneDoc = JSON.parse(JSON.stringify(doc))
            for (let i = 0; i < 62; i++) {
                let r = cloneDoc.rec[i + 1]
                r.poker = r.player
                let a = [this.getRealName(r.player[0]), this.getRealName(r.player[1])]
                r.player = a
            }
            $post(`/emit/${WebDBCmd.cs_bracket24Init}`, { _: null, rec: cloneDoc.rec })
        }
        if (doc)
            setHupuIdAndEmit(doc)
        else
            syncDoc(gameDate, doc => {
                setHupuIdAndEmit(doc)
            })
    }


    commit(data?) {
        syncDoc(gameDate, doc => {
            console.log('commit', doc, 'gameIdx:', this.gameIdx, data.hasNext);

            let rec = doc['rec'][this.gameIdx]
            rec.score = [this.lScore, this.rScore]
            rec.foul = [this.lFoul, this.rFoul]
            rec.player = [this.lPlayer, this.rPlayer]
            this.gameIdx++
            doc.gameIdx = this.gameIdx

            let rewardArr = RewardModel.getReward(doc.rec, this.lPlayer, this.rPlayer, true)
            let lReward = { rewardArr: rewardArr[0], reward: 0 }
            let rReward = { rewardArr: rewardArr[1], reward: 0 }

            this.emitVictory(doc, this.gameIdx - 1, lReward, rReward)
            this.emitBracket(doc)
            if (data.isEnd)
                return
            this.initView(doc)
            // if (this.gameIdx < 13)
            //     this.delayEmitGameInfo = 5000
            // else
            this.delayEmitGameInfo = 500

            setTimeout(_ => {
                console.log('delay show player info');
                this.emitGameInfo2(doc)
                this.emitBracket()
                this.setGameInfo(this.gameIdx)
                // if (this.gameIdx < 13)
                //     this.showGamePlayerInfo(true)
            }, this.delayEmitGameInfo)
        }, true)
    }

    dumpReward() {
        syncDoc(gameDate, doc => {
            for (let i = 0; i < 16; i++) {
                let pg1 = 'p' + (i * 2 + 1)
                let pg2 = 'p' + (i * 2 + 2)
                let p1 = this.getHupuId(pg1)
                let p2 = this.getHupuId(pg2)
                let r = RewardModel.getReward(doc.rec, pg1, pg2, true)
                console.log(p1, p2, r);
            }
        })
    }

    emitVictory(doc, lastGameIdx, l, r) {
        if (this.lScore != 0 || this.rScore != 0) {
            let winPlayer: PlayerInfo;
            let losePlayer: PlayerInfo;
            let reward;
            let isLeft = this.lScore > this.rScore
            if (isLeft) {
                reward = l
                winPlayer = this.getPlayerInfo(this.lPlayer)
                losePlayer = this.getPlayerInfo(this.rPlayer)
            }
            else {
                reward = r
                winPlayer = this.getPlayerInfo(this.rPlayer)
                losePlayer = this.getPlayerInfo(this.lPlayer)

            }
            let sumMap = buildPlayerData(doc, true)
            let rec = sumMap[winPlayer.name]
            rec.score = [this.lScore, this.rScore]
            let isGk = (winPlayer.ranking > losePlayer.ranking) || winPlayer.ranking == -1
            console.log('win player ranking', winPlayer.ranking);
            let loseRec = sumMap[winPlayer.name]
            let data = {
                _: null, visible: true, winner: winPlayer.data,
                isGk: isGk,
                rec: rec, gameIdx: lastGameIdx, reward: reward, isLeft: isLeft
            }
            $post(`/emit/${WebDBCmd.cs_showVictory}`, data)
        }
    }

    emitGameInfo(exDataCall?) {
        let data: any = { _: null }
        data.winScore = 3

        if (this.gameIdx == 62) {//决赛
            data.winScore = 5
            data.matchType = 3
        }
        else  //大师赛
            data.matchType = 2
        // else
        //     data.matchType = 1
        if (this.gameIdx < 63) {
            data.gameIdx = this.gameIdx
            let lPlayer = this.getPlayerInfo(this.lPlayer)
            let rPlayer = this.getPlayerInfo(this.rPlayer)

            let lPlayerData = lPlayer.data
            let rPlayerData = rPlayer.data
            // lPlayerData.rankingData = { ranking: 12, color: 0xffff00 }
            // rPlayerData.rankingData = { ranking: 12, color: 0xffff00 }
            data.leftScore = this.lScore
            data.rightScore = this.rScore
            data.leftFoul = this.lFoul
            data.rightFoul = this.rFoul
            data.leftPlayer = lPlayerData
            data.rightPlayer = rPlayerData
            if (exDataCall) {
                exDataCall(data)
            }
            //test
            console.log('setGameInfo', data);


            this.getPlayerRank(lPlayerData, rPlayerData, rankingArr => {
                console.log('getPlayerRank', rankingArr);
                lPlayer.ranking = lPlayerData.ranking = rankingArr[0]
                rPlayer.ranking = rPlayerData.ranking = rankingArr[1]
                if (this.delayEmitGameInfo > 0) {
                    setTimeout(_ => {
                        this.delayEmitGameInfo = 0
                        $post(`/emit/${WebDBCmd.cs_init}`, data)
                    }, this.delayEmitGameInfo);
                }
                else
                    $post(`/emit/${WebDBCmd.cs_init}`, data)
            })
        }

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

    getPlayerInfo(groupName) {
        if (this.nameMapHupuId[groupName])
            return this.nameMapHupuId[groupName]
        return {}
    }

    ///////////
    testRandomGame(endGameIdx) {
        syncDoc(gameDate, doc => {
            for (let i = 0; i < endGameIdx; i++) {
                let g = doc['rec'][i + 1]
                g.score = [1, 0]
                console.log('gameIdx', i + 1, g);
            }
            routeBracket24(doc['rec'])
            console.log('test random game');
        }, true)
    }
}