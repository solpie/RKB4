let getGamePlayer = (rec, start, end, playerDataMap) => {
    start--;
    let gamePlayerArr = []
    for (let i = start; i < start + end; i++) {
        let gameIdx = i + 1
        let playerArr = rec[gameIdx].player
        gamePlayerArr.push([playerDataMap[playerArr[0]], playerDataMap[playerArr[1]]])
    }
    return gamePlayerArr
}
export class ProcessView {
    constructor() {

    }
    static showTab(rec, tab, playerDataMap) {
        let gamePlayerArr;
        let title;
        let idx
        if (tab == 'pre1') {
            title = '分组赛01'
            idx = 1
            gamePlayerArr = getGamePlayer(rec, 1, 8, playerDataMap)
        }
        else if (tab == 'pre2') {
            title = '分组赛02'
            idx = 1
            gamePlayerArr = getGamePlayer(rec, 8, 16, playerDataMap)
        }
        else if (tab == 'lose1') {
            title = '败者组01'
            idx = 2
            gamePlayerArr = getGamePlayer(rec, 17, 24, playerDataMap)
        }
        else if (tab == 'win1') {
            title = '胜者组01'
            idx = 3
            gamePlayerArr = getGamePlayer(rec, 25, 32, playerDataMap)
        }
        // else if (tab == 'final8') {
        //     title = '8强'
        //     // gamePlayerArr = getGamePlayer(rec, 17, 24, playerDataMap)
        // }
        return { gamePlayerArr: gamePlayerArr, title: title, idx: 1 }
    }
}