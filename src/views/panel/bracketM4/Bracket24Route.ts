let setGameType = (map, start, end, type) => {
    start--;
    for (let i = start; i < end; i++) {
        let gameIdx = i + 1
        map[gameIdx] = type
    }
}
export const GameTypeMap = {}
export const GameType = { win: 11, lose: 12, pre: 10 }
//10 分组赛 11 胜者组 12 败者组
setGameType(GameTypeMap, 1, 16, GameType.pre)
setGameType(GameTypeMap, 17, 24, GameType.lose)
setGameType(GameTypeMap, 25, 32, GameType.win)
setGameType(GameTypeMap, 33, 40, GameType.lose)
setGameType(GameTypeMap, 41, 44, GameType.win)
setGameType(GameTypeMap, 45, 48, GameType.lose)
setGameType(GameTypeMap, 49, 52, GameType.lose)
setGameType(GameTypeMap, 53, 54, GameType.win)
setGameType(GameTypeMap, 55, 56, GameType.lose)
setGameType(GameTypeMap, 57, 58, GameType.lose)
setGameType(GameTypeMap, 59, 59, GameType.lose)
setGameType(GameTypeMap, 60, 60, GameType.win)
setGameType(GameTypeMap, 61, 61, GameType.lose)
setGameType(GameTypeMap, 62, 62, GameType.win)

export const routeBracket24 = (rec) => {
    let incoming = 1
    let winLoseMap = {}

    let route = (gameIdx, winGameIdx, winPos, loseGameIdx, losePos) => {
        // console.log('route', gameIdx, winGameIdx, winPos, loseGameIdx, losePos);
        let rFrom = rec[gameIdx]

        let rWin = rec[winGameIdx]
        let rLose = rec[loseGameIdx]

        winLoseMap[gameIdx] = loseGameIdx != 0

        if (rWin) {
            if (rFrom.score[0] == 0 && rFrom.score[1] == 0)
                return
            incoming++
            // if (gameIdx == 5) {
            //     console.log('toWin', rWin, 'toLose', rLose, losePos);
            // }
            if (rFrom.score[0] > rFrom.score[1]) {
                rWin.player[winPos] = rFrom.player[0]
                if (loseGameIdx != 0)
                    rLose.player[losePos] = rFrom.player[1]
            }
            else {
                rWin.player[winPos] = rFrom.player[1]
                if (loseGameIdx != 0)
                    rLose.player[losePos] = rFrom.player[0]
            }
        }
    }
    let _ = (s: string) => {
        let re = /\d+/ig;
        let a1 = s.match(re)
        let gameIdx = Number(a1[0])
        let winIdx = Number(a1[1])
        let winPos = Number(a1[2])
        let loseIdx = Number(a1[3])
        let losePos = Number(a1[4])
        route(gameIdx, winIdx, winPos, loseIdx, losePos)
    }
    for (let i = 0; i < routeArr.length; i++) {
        let r = routeArr[i];
        _(r)
    }

    return { incoming: incoming, winLoseMap: winLoseMap }
}

const routeArr =
    [
        `1-25.0 
        \\17.0`,
        `2-25.1 
        \\17.1`,

        `3-26.0 
        \\18.0`,
        `4-26.1 
        \\18.1`,

        `5-27.0 
        \\19.0`,
        `6-27.1 
        \\19.1`,

        `7-28.0 
        \\20.0`,
        `8-28.1 
        \\20.1`,

        `9-29.0 
        \\21.0`,
        `10-29.1 
        \\21.1`,

        `11-30.0 
        \\22.0`,
        `12-30.1 
        \\22.1`,

        `13-31.0 
        \\23.0`,
        `14-31.1  
        \\23.1`,

        `15-32.0 
        \\24.0`,
        `16-32.1 
        \\24.1`,

        `17-40.1 
        \\0.0`,
        `18-39.1 
        \\0.0`,

        `19-38.1 
        \\0.0`,
        `20-37.1 
        \\0.0`,

        `21-36.1 
        \\0.0`,
        `22-35.1 
        \\0.0`,

        `23-34.1 
        \\0.0`,
        `24-33.1 
        \\0.0`,

        `25-41.0 
        \\33.0`,
        `26-41.1 
        \\34.0`,

        `27-42.0 
        \\35.0`,
        `28-42.1 
        \\36.0`,

        `29-43.0 
        \\37.0`,
        `30-43.1 
        \\38.0`,

        `31-44.0 
        \\39.0`,
        `32-44.1 
        \\40.0`,
        //败者组02
        `33-45.0 
        \\0.0`,
        `34-45.1 
        \\0.0`,

        `35-46.0 
        \\0.0`,
        `36-46.1 
        \\0.0`,

        `37-47.0 
        \\0.0`,
        `38-47.1 
        \\0.0`,

        `39-48.0 
        \\0.0`,
        `40-48.1 
        \\0.0`,
        //胜者组02
        `41-53.0 
        \\51.0`,
        `42-53.1 
        \\52.0`,

        `43-54.0 
        \\49.0`,
        `44-54.1 
        \\50.0`,
        //lose 03
        `45-49.1 
        \\0.0`,
        `46-50.1 
        \\0.0`,

        `47-51.1 
        \\0.0`,
        `48-52.1 
        \\0.0`,
        //lose 04
        `49-55.1 
        \\0.0`,
        `50-55.0 
        \\0.0`,

        `51-56.1 
        \\0.0`,
        `52-56.0 
        \\0.0`,
        //win 03
        `53-60.0 
        \\57.0`,
        `54-60.1 
        \\58.0`,

        `55-57.1 
        \\0.0`,
        `56-58.1 
        \\0.0`,

        `57-59.0 
        \\0.0`,
        `58-59.1 
        \\0.0`,

        `59-61.1 
        \\0.0`,

        `60-62.0 
        \\61.0`,

        `61-62.1 
        \\0.0`,

        `62-63.0 
        \\0.0`,
    ]
export const routeCallback = (func) => {
    let _ = (s: string) => {
        let re = /\d+/ig;
        let a1 = s.match(re)
        let gameIdx = Number(a1[0])
        let winIdx = Number(a1[1])
        let winPos = Number(a1[2])
        let loseIdx = Number(a1[3])
        let losePos = Number(a1[4])
        func(gameIdx, winIdx, winPos, loseIdx, losePos)
    }
    for (let i = 0; i < routeArr.length; i++) {
        let r = routeArr[i];
        _(r)
    }
}
