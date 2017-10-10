import { BaseGameView, syncDoc, buildPlayerData } from "./BaseGame";
import LiveDataView from "./livedataView";
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { PlayerInfo } from "./PlayerInfo";

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
        lv.on(WebDBCmd.cs_commit, data => {
            console.log('commonview', 'cs_commit', data);
            this.commit()
        })
        lv.on(LVE.EVENT_SET_VS, vsStr => {
            this.newGame(vsStr)
        })
    }



    emitGameInfo(doc?) {
        let _ = (doc) => {
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
        let playerArr = gameCfg.playerArr
        for (let p of gameCfg.playerArr) {
            this.playerMap[p.playerId] = p
            p.avatar = 'http://i3.hoopchina.com.cn/user/106/18978106/18978106-1479305581.jpg@194h_194w_2e'
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
        }, true)
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