import { PlayerInfo } from './PlayerInfo';
import { firstBy } from "./thenBy";
export class RecData {
    gameIdx: number = -1
    player: Array<string> = ['', '']
    score: Array<number> = [0, 0]//1-2
    foul: Array<number> = [0, 0]//2-3
    time: number = -1
}
export class GameInfo {
    //static
    playerArr: Array<PlayerInfo>
    // gameArr: Array<Array<PlayerInfo>>
    nameMapHupuId: any = {}
    //当前比赛球员
    gamePlayerArr: Array<PlayerInfo>
    status: number = 0
    winScore: number = 3
    gameIdx = 0
    gameTime = 0
    lScore = 0
    rScore = 0
    lFoul = 0
    rFoul = 0
    //save data
    // recArray: Array<RecData>
    recData: RecData
    recMap: any
    //dyna data
    // playerData = [{ name: '' }, { name: '' }]
    // groupIdMap = {}
    static create(playerOrderArr) {
        //加赛 手动排名
        let gmi = new GameInfo()
        let playerArr = []
        let mapN = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' }

        for (let i = 0; i < 16; i++) {
            let p = new PlayerInfo()
            p.id = i + 1
            p.hupuID = playerOrderArr[i].name
            p.name = mapN[Math.floor(i / 4)] + ((i % 4) + 1)
            p.data = playerOrderArr[i]
            playerArr.push(p)
            gmi.nameMapHupuId[p.name] = p
        }
        console.log(playerArr);
        gmi.playerArr = playerArr

        return gmi
    }
    getGameArr() {
        let gmi = this
        let group = []

        for (let i = 0; i < 4; i++) {
            group.push([gmi.playerArr[i * 4], gmi.playerArr[i * 4 + 1]])
            group.push([gmi.playerArr[i * 4 + 2], gmi.playerArr[i * 4 + 3]])
        }

        for (let i = 0; i < 4; i++) {
            group.push([gmi.playerArr[i * 4 + 1], gmi.playerArr[i * 4 + 2]])
            group.push([gmi.playerArr[i * 4], gmi.playerArr[i * 4 + 3]])
        }

        for (let i = 0; i < 4; i++) {
            group.push([gmi.playerArr[i * 4 + 1], gmi.playerArr[i * 4 + 3]])
            group.push([gmi.playerArr[i * 4], gmi.playerArr[i * 4 + 2]])
        }
        return group
    }

    start(gameIdx) {
        if (gameIdx < 38) {
            let r = this.recMap[gameIdx]
            this.recData = r
            this.gameIdx = this.recData.gameIdx
            let ln = r.player[0]
            let rn = r.player[1]
            console.log(ln, rn)
            if (this.nameMapHupuId && this.nameMapHupuId[ln] && rn)
                return ln + '[' + this.nameMapHupuId[ln].hupuID + '] vs '
                    + rn + '[' + this.nameMapHupuId[rn].hupuID + ']'
        }
        return ''
        // this.playerData = [this.nameMapHupuId[r.player[0]], this.nameMapHupuId[r.player[1]]]
    }

    getPlayerInfo(groupName) {
        if (this.nameMapHupuId[groupName])
            return JSON.parse(JSON.stringify(this.nameMapHupuId[groupName]))
        let p = new PlayerInfo()
        p.hupuID = groupName
        return p
    }

    h(name) {
        if (name && this.getPlayerInfo(name))
            return this.getPlayerInfo(name).hupuID.substr(0, 4)
        return ''
    }


    getBracket() {
        let data: any = { _: null }

        for (let i = 24; i < 38; i++) {
            let r = this.recMap[i]
            let lPlayer: PlayerInfo = this.getPlayerInfo(r.player[0])
            let rPlayer: PlayerInfo = this.getPlayerInfo(r.player[1])
            data[i - 23] = {
                left: {
                    score: r.score[0],
                    name: lPlayer.hupuID
                },
                right: {
                    score: r.score[1],
                    name: rPlayer.hupuID
                }
            }
        }
        return data
    }

