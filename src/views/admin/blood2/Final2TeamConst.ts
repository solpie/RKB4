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
                let playerData = d.data
                teamInfo.playerArr.push(playerData)
                playerData.pid = 'p' + teamInfo.id + teamInfo.playerArr.length
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