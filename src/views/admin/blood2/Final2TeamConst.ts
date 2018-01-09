import { getPlayerInfoArr } from "../../utils/HupuAPI";
import { syncDoc } from "../livedata/BaseGame";

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
        { id: '1', name: '中原队', playerIdArr: [2525, 753, 1213, 11082, 20375] },
        { id: '2', name: '东北队', playerIdArr: [1163, 4257, 17109, 8066, 1754] },
        { id: '3', name: '南方队', playerIdArr: [9931, 6874, 2660, 574, 2849] },
        { id: '4', name: '长三角队', playerIdArr: [160, 4, 16767, 9118, 16980] },
        { id: '5', name: '明星队', playerIdArr: [160, 4, 16767, 9118, 16980] }
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

export function kdaBuilder(doc) {
    let lTeamPlayerNum = 5
    let rTeamPlayerNum = 5
    for (let i = 0; i < 1000; i++) {
        let rec = doc.rec[i];

    }
}