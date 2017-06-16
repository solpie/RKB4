import { $get, $post } from '../../utils/WebJsFunc';
import { GameInfo } from "./GameInfo";
import { getAllPlayer, getGameInfo } from '../../utils/HupuAPI';
import { PlayerInfo } from "./PlayerInfo";
import { MatchType } from "../../panel/score/Com2017";
import { WebDBCmd } from "../../panel/webDBCmd";
import { BaseGameView, getDoc, IBaseGameView, saveDoc } from './BaseGame';

let gameInfo: GameInfo


export class GameMonthView extends BaseGameView implements IBaseGameView {
    playerArr: Array<PlayerInfo>
    nameMapHupuId: any = {}
    gameInfo: any
    recMap: any
    //for front
    gameInfoTable: Array<any> = []
    lHupuID: string = ''
    rHupuID: string = ''
    constructor() {
        super()

    }

    initGameMonth(gameId) {
        getAllPlayer(gameId, (res, data) => {
            console.log('all player ', gameId, res);
            this.initGameInfo(res)
        })
    }

    initDoc(doc) {
        this.recMap = doc['recMap']
        let gameIdx = doc.gameIdx
        this.setGameInfo(gameIdx)
        //gameInfoTable
        let rowArr: any = []
        for (let idx in this.recMap) {
            let rec = this.recMap[idx]
            let row = { idx: 0, gameIdx: 0, vs: '', score: '', rPlayer: '', lPlayer: '' }
            row.gameIdx = Number(idx)
            row.idx = row.gameIdx + 1
            if (row.idx > 24) {
                row.idx -= 24
            }
            row.vs = `[${rec.player[0]} : ${rec.player[1]}]`
            row.lPlayer = this.getHupuId(rec.player[0])
            row.rPlayer = this.getHupuId(rec.player[1])
            row.score = rec.score[0] + " : " + rec.score[1]
            console.log('row', row);
            rowArr.push(row)
        }
        console.log('init GameInfo Table', rowArr, this.nameMapHupuId);
        this.gameInfoTable = rowArr
    }
    getHupuId(groupName) {
        for (let k in this.nameMapHupuId) {
            let o = this.nameMapHupuId[k]
            if (o.name == groupName)
                return o.hupuID
        }
        // if (this.nameMapHupuId[groupName])
        //     return this.nameMapHupuId[groupName].hupuID.substr(0, 6)
        return ''
    }

    initGameInfo(res) {
        let playerIdArr = ['郝天佶', 'Beans吴', 'NGFNGN', 'zzz勇'
            , 'tracyld11', '雷雷雷雷子', '带伤上阵也不怕', 'lgy1993131'
            , '平常心myd', '大霖哥666', '蔡炜少年', 'AL张雅龙'
            , '新锐宋教练', '邓丹阿丹', '认得挖方一号', '习惯过了头'
        ]
        let playerOrderArr = []
        let getData = (name) => {
            for (let p of res.data) {
                if (p.name == name)
                { return p }
            }
        }

        for (let p of playerIdArr) {
            playerOrderArr.push(getData(p))
        }
        let createGameInfo = (playerOrderArr) => {
            //加赛 手动排名
            // let gmi = new GameInfo()
            let playerArr = []
            let mapN = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' }

            for (let i = 0; i < 16; i++) {
                let p = new PlayerInfo()
                p.id = i + 1
                p.hupuID = playerOrderArr[i].name
                p.name = mapN[Math.floor(i / 4)] + ((i % 4) + 1)
                p.data = playerOrderArr[i]
                playerArr.push(p)
                this.nameMapHupuId[p.name] = p
            }
            console.log(playerArr);
            this.playerArr = playerArr
        }
        getDoc((doc) => {
            if (doc) {
                console.log('getHupuPlayer', doc, res, playerOrderArr)
                createGameInfo(playerOrderArr)
                this.initDoc(doc)
                // console.log(gameInfo.gameArr);
                // if (!doc['recMap']) {
                // doc['recMap'] = {}
                // let gameArr = gameInfo.getGameArr()
                // for (let i = 0; i < 38; i++) {
                //     let r = new RecData()
                //     let gp =gameArr[i]
                //     if (gp)
                //         r.player = [gp[0].name, gp[1].name]
                //     r.gameIdx = i
                //     doc['recMap'][i] = JSON.parse(JSON.stringify(r))
                // }
                // saveDoc(doc)
                // }
                // Vue.set('recMap', doc['recMap'])
                // gameInfo.recMap = doc['recMap']
                // gameInfo.start(doc.gameIdx)
                // this.gameInfo = gameInfo

                if (!doc['gameIdx']) {
                    doc['gameIdx'] = 0
                    saveDoc(doc)
                }
                this.emitBracket()
            }
        })
    }

    setGameInfo(idx) {
        let data: any = { _: null }
        let gameData = this.recMap[idx]
        this.gameIdx = Number(idx)
        data.winScore = 3
        if (this.gameIdx == 37) {//决赛
            data.winScore = 5
            data.matchType = 3
        }
        else if (this.gameIdx > 23) {//大师赛
            data.matchType = 2
        }
        else {
            data.matchType = 1
        }
        data.gameIdx = this.gameIdx + 1
        this.lPlayer = gameData.player[0]
        this.rPlayer = gameData.player[1]
        this.lHupuID = this.getHupuId(this.lPlayer)
        this.rHupuID = this.getHupuId(this.rPlayer)
        this.lScore = Number(gameData.score[0])
        this.rScore = Number(gameData.score[1])
        this.lFoul = Number(gameData.foul[0])
        this.rFoul = Number(gameData.foul[1])
        console.log('setGameInfo', data);
        $post(`/emit/${WebDBCmd.cs_init}`, data)
    }

    emitBracket() {

    }

    lastWinner: any

    commit() {
        getDoc(doc => {
            let gameData = doc.recMap[this.gameIdx]
            gameData.score = [this.lScore,this.rScore]
            gameData.player =[this.lPlayer,this.rPlayer]
            gameData.time = this.time
            gameData.gameIdx = this.gameIdx
            doc.gameIdx = this.gameIdx+1
            this.initDoc(doc)
            saveDoc(doc)
        })
    }
}