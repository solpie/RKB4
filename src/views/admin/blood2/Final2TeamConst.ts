import { getPlayerInfoArr } from "../../utils/HupuAPI";
import { syncDoc } from "../livedata/BaseGame";
import { countMap } from '../../../ranking/com';

export class PlayerDoc2 {
    bonus: number
    blood: number

    score: number
    foul: number
    kill: number
    death: number
    assist: number
}

export const finalData = {
    teamArr: [
        { id: '1', name: '南方.', playerIdArr: [9931, 6874, 2660, 574, 2849] },
        { id: '2', name: '中原.義', playerIdArr: [2525, 753, 1213, 11082, 20375] },
        { id: '3', name: '明星.獒', playerIdArr: [160, 4, 16767, 9118, 16980] },
        { id: '4', name: '包邮.勇', playerIdArr: [160, 4, 16767, 9118, 16980] },
        { id: '5', name: '东北.忠', playerIdArr: [1163, 4257, 17109, 8066, 1754] },
    ]
}


export const syncPlayerData = (playerDoc) => {
    let finCount = 0;
    let fillData = (teamInfo) => {
        getPlayerInfoArr(teamInfo.playerIdArr, res => {
            teamInfo.playerArr = []
            for (let d of res) {
                let playerData: any = {}
                playerData.height = d.data.height
                playerData.weight = d.data.weight
                playerData.age = d.data.age
                playerData.avatar = d.data.avatar
                playerData.name = d.data.name
                teamInfo.playerArr.push(playerData)
                playerData.player_id = d.data.player_id
                playerData.pid = 'p' + teamInfo.id + teamInfo.playerArr.length

                playerData.blood = 2
                playerData.score = 0
                playerData.kill = 0
                playerData.death = 0
                playerData.assist = 0
                playerData.beatByPlayerMap = {}
            }
            console.log(teamInfo)
            finCount++
            if (finCount == finalData.teamArr.length) {
                console.log('sync dbIdx', playerDoc);
                syncDoc(playerDoc, doc => {
                    doc.teamArr = finalData.teamArr
                }, true)
            }
        })
    }
    for (let t of finalData.teamArr) {
        fillData(t)
    }
}


export function getGroupBracket(playerId: string) {
    let a = ['1-2',
        '3-4',
        '1-5',
        '2-4',
        '3-5',
        '1-4',
        '2-3',
        '4-5',
        '1-3',
        '2-5']
    return a
}

export function getTeamId(playerId: string) {
    let tStr = playerId.substring(1, 2)
    return tStr
}
export function getTeamInfo(teamId: string) {
    for (let t of finalData.teamArr) {
        if (t.id == teamId) {
            return t
        }
    }
}

let dbIdx = '1.20.player'
export function getPlayerArrByPlayerId(lPlayerId: string, rPlayerId: string, cb) {
    let ltStr = lPlayerId.substring(1, 2)
    let rtStr = rPlayerId.substring(1, 2)
    let lTeamInfo, rTeamInfo;
    syncDoc(dbIdx, doc => {
        console.log('team id', ltStr, doc);
        for (let t of doc.teamArr) {
            if (t.id == ltStr) {
                lTeamInfo = t
                console.log('team', t);
            }
            if (t.id == rtStr) {
                rTeamInfo = t
                console.log('team', t);
            }
        }
        cb(lTeamInfo, rTeamInfo)
    })
}

export function kdaBuilder(doc, gameIdx) {
    let lTeamPlayerNum = 5
    let rTeamPlayerNum = 5
    // let gameIdx = doc.gameIdx
    let CurVsTeam = ''
    let playerMap = {}
    let lTeamScore = 0, rTeamScore = 0

    let _playerData = (pid) => {
        if (!playerMap[pid])
            playerMap[pid] = {
                k: 0, d: 0, a: 0, score: 0,
                dmgPerc: 0//damage%
                , isLeft: false
                , blood: -1
                , scorePlayerMap: {}//damage by who
                , killMap: {}//kill who
            }
        return playerMap[pid]
    }

    let lTeamId, rTeamId
    for (let i = 0; i < gameIdx; i++) {
        console.log('gameIdx', gameIdx);
        let rec = doc.rec[i + 1];
        let lPlayerId = rec.player[0]
        let rPlayerId = rec.player[1]
        lTeamId = getTeamId(rec.player[0])
        rTeamId = getTeamId(rec.player[1])
        let v = lTeamId + ' vs ' + rTeamId
        if (CurVsTeam != v) {
            CurVsTeam = v
            playerMap = {}
        }

        let lScore = Number(rec.score[0])
        let rScore = Number(rec.score[1])
        let lBlood = Number(rec.blood[0])
        let rBlood = Number(rec.blood[1])
        let lPlayerData = _playerData(lPlayerId)
        let rPlayerData = _playerData(rPlayerId)

        lPlayerData.score += lScore
        rPlayerData.score += rScore

        lTeamScore += lScore
        rTeamScore += rScore

        lPlayerData.isLeft = true
        rPlayerData.isLeft = false

        lPlayerData.blood = lBlood - rScore
        rPlayerData.blood = rBlood - lScore

        if (lScore > 0 && rBlood > 0)
            rPlayerData.scorePlayerMap[lPlayerId] = 1
        if (rScore > 0 && lBlood > 0)
            lPlayerData.scorePlayerMap[rPlayerId] = 1

        if (lPlayerData.blood == 0) {
            rPlayerData.k++
            rPlayerData.killMap[lPlayerId] = 1
            lPlayerData.d++
        }
        if (rPlayerData.blood == 0) {
            lPlayerData.k++
            lPlayerData.killMap[rPlayerId] = 1
            rPlayerData.d++
        }
    }
    console.log('player round kda map', playerMap);
    for (let pid in playerMap) {
        let playerData = playerMap[pid]
        let countKiller = countMap(playerData.scorePlayerMap)
        if (playerData.blood == 0 && countKiller > 1) {
            console.log('kill by multi', pid, playerData.scorePlayerMap);
            for (let pid2 in playerData.scorePlayerMap) {
                _playerData(pid2).a++
            }
        }

        if (playerData.score != 0)
            playerData.dmgPerc = Math.floor(100 * playerData.score / (playerData.isLeft ? lTeamScore : rTeamScore))
    }

    let lTeamInfo = getTeamInfo(lTeamId)
    let rTeamInfo = getTeamInfo(rTeamId)
    let winTeamInfo
    if (lTeamScore > rTeamScore) {
        winTeamInfo = lTeamInfo
    }
    else {
        winTeamInfo = rTeamInfo
    }
    return {
        kda: playerMap
        , lTeamScore: lTeamScore
        , rTeamScore: rTeamScore
        , lTeamInfo: lTeamInfo
        , rTeamInfo: rTeamInfo
        , winTeamInfo: winTeamInfo
    }
}