    getGameData() {
        let data: any = { _: null }
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
        data.player = this.getPlayerData()

        return data
    }

    getPlayerData() {
        let data: any = {}
        let lName = this.recMap[this.gameIdx].player[0]
        let rName = this.recMap[this.gameIdx].player[1]

        let lPlayer: PlayerInfo = this.getPlayerInfo(lName)
        let rPlayer: PlayerInfo = this.getPlayerInfo(rName)

        let setV = (p, d) => {
            for (let k in d) {
                p[k] = d[k]
            }
        }

        setV(lPlayer, lPlayer.data)
        setV(rPlayer, rPlayer.data)

        data.left = lPlayer
        data.right = rPlayer
        lPlayer.leftScore = this.lScore
        lPlayer.leftFoul = this.lFoul

        rPlayer.rightScore = this.rScore
        rPlayer.rightFoul = this.rFoul
        return data
    }

    getWinInfo(doc, playerName) {
        let sumMap = this.buildPlayerData(doc, true)
        // console.log('getWinInfo', sumMap, this.nameMapHupuId)
        for (let groupId in this.nameMapHupuId) {
            console.log(this.nameMapHupuId[groupId].hupuID, playerName)
            if (this.nameMapHupuId[groupId].hupuID == playerName) {
                return sumMap[groupId]
            }
        }
        return { win: 0, lose: 0, score: 0 }
    }

    getGroup(doc, group) {
        let sumMap = this.buildPlayerData(doc)
        let playerArr = []
        for (let i = 0; i < 4; i++) {
            let data = sumMap[group + (i + 1)]
            let p = this.getPlayerInfo(data.name)
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
                    sumMap[r.player[0]].dtScore += r.score[0] - r.score[1]
                    sumMap[r.player[0]].beat.push(r.player[1])
                    sumMap[r.player[0]].score += r.score[0]

                    sumMap[r.player[1]].lose++
                    sumMap[r.player[1]].score += r.score[1]
                }
                else {
                    sumMap[r.player[1]].win++
                    sumMap[r.player[1]].dtScore += r.score[1] - r.score[0]
                    sumMap[r.player[1]].beat.push(r.player[0])
                    sumMap[r.player[1]].score += r.score[1]

                    sumMap[r.player[0]].lose++
                    sumMap[r.player[0]].score += r.score[0]
                }
                console.log(r)
            }
        }
        return sumMap
    }
    score(isLeft, dtScore) {
        if (isLeft)
            this.lScore += dtScore
        else
            this.rScore += dtScore
    }
    foul(isLeft, dt) {
        if (isLeft)
            this.lFoul += dt
        else
            this.rFoul += dt
    }

    getRecData() {
        return JSON.parse(JSON.stringify(this.recData))
    }

    setVS(doc, groupNameArr) {
        let r = doc['recMap'][this.gameIdx]
        r.player = groupNameArr
        console.log(r)
    }

    toJSON() {
        let doc: any = {}
        for (let k in this) {
            let o = typeof this[k]
            if (o != 'function') {
                if (k != 'playerArr') {
                    doc[k] = this[k]
                    console.log(k, o)
                }
            }
        }
        return doc
    }

    lastWinner: any
    commit() {
        let lPlayer = { name: this.recMap[this.gameIdx].player[0] }
        let rPlayer = { name: this.recMap[this.gameIdx].player[1] }
        let winner;
        if (this.lScore > this.rScore) {
            winner = lPlayer
        }
        else {
            winner = rPlayer
        }
        this.lastWinner = this.nameMapHupuId[winner.name].data
        let r = this.recData
        r.foul[0] = this.lFoul
        r.foul[1] = this.rFoul
        r.score[0] = this.lScore
        r.score[1] = this.rScore
        // r.gameIdx = this.gameIdx

        // this.gameIdx++
        this.start(this.gameIdx + 1)
        this.gameTime = 0
        this.lScore = 0
        this.lFoul = 0
        this.rScore = 0
        this.rFoul = 0

        if (this.gameIdx > (24 + 13 - 1)) {
            this.winScore = 5
        }

        return r
    }
}