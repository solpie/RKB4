import { getPlayerInfoArr, postGameArrJson } from '../../utils/HupuAPI';
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
// Nemanja Rudan 内曼亚-鲁丹
// Pavle Veljkovic 帕夫莱-维利科维奇
// Bogdan Dragovic 博格丹-德拉戈维奇
// Dragan Bjelica 德拉甘-别利察
// Marko Dugosija 马尔科-杜戈西亚
const nameMap = {
    '19634': '鲁丹',
    '8292': '帕夫莱',
    '25306': '马尔科',
    '25305': '德拉甘',
    '25304': '博格丹',
}
//20375 张梓祎
//11082 胡祥朕
//15619 张帅康
//19457 徐川傲
//8066 徐长龙
//1754 	孟亚东
//7686 	张浩林

export const finalData = {
    teamArr: [
        { id: '1', hz: '信-', name: '南方队', playerIdArr: [9931, 6874, 2660, 574, 2849] },
        { id: '2', hz: '義-', name: '中原队', playerIdArr: [2525, 753, 1213, 15619, 19457] },
        { id: '3', hz: '獒-', name: '明星队', playerIdArr: [25306, 25304, 25305, 19634, 8292] },
        { id: '4', hz: '勇-', name: '包邮区队', playerIdArr: [160, 1176, 16767, 9118, 16980] },
        { id: '5', hz: '忠-', name: '东北队', playerIdArr: [20375, 11082, 7686, 8066, 1754] },
    ]
}

export function getTeamMap(doc) {
    let m = {}
    for (let t of doc.teamArr) {
        m[t.id] = t
    }
    return m
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
                playerData.avatarUrl = d.data.avatar
                // playerData.avatar = d.data.avatar
                playerData.name = d.data.name
                teamInfo.playerArr.push(playerData)
                playerData.player_id = d.data.player_id
                if (nameMap[playerData.player_id])
                    playerData.name = nameMap[playerData.player_id]
                playerData.pid = 'p' + teamInfo.id + teamInfo.playerArr.length


                //local avatar
                playerData.avatar = '/img/player/final2/' + teamInfo.id + teamInfo.playerArr.length + '.jpg'

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
                , player_id: pid
            }
        return playerMap[pid]
    }

    let lTeamId, rTeamId

    let postRec = []
    let teamGameIdx = 0
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
            teamGameIdx++
            playerMap = {}
            postRec = []
            lTeamScore = 0
            rTeamScore = 0
        }
        postRec.push(rec)

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
                if (!_playerData(pid2).killMap[pid])
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
    //


    return {
        kda: playerMap
        , lTeamScore: lTeamScore
        , rTeamScore: rTeamScore
        , lTeamInfo: lTeamInfo
        , rTeamInfo: rTeamInfo
        , winTeamInfo: winTeamInfo
        , postRec: { idx: teamGameIdx, postRec: postRec }
    }
}

export function postGameArr(postRec, playerMap, teamGameIdx) {
    let data = { idx: teamGameIdx, games: [] }
    for (let rec of postRec) {
        let lPid = rec.player[0]
        let rPid = rec.player[1]
        let lPlayer_id = playerMap[lPid].player_id
        let rPlayer_id = playerMap[rPid].player_id
        data.games.push({ player: [lPlayer_id, rPlayer_id], score: rec.score })
    }
    console.log('post game', data);
    postGameArrJson(data, res => {
        console.log('res', res);
    })
}
