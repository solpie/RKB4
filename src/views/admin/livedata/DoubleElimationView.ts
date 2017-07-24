import { BaseGameView, syncDoc, buildPlayerData } from './BaseGame';
import LiveDataView from './livedataView';
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { routeBracket } from "../../panel/bracket20/Bracket20Route";
import { getAllPlayer } from "../../utils/HupuAPI";
import { PlayerInfo } from "./PlayerInfo";
let gameDate = 730
declare let io;
export default class DoubleEliminationView extends BaseGameView {
    //gameIdx from 1 - 39
    nameMapHupuId = {}
    gameInfoTable = []
    delayEmitGameInfo = 0
    lHupuID = ''
    rHupuID = ''
    constructor(liveDataView: LiveDataView) {
        super()
        syncDoc(gameDate, doc => {
            console.log('sync doc', doc);
            // if (!doc['rec']) {
            // this.initBracket(doc)
            this.initPlayer(_ => {
                this.initView(doc)
            })
            // }
        })
        liveDataView.on(WebDBCmd.cs_init, data => {
            console.log('DoubleElimination cs_init', data);
            syncDoc(gameDate, doc => {
                this.emitGameInfo()
                $post(`/emit/${WebDBCmd.cs_bracket20Init}`, doc)
            })
        })

        liveDataView.on(WebDBCmd.cs_score, data => {
            console.log('DoubleElimination', data);
            this.lScore = data.leftScore
            this.rScore = data.rightScore
        })

        liveDataView.on(WebDBCmd.cs_commit, data => {
            console.log(this, 'cs_commit', data);
            this.commit()
        })

        liveDataView.on(liveDataView.EVENT_SET_GAME_INFO, gameIdx => {
            console.log(this, 'EVENT_SET_GAME_INFO', gameIdx);
            this.setGameInfo(gameIdx)
        })

        liveDataView.on(liveDataView.EVENT_INIT_BRACKET, _ => {
            console.log(this, 'EVENT_INIT_BRACKET');
            syncDoc(gameDate, doc => {
                console.log('sync doc', doc);
                this.initBracket(doc)
                this.initView(doc)
            }, true)
        })
        this.initWS()
    }

    initPlayer(callback) {
        getAllPlayer(380, (res) => {
            console.log('380 all player ', res);
            // this.initGameInfo(res)
            let playerIdArr = ['郝天佶', '打铁不算多', '哈特好', '知名球童戴一志'
                , '郝天佶', '打铁不算多', '哈特好', '知名球童戴一志'
                , '泡椒top13', '打铁不算多', '习惯过了头', '阿彬BIN'
                , '平常心myd', '小丑的梦想', '认得挖方一号', 'NGFNGN'
                , '大霖哥666', 'Gyoung15', '带伤上阵也不怕', 'biglrip'
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
            console.log('player 20', playerOrderArr);
            let playerArr = []

            for (let i = 0; i < 20; i++) {
                let p = new PlayerInfo()
                p.id = i + 1
                p.hupuID = playerOrderArr[i].name
                p.name = 'p' + (i + 1)
                p.data = playerOrderArr[i]
                playerArr.push(p)
                this.nameMapHupuId[p.name] = p
            }

            callback()
        })
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
        })
    }

    initView(doc) {
        //  this.recMap = doc['recMap']
        let recMap = doc['rec']
        routeBracket(recMap)

        let gameIdx = doc.gameIdx
        this.setGameInfo(gameIdx)
        //gameInfoTable
        let rowArr: any = []
        for (let idx in recMap) {
            // console.log('idx', idx, recMap);
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
        // console.log('init GameInfo Table', rowArr, this.nameMapHupuId);

        this.gameInfoTable = rowArr
    }

    getHupuId(groupName) {
        for (let k in this.nameMapHupuId) {
            let o = this.nameMapHupuId[k]
            if (o.name == groupName)
                return o.hupuID
        }
        return ''
    }

    initWS() {
        io.connect('/rkb')
            .on('connect', () => {
                console.log('connect DoubleEliminationView initWS')
            })
            .on(`${WebDBCmd.sc_bracket20Created}`, () => {
                console.log('sc_bracketCreated');
                this.emitBracket()
            })
            .on(`${WebDBCmd.sc_panelCreated}`, () => {
                console.log('sc_panelCreated');
                // this.emitGameInfo()
            })
    }

    getPlayerInfo(groupName) {
        if (this.nameMapHupuId[groupName])
            return this.nameMapHupuId[groupName]
        return {}
    }


    emitGameInfo() {
        let data: any = { _: null }
        data.winScore = 3
        if (this.gameIdx == 37) {//决赛
            data.winScore = 5
            data.matchType = 3
        }
        else  //大师赛
            data.matchType = 2
        // else
        //     data.matchType = 1
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

    emitBracket(doc?) {
        if (doc)
            $post(`/emit/${WebDBCmd.cs_bracket20Init}`, { _: null, rec: doc.rec })
        else
            syncDoc(gameDate, doc => {
                console.log('emit bracket', doc);
                $post(`/emit/${WebDBCmd.cs_bracket20Init}`, { _: null, rec: doc.rec })
            })
    }

    commit() {
        syncDoc(gameDate, doc => {
            console.log('commit', doc, 'gameIdx:', this.gameIdx);
            let rec = doc['rec'][this.gameIdx]
            rec.score = [this.lScore, this.rScore]
            rec.foul = [this.lFoul, this.rFoul]
            rec.player = [this.lPlayer, this.rPlayer]
            this.gameIdx++
            doc.gameIdx = this.gameIdx
            this.emitVictory(doc)
            this.emitBracket(doc)
            this.initView(doc)
        }, true)
    }

    emitVictory(doc) {
        if (this.lScore != 0 || this.rScore != 0) {
            let winPlayer: PlayerInfo;
            if (this.lScore > this.rScore)
                winPlayer = this.getPlayerInfo(this.lPlayer)
            else
                winPlayer = this.getPlayerInfo(this.rPlayer)
            let sumMap = buildPlayerData(doc, true)
            let rec = sumMap[winPlayer.name]
            let data = { _: null, visible: true, winner: winPlayer.data, rec: rec }
            $post(`/emit/${WebDBCmd.cs_showVictory}`, data)
        }
    }

    initBracket(doc) {
        let rec = doc['rec'] = {}
        for (let i = 0; i < 39; i++) {
            rec[i + 1] = { gameIdx: i + 1, player: ['', ''], score: [0, 0], foul: [0, 0] }
        }
        doc['gameIdx'] = 1
        rec[1].player = ['p16', 'p17']
        rec[2].player = ['p13', 'p20']
        rec[3].player = ['p15', 'p18']
        rec[4].player = ['p14', 'p19']

        rec[5].player = ['p8', 'p9']
        rec[6].player = ['p5', 'p12']
        rec[7].player = ['p7', 'p10']
        rec[8].player = ['p6', 'p11']

        rec[9].player = ['p1', '']
        rec[10].player = ['p4', '']
        rec[11].player = ['p2', '']
        rec[12].player = ['p3', '']
    }
}