let getGamePlayer = (rec, start, end, playerDataMap) => {
    start--;
    let gamePlayerArr = []
    for (let i = start; i < end; i++) {
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
            gamePlayerArr = getGamePlayer(rec, 9, 16, playerDataMap)
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
        else if (tab == 'lose2') {
            title = '败者组02'
            idx = 4
            gamePlayerArr = getGamePlayer(rec, 33, 40, playerDataMap)
        }
        else if (tab == 'win2') {
            title = '胜者组02'
            idx = 5
            gamePlayerArr = getGamePlayer(rec, 41, 44, playerDataMap)
        }
        else if (tab == 'lose3') {
            title = '败者组03'
            idx = 6
            gamePlayerArr = getGamePlayer(rec, 45, 48, playerDataMap)
        }
        else if (tab == 'lose4') {
            title = '败者组04'
            idx = 7
            gamePlayerArr = getGamePlayer(rec, 49, 52, playerDataMap)
        }
        // else if (tab == 'final8') {
        //     title = '8强'
        //     // gamePlayerArr = getGamePlayer(rec, 17, 24, playerDataMap)
        // }
        return { gamePlayerArr: gamePlayerArr, title: title, idx: 1 }
    }
}