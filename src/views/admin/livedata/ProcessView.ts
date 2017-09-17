let getGamePlayer = (rec, start, end, playerDataMap) => {
    start--;
    let gamePlayerArr = []
    for (let i = start; i < end; i++) {
        let gameIdx = i + 1
        let playerArr = rec[gameIdx].player
        let lPlayer = playerDataMap[playerArr[0]]
        let rPlayer = playerDataMap[playerArr[1]]
        lPlayer.score = rec[gameIdx].score[0]
        rPlayer.score = rec[gameIdx].score[1]
        gamePlayerArr.push([lPlayer, rPlayer])
    }
    return gamePlayerArr
}
export class ProcessView {
    constructor() {

    }

    static showPlayerProcess(rec, player, playerDataMap) {
        for (let i in rec) {
            let r = rec[i]
            if (r.player[0] == player || r.player[1] == player) {
                let lData = playerDataMap[r.player[0]]
                let rData = playerDataMap[r.player[1]]
                console.log(lData, rData);
            }
        }
    }

    static showTab(rec, tab, playerDataMap) {
        let gamePlayerArr;
        let title;
        let idx
        let start, end;
        if (tab == 'pre1') {
            title = '分组赛01'
            idx = 1
            start = 1
            end = 8
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'pre2') {
            title = '分组赛02'
            idx = 1
            start = 9
            end = 16
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'lose1') {
            title = '败者组01'
            idx = 2
            start = 17
            end = 24
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'win1') {
            title = '胜者组01'
            idx = 3
            start = 25
            end = 32
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'lose2') {
            title = '败者组02'
            idx = 4
            start = 33
            end = 40
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'win2') {
            title = '胜者组02'
            idx = 5
            start = 41
            end = 44
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'lose3') {
            title = '败者组03'
            idx = 6
            start = 45
            end = 48
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'lose4') {
            title = '败者组04'
            idx = 7
            start = 49
            end = 52
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'final8') {
            title = '8 强'
            idx = 8
            start = 53
            end = 62
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }
        else if (tab == 'final') {
            title = '决 赛'
            idx = 9
            start = 53
            end = 62
            gamePlayerArr = getGamePlayer(rec, start, end, playerDataMap)
        }

        return { gamePlayerArr: gamePlayerArr, title: title, idx: idx, start: start, gameIdx: 0 }
    }
}