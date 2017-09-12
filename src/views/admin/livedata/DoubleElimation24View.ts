import { RewardModel } from '../../panel/bracketM4/Reward24';
import { BaseGameView, syncDoc } from "./BaseGame";
import LiveDataView from "./livedataView";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { PlayerInfo } from "./PlayerInfo";
import { getAllPlayer } from "../../utils/HupuAPI";
import { routeBracket } from "../../panel/bracket20/Bracket20Route";
import { routeBracket24 } from "../../panel/bracketM4/Bracket24Route";

declare let io;
let gameDate = '930'
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
                this.emitGameInfo()
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

        lv.on(LVE.EVENT_SHOW_PROGRESS, _ => {
            let data = { _: null }
            $post(`/emit/${WebDBCmd.cs_showGameProcess}`, data)
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
            syncDoc(gameDate, doc => {
                let rData = routeBracket24(doc.rec)
                let rewardPlayerMap = RewardModel.calcReward(doc.rec, rData.winLoseMap)
                console.log('rewardPlayerMap', rData, rewardPlayerMap, doc.rec);
                this.emitGameInfo()
                $post(`/emit/${WebDBCmd.cs_bracket24Init}`, doc)
            })
        })

        this.initWS()
    }

    sendRollText(data) {
        console.log('send roll text', data)
        data._ = ''
        $post(`/emit/${WebDBCmd.cs_showRollText}`, data)
    }

    initPlayer(callback) {
        getAllPlayer(421, (res) => {
            // res = JSON.parse(res)
            console.log('421 all player ', res);
            // this.initGameInfo(res)
            let playerIdArr = [
                '习惯过了头', '安云鹏别让我瞧不起你', '平常心myd', 'Li_DD'
                , '打铁不算多', '新锐宋教练', 'Gyoung15', '小丑的梦想'
                , '7号唐日辉同学', '雷雷雷雷子', 'NGFNGN', '知名球童戴一志'
                , '刘宇9号', '泡椒top13', '万宅男', '大霖哥666'
                , '带伤上阵也不怕', '认得挖方一号', '鬼手林坤8023', 'zzz勇'
                , '带伤上阵也不怕', '认得挖方一号', '鬼手林坤8023', 'zzz勇'
                , '带伤上阵也不怕', '认得挖方一号', '鬼手林坤8023', 'zzz勇'
                , '带伤上阵也不怕', '认得挖方一号', '鬼手林坤8023', 'zzz勇'
            ]
            let playerOrderArr = []
            // console.log('initGameInfo ', res);
            let getData = (name) => {
                for (let p of res.data) {
                    if (p.name == name)
                    { return p }
                }
            }

            for (let p of playerIdArr) {
                playerOrderArr.push(getData(p))
            }
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
            // this.initPokerSelectView(playerArr)
            callback()
        })
        // let playerIdArr = []
        // let playerArr = []
        // for (let i = 0; i < 32; i++) {

        // }
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
            this.delayEmitGameInfo = 2000

            setTimeout(_ => {
                console.log('delay show player info');
                this.emitGameInfo()
                this.emitBracket()
                this.setGameInfo(this.gameIdx)
                // if (this.gameIdx < 13)
                //     this.showGamePlayerInfo(true)
            }, this.delayEmitGameInfo)
        }, true)
    }

    emitGameInfo(insertPlayerInfoCall?) {
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
            if (insertPlayerInfoCall) {
                insertPlayerInfoCall(data)
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