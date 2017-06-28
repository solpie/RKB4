import { $get, $post } from '../../utils/WebJsFunc';
import { getAllPlayer, getGameInfo } from '../../utils/HupuAPI';
import { PlayerInfo } from "./PlayerInfo";
import { MatchType } from '../../panel/score/Com2017';
import { WebDBCmd } from '../../panel/webDBCmd';
import { mapToArr } from '../../utils/JsFunc';
import { TweenEx } from '../../utils/TweenEx';
import { BaseGameView, getDoc, IBaseGameView, RecData, saveDoc } from './BaseGame';
import { firstBy } from './thenBy';

declare let io;
export class GameMonthView extends BaseGameView implements IBaseGameView {
    playerArr: Array<PlayerInfo>
    nameMapHupuId: any = {}
    // gameInfo: any
    recMap: any
    //for front
    gameInfoTable: Array<any> = []
    curGroupRank: Array<any> = []
    lHupuID: string = ''
    rHupuID: string = ''
    constructor() {
        super()
        this.initWS()
    }

    initGameMonth(gameId) {
        getAllPlayer(gameId, (res, data) => {
            console.log('all player ', gameId, res);
            this.initGameInfo(res)
        })
    }

    initWS() {
        io.connect('/rkb')
            .on('connect', () => {
                console.log('connect GameMonthView initWS')
            })
            .on(`${WebDBCmd.sc_bracketCreated}`, () => {
                console.log('sc_bracketCreated');
                this.emitBracket()
            })
            .on(`${WebDBCmd.sc_panelCreated}`, () => {
                console.log('sc_panelCreated');
                this.emitGameInfo()
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
        return ''
    }

    initGameInfo(res) {
        let playerIdArr = ['郝天佶', 'Beans吴', 'NGFNGN', 'zzz勇'
            , 'tracyld11', '雷雷雷雷子', '带伤上阵也不怕', 'lgy1993131'
            , '平常心myd', '大霖哥666', '蔡炜少年', 'AL张雅龙'
            , '新锐宋教练', '邓丹阿丹', '认得挖方一号', '习惯过了头'
        ]
        playerIdArr = ['郝天佶', '王培钊', '哈特好', '知名球童戴一志'
            , '泡椒top13', '打铁不算多', '习惯过了头', '阿彬BIN'
            , '平常心myd', '小丑的梦想', '认得挖方一号', 'NGFNGN'
            , '大霖哥666', 'Gyoung15', '带伤上阵也不怕', 'biglrip'
        ]
        let playerOrderArr = []
        console.log('initGameInfo ', res);
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

    setGameInfo(idx, isEmit = true) {
        let gameData = this.recMap[idx]
        this.gameIdx = Number(idx)
        this.lPlayer = gameData.player[0]
        this.rPlayer = gameData.player[1]
        this.lHupuID = this.getHupuId(this.lPlayer)
        this.rHupuID = this.getHupuId(this.rPlayer)
        this.lScore = Number(gameData.score[0])
        this.rScore = Number(gameData.score[1])
        this.lFoul = Number(gameData.foul[0])
        this.rFoul = Number(gameData.foul[1])
        if (isEmit)
            this.emitGameInfo()
    }

    delayEmitGameInfo: number = 0
    emitGameInfo() {
        let data: any = { _: null }
        data.winScore = 3
        if (this.gameIdx == 37) {//决赛
            data.winScore = 5
            data.matchType = 3
        }
        else if (this.gameIdx > 23) //大师赛
            data.matchType = 2
        else
            data.matchType = 1
        data.gameIdx = this.gameIdx + 1
        let lPlayerData = this.getPlayerInfo(this.lPlayer).data
        let rPlayerData = this.getPlayerInfo(this.rPlayer).data
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
    routeBracket() {
        let masterIdx = 23
        let route = (from, toWin, toLose) => {
            from += masterIdx
            toWin += masterIdx
            toLose += masterIdx
            let rFrom = this.recMap[from]
            let rWin = this.recMap[toWin]
            let rLose = this.recMap[toLose]
            if (rFrom.score[0] == 0 && rFrom.score[1] == 0)
                return
            if (rFrom.score[0] > rFrom.score[1]) {
                rWin.player.push(rFrom.player[0])
                if (rLose)
                    rLose.player.push(rFrom.player[1])
            }
            else {
                rWin.player.push(rFrom.player[1])
                if (rLose)
                    rLose.player.push(rFrom.player[0])
            }
        }
        for (let i = 5; i < 15; i++) {
            this.recMap[i + masterIdx].player = []
        }
        route(1, 7, 5)
        route(2, 7, 5)
        route(3, 8, 6)
        route(4, 8, 6)
        route(5, 10, 99)
        route(6, 9, 99)
        route(7, 11, 9)
        route(8, 11, 10)
        route(9, 12, 99)
        route(10, 12, 99)
        route(11, 14, 13)
        route(12, 13, 99)
        route(13, 14, 99)
    }
    emitBracket() {
        this.routeBracket()
        let data: any = { _: null }
        for (let i = 24; i < 38; i++) {
            let r = this.recMap[i]
            data[i - 23] = {
                left: {
                    score: r.score[0],
                    name: this.getHupuId(r.player[0])
                },
                right: {
                    score: r.score[1],
                    name: this.getHupuId(r.player[1])
                }
            }
        }
        console.log('emitBracket', data);
        $post(`/emit/${WebDBCmd.cs_bracketInit}`, data)
    }

    lastWinner: any

    commit() {
        getDoc(doc => {
            let gameData = doc.recMap[this.gameIdx]
            gameData.score = [this.lScore, this.rScore]
            gameData.player = [this.lPlayer, this.rPlayer]
            gameData.time = this.time
            gameData.gameIdx = this.gameIdx
            doc.gameIdx = this.gameIdx + 1
            this.emitVictory(doc)
            // if (this.gameIdx < 24)
            this.delayEmitGameInfo = 5000
            // else
            // this.delayEmitGameInfo = 1   
            this.initDoc(doc)

            setTimeout(_ => {
                console.log('delay show player info');
                this.emitBracket()
                this.setGameInfo(this.gameIdx, true)
                if (this.gameIdx < 24)
                    this.showGamePlayerInfo(true)
            }, this.delayEmitGameInfo)
            saveDoc(doc)
        })
    }

    emitVictory(doc) {
        if (this.lScore != 0 || this.rScore != 0) {
            let winPlayer: PlayerInfo;
            if (this.lScore > this.rScore)
                winPlayer = this.getPlayerInfo(this.lPlayer)
            else
                winPlayer = this.getPlayerInfo(this.rPlayer)
            let sumMap = this.buildPlayerData(doc,true)
            let rec = sumMap[winPlayer.name]
            let data = { _: null, visible: true, winner: winPlayer.data, rec: rec }
            $post(`/emit/${WebDBCmd.cs_showVictory}`, data)
        }
    }

    getPlayerInfo(groupName) {
        if (this.nameMapHupuId[groupName])
            return this.nameMapHupuId[groupName]
        return {}
    }

    showGroup(group) {
        getDoc(doc => {
            let data: any = this.getGroup(doc, group)
            data.visible = true
            $post(`/emit/${WebDBCmd.cs_showGroupRank}`, data)
            this.curGroupRank = data.playerArr
        })
    }

    hideGroup() {
        let data = { _: null, visible: false }
        $post(`/emit/${WebDBCmd.cs_showGroupRank}`, data)
    }

    getGroup(doc, group) {
        let sumMap = this.buildPlayerData(doc)
        let playerArr = []
        for (let i = 0; i < 4; i++) {
            let data = sumMap[group + (i + 1)]
            let p: PlayerInfo = this.getPlayerInfo(data.name)
            data.name = p.hupuID
            data.groupId = p.data.groupId
            data.avatar = p.data.avatar
            //头像 战团logo
            playerArr.push(data)
        }
        playerArr.sort(firstBy(function (v1, v2) { return v2.win - v1.win; })
            .thenBy(function (v1, v2) { return v2.dtScore - v1.dtScore; })
        )
        console.log(playerArr)
        return { _: null, group: group, playerArr: playerArr }
    }

    buildPlayerData(doc, isAll = false) {
        let sumMap: any = {}
        let sumIdx;
        isAll ? sumIdx = 99 : sumIdx = 24;
        for (let k in doc['recMap']) {
            if (Number(k) < sumIdx) {
                let r: RecData = doc['recMap'][k]
                if (!sumMap[r.player[0]])
                    sumMap[r.player[0]] = { name: r.player[0], win: 0, lose: 0, score: 0, dtScore: 0, beat: [], time: 0 }
                if (!sumMap[r.player[1]])
                    sumMap[r.player[1]] = { name: r.player[1], win: 0, lose: 0, score: 0, dtScore: 0, beat: [], time: 0 }
                if (r.score[0] == 0 && r.score[1] == 0) {
                    continue;
                }
                if (r.score[0] > r.score[1]) {
                    sumMap[r.player[0]].win++
                    sumMap[r.player[0]].dtScore += (r.score[0] - r.score[1])
                    sumMap[r.player[0]].beat.push(r.player[1])
                    sumMap[r.player[0]].score += r.score[0]

                    sumMap[r.player[1]].lose++
                    sumMap[r.player[1]].dtScore -= (r.score[0] - r.score[1])
                    sumMap[r.player[1]].score += r.score[1]
                }
                else {
                    sumMap[r.player[1]].win++
                    sumMap[r.player[1]].dtScore += (r.score[1] - r.score[0])
                    sumMap[r.player[1]].beat.push(r.player[0])
                    sumMap[r.player[1]].score += r.score[1]

                    sumMap[r.player[0]].lose++
                    sumMap[r.player[0]].dtScore -= (r.score[1] - r.score[0])
                    sumMap[r.player[0]].score += r.score[0]
                }
                console.log(r)
            }
        }
        return sumMap
    }

    setVS(vsStr) {
        let a = vsStr.split(' ')
        if (a.length == 2) {
            let p1 = a[0]
            let p2 = a[1]
            getDoc(doc => {
                let r = doc['recMap'][this.gameIdx]
                r.player = [p1, p2]
                this.initDoc(doc)
                saveDoc(doc)
            })
        }
    }

    setScore(scoreStr) {
        let a = scoreStr.split(' ')
        if (a.length == 2) {
            let s1 = a[0]
            let s2 = a[1]
            getDoc(doc => {
                let r = doc['recMap'][this.gameIdx]
                r.score = [s1, s2]
                this.initDoc(doc)
                saveDoc(doc)
            })
        }
    }

    initMaster() {
        getDoc((doc) => {
            let sumMap: any = this.buildPlayerData(doc)
            console.log('initMaster sumMap', sumMap);
            let playerArr = mapToArr(sumMap)
            for (let p1 of playerArr) {
                for (let p2 of playerArr) {
                    // if (p1.win == p2.win && p1.beat.indexOf(p2.name) > -1)
                    //     p1.win += 0.1
                }
            }
            playerArr.sort(firstBy(function (v1, v2) { return v2.win - v1.win; })
                .thenBy(function (v1, v2) { return v2.dtScore - v1.dtScore; })
            )
            // this.playerRank = playerArr

            // -- -master---                
            let groupMap: any = { 'a': [], 'b': [], 'c': [], 'd': [] }
            for (let p3 of playerArr) {
                let pg = p3.name[0]
                if (groupMap[pg].length < 2) {
                    groupMap[pg].push(p3)
                }
            }

            let m = []
            for (let g in groupMap) {
                m = m.concat(groupMap[g])
            }

            let masterIdx = 24
            doc['recMap'][masterIdx + 0].player = [m[0].name, m[3].name]

            doc['recMap'][masterIdx + 1].player[0] = m[2].name
            doc['recMap'][masterIdx + 1].player[1] = m[1].name

            doc['recMap'][masterIdx + 2].player[0] = m[4].name
            doc['recMap'][masterIdx + 2].player[1] = m[7].name

            doc['recMap'][masterIdx + 3].player[0] = m[6].name
            doc['recMap'][masterIdx + 3].player[1] = m[5].name
            for (let m1 of m) {
                console.log('master', m1.name)
            }
            console.log('master', doc)
            saveDoc(doc)
            this.initDoc(doc)
            this.emitBracket()
        })
    }

    clearMaster(section) {
        let min = 0
        let max = 38
        if (section == 0) {

        }
        else if (section == 1) {
            min = 24
        }
        getDoc((doc) => {
            if (doc) {
                for (let k in doc['recMap']) {
                    let gameIdx = Number(k)
                    if (gameIdx <= max && gameIdx >= min) {
                        doc['recMap'][k].score = [0, 0]
                        doc['recMap'][k].foul = [0, 0]

                        if (section == 1) {
                            doc['recMap'][k].player = ['', '']
                        }
                    }

                }
                doc.gameIdx = 0
                this.initDoc(doc)
                saveDoc(doc)
            }
        })
    }

    showChampion(groupName, title) {
        let p = this.getPlayerInfo(groupName)
        let data: any = { _: null }
        data.title = title
        data.visible = true
        data.ftId = p.data.groupId
        data.name = p.data.name
        data.location = p.data.school
        data.avatar = p.data.avatar
        data.info = p.data.height + ' cm/ ' + p.data.weight + " kg/ " + p.data.age + ' 岁'
        $post(`/emit/${WebDBCmd.cs_showChampion}`, data)
        $post(`/emit/${WebDBCmd.cs_showScore}`, { _: null, visible: false })
    }

    hideChampion() {
        let data = { _: null, visible: false }
        $post(`/emit/${WebDBCmd.cs_showChampion}`, data)
        $post(`/emit/${WebDBCmd.cs_showScore}`, { _: null, visible: true })
    }

    showGamePlayerInfo(visible) {
        let data = {
            _: null,
            visible: visible,
            leftPlayer: this.getPlayerInfo(this.lPlayer),
            rightPlayer: this.getPlayerInfo(this.rPlayer)
        }
        $post(`/emit/${WebDBCmd.cs_showGamePlayerInfo}`, data)
    }
}