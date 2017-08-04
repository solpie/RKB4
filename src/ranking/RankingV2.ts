import { syncDoc } from '../views/admin/livedata/BaseGame';
import { getRoundList, getRoundRawData } from "../views/utils/HupuAPI";

export function downLoadGameData() {
    let _downLoadGameData = (gameInfoArr, gameDataArr, callback) => {
        if (gameInfoArr.length) {
            let gameInfo = gameInfoArr.pop()
            getRoundRawData(gameInfo.id, res2 => {
                if (res2.data) {
                    console.log('round data', gameInfo, res2);
                    gameDataArr.push({ info: gameInfo, gameArr: res2.data })
                }
                _downLoadGameData(gameInfoArr, gameDataArr, callback)
            })
        }
        else
            callback(gameDataArr)
    }
    getRoundList(res => {
        let gameDataArr = JSON.parse(res).data
        console.log('download game data:', JSON.parse(res))
        let gameInfoArr2017 = []
        for (var i = 0; i < gameDataArr.length; i++) {
            var gameData = gameDataArr[i];
            if (gameData.game_start.search('2017') > -1) {
                console.log(gameData);
                gameInfoArr2017.push(gameData)
            }
        }

        _downLoadGameData(gameInfoArr2017, [], gameDataArr2017 => {
            console.log('');
            syncDoc(2017, doc => {
                doc.gameArr = gameDataArr2017
            }, true)
        })
        // getRoundRawData(gameInfoArr2017[2].id, res2 => {
        //     console.log('round data', gameInfoArr2017[2], res2);
        // })
    })
}