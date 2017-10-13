import { BaseGameView, syncDoc, buildPlayerData } from "./BaseGame";
import LiveDataView from "./livedataView";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { PlayerInfo } from "./PlayerInfo";
import { paddy } from "../../utils/JsFunc";

let LVE = LiveDataView
let dbIdx;
export default class CommonView extends BaseGameView {
    isLoadedCfg = false
    playerMap = {}
    gameInfoTable = []
    lHupuID = ''
    rHupuID = ''
    gameTitle = null//'车轮战'
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
            console.log('commonview cs_init', data, this['inputRollText']);
            this.emitGameInfo()
        })
        lv.on(WebDBCmd.cs_commit, data => {
            console.log('commonview', 'cs_commit', data);
            this.commit()
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
            console.log('EVENT_SET_SCORE', scoreStr);
            this.setScore(scoreStr, doc => {
                console.log('set score:', doc);
                this.initView(doc)
            })
        })

        lv.on(LVE.EVENT_NEW_GAME, vsStr => {
            this.newGame(vsStr)
        })

        lv.on(LVE.EVENT_INIT_BRACKET, _ => {
            this.clearBracket()
        })
        lv.on(LVE.EVENT_SET_GAME_INFO, gameIdx => {
            this.setGameInfo(gameIdx)
        })
    }

    clearBracket() {
        syncDoc(dbIdx, doc => {
            if (doc.rec)
                for (let r in doc.rec) {
                    let game = doc.rec[r]
                    game.score = [0, 0]
                    game.foul = [0, 0]
                }
            this.initView(doc)
        }, true)
    }

    setGameInfo(gameIdx) {
        syncDoc(dbIdx, doc => {
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

    emitGameInfo(doc?) {
        let _ = (doc) => {


            let data: any = { _: null }

            let gameIdxStr = paddy(this.gameIdx, 2)
            if (this['inputRollText'] == '8') {
                data.winScore = 3
                this.gameTitle = '淘汰赛'
            }
            else if (this['inputRollText'] == 'f') {
                data.winScore = 5
                this.gameTitle = '决赛'
            }
            else {
                data.winScore = 2
                this.gameTitle = '车轮战' + gameIdxStr
            }

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
            data.gameTitle = this.gameTitle
            $post(`/emit/${WebDBCmd.cs_init}`, data)
        }
        if (doc)
            _(doc)
        else
            syncDoc(dbIdx, doc => {
                _(doc)
            })
    }

    getPlayerInfo(playerId) {
        return this.playerMap[playerId]
    }

    loadGameCfg(data) {
        // let a2=a.split("\n");let pArr = [];for(let p of a2){let a3 = p.split("\t");pArr.push({playerId:'p'+a3[0],name:a3[1],height:a3[2],weight:a3[3]})}
        this.isLoadedCfg = true
        let gameCfg = JSON.parse(data)
        console.log('game title:', gameCfg.gameTitle);
        dbIdx = gameCfg.dbIdx;
        this.dbIdx = dbIdx

        let playerArr = gameCfg.playerArr
        for (let p of gameCfg.playerArr) {
            this.playerMap[p.playerId] = p
            // p.avatar = 'http://w1.hoopchina.com.cn/huputv/resource/img/amateur.jpg'
            p.avatar = gameCfg.avatarUrlBase + p.playerId + '.png'
            let data = JSON.parse(JSON.stringify(p))
            p.data = data
        }
        console.log('player count:', playerArr.length);
        //setGameInfo
        syncDoc(dbIdx, doc => {
            let game = doc.rec[doc.gameIdx]
            this.gameIdx = doc.gameIdx
            this.setPlayer(game.player[0], game.player[1])

            this.initView(doc)
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
            }, true)
        }
    }

    commit() {
        syncDoc(dbIdx, doc => {
            console.log('commit', doc, 'gameIdx:', this.gameIdx);
            let rec = doc['rec'][this.gameIdx]
            rec.score = [this.lScore, this.rScore]
            rec.foul = [this.lFoul, this.rFoul]
            rec.player = [this.lPlayer, this.rPlayer]
            this.emitVictory(doc)
            this.initView(doc)
        }, true)
    }
    buildGameData(doc) {
        let playedMap = {}
        for (let idx in doc.rec) {
            let game = doc.rec[idx]
            playedMap[game.player[0]] = true
            playedMap[game.player[1]] = true
        }
    }
    emitVictory(doc) {
        if (this.lScore != 0 || this.rScore != 0) {
            let winPlayer: PlayerInfo;
            let reward;
            let isLeft = this.lScore > this.rScore
            if (isLeft) {
                // reward = l
                winPlayer = this.getPlayerInfo(this.lPlayer)
            }
            else {
                // reward = r
                winPlayer = this.getPlayerInfo(this.rPlayer)
            }
            let sumMap = buildPlayerData(doc, true)
            let rec = sumMap[winPlayer.playerId]
            let data = {
                _: null, visible: true, winner: winPlayer.data,
                gameType: '车轮战',
                rec: rec, gameIdx: this.gameIdx, reward: reward, isLeft: isLeft
            }
            $post(`/emit/${WebDBCmd.cs_showVictory}`, data)
        }
    }

    getHupuId(playerId) {
        for (let k in this.playerMap) {
            let o = this.playerMap[k]
            if (o.playerId == playerId)
                return o.name
        }
        return ''
    }

    initGame() {
        syncDoc(dbIdx, doc => {
            doc.rec = {}
            doc.gameIdx = 0
        }, true)
    }
    initView(doc) {
        let recMap = doc.rec
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
        this.gameInfoTable = rowArr
    }
}