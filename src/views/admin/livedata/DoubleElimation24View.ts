import { ProcessView } from './ProcessView';
import { RewardModel } from '../../panel/bracketM4/Reward24';
import { BaseGameView, syncDoc } from "./BaseGame";
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
    liveDataView
    constructor(liveDataView: LiveDataView) {
        super()
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
            this.setVS(vsStr)
        })

        lv.on(LVE.EVENT_SHOW_PROCESS, data => {
            syncDoc(gameDate, doc => {
                data._ = ''
                let processParam = ProcessView.showTab(doc.rec, data.tab, this.nameMapHupuId)
                processParam.gameIdx = this.gameIdx
                data.processParam = processParam
                console.log('EVENT_SHOW_PROCESS', processParam);
                $post(`/emit/${WebDBCmd.cs_showGameProcess}`, data)
            })
        })

        lv.on(LVE.EVENT_SHOW_PLAYER_PROCESS, data => {
            syncDoc(gameDate, doc => {
                data._ = ''
                let processParam = ProcessView.showPlayerProcess(doc.rec,this.gameIdx, data.player, this.nameMapHupuId)
                data.processParam = processParam
                console.log('EVENT_SHOW_PLAYER_PROCESS', processParam);
                // $post(`/emit/${WebDBCmd.cs_showRollText}`, data)
            })
        })

        lv.on(LVE.EVENT_SET_GAME_INFO, gameIdx => {
            console.log(this, 'EVENT_SET_GAME_INFO', gameIdx);
            this.setGameInfo(gameIdx)
        })

        lv.on("testRandomGame", _ => {
            this.testRandomGame()
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

    setVS(vsStr) {
        let a = vsStr.split(' ')
        if (a.length == 2) {
            let p1 = a[0]
            let p2 = a[1]
            syncDoc(gameDate, doc => {
                let r = doc['rec'][this.gameIdx]
                r.player = [p1, p2]
            }, true)
        }
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
        let playerIdArr = [
            44, 7686, 1001, 1754,
            9118, 2849, 10368, 1163,
            1906, 8449, 10207, 4257,
            3715, 11470, 20, 4218,
            4, 8066, 6487, 11082,
            4752, 9097, 1900, 1213,
            1679, 574, 1176, 8903,
            7851, 2993, 5091, 361]
        getPlayerInfoArr(playerIdArr, resArr => {
            let playerDataArr = []
            for (let res of resArr) {
                playerDataArr.push(res.data)
            }
            console.log('get all player info', resArr);
            callback(playerDataArr)
        })
    }
    initPlayer(callback) {
        syncDoc(playerDoc, doc => {
            let playerOrderArr = doc.player
            console.log('player 32', playerOrderArr);
            let playerArr = []
            for (let i = 0; i < 32; i++) {
                let p = new PlayerInfo()
                p.id = i + 1
                p.hupuID = playerOrderArr[i].name
                p.name = 'p' + (i + 1)
                p['poker'] = ''
                p.data = playerOrderArr[i]
                playerArr.push(p)
                this.nameMapHupuId[p.name] = p
            }
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
            let rec = doc['rec'] = {}
            for (let i = 0; i < 62; i++) {
                rec[i + 1] = { gameIdx: i + 1, player: ['', ''], score: [0, 0], foul: [0, 0] }
            }
            doc['gameIdx'] = 1
            for (let i = 0; i < 16; i++) {
                let gameIdx = i + 1
                rec[i + 1].player = ['p' + (gameIdx * 2 - 1), 'p' + gameIdx * 2]
            }
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
                    row.lPlayer = this.getHupuId(rec.player[0])
                    row.rPlayer = this.getHupuId(rec.player[1])
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


    emitBracket(doc?) {
        let setHupuIdAndEmit = (doc) => {
            // console.log('hupu id', doc);
            let cloneDoc = JSON.parse(JSON.stringify(doc))
            for (let i = 0; i < 62; i++) {
                let r = cloneDoc.rec[i + 1]
                r.poker = r.player
                let a = [this.getHupuId(r.player[0]), this.getHupuId(r.player[1])]
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
            // this.emitVictory(doc)
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
            if (exDataCall) {
                exDataCall(data)
            }
            //test
            // data.leftPlayer.name += this.lHupuID
            // data.rightPlayer.name += this.rHupuID
            console.log('setGameInfo', data);

            if (this.delayEmitGameInfo > 0) {
                setTimeout(_ => {
                    this.delayEmitGameInfo = 0
                    $post(`/emit/${WebDBCmd.cs_init}`, data)
                }, this.delayEmitGameInfo);
            }
            else
                $post(`/emit/${WebDBCmd.cs_init}`, data)
        }

    }

    getPlayerInfo(groupName) {
        if (this.nameMapHupuId[groupName])
            return this.nameMapHupuId[groupName]
        return {}
    }

    ///////////
    testRandomGame() {
        syncDoc(gameDate, doc => {
            for (let i = 0; i < 62; i++) {
                let g = doc['rec'][i + 1]
                g.score = [1, 0]
                console.log('gameIdx', i + 1, g);
            }
            routeBracket24(doc['rec'])
            console.log('test random game');
        }, true)
    }
}