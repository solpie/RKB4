export const routeBracket24 = (rec) => {
    let incoming = 1
    let route = (gameIdx, winGameIdx, winPos, loseGameIdx, losePos) => {
        let rFrom = rec[gameIdx]

        let rWin = rec[winGameIdx]
        let rLose = rec[loseGameIdx]
        if (rFrom.score[0] == 0 && rFrom.score[1] == 0)
            return
        incoming++
        // if (gameIdx == 5) {
        //     console.log('toWin', rWin, 'toLose', rLose, losePos);
        // }
        if (rFrom.score[0] > rFrom.score[1]) {
            rWin.player[winPos] = rFrom.player[0]
            if (loseGameIdx != 'x')
                rLose.player[losePos] = rFrom.player[1]
        }
        else {
            rWin.player[winPos] = rFrom.player[1]
            if (loseGameIdx != 'x')
                rLose.player[losePos] = rFrom.player[0]
        }
    }

    let _ = (s: string) => {
        let re = /\d+/ig;
        let a1 = s.match(re)
        console.log('a1', s, a1);
        let gameIdx = Number(a1[0])
        let winIdx = Number(a1[1])
        let winPos = Number(a1[2])
        let loseIdx = Number(a1[3])
        let losePos = Number(a1[4])
        route(gameIdx, winIdx, winPos, loseIdx, losePos)
    }
    _(`1-25.0 
        \\17.0`)
    _(`2-25.1 
        \\17.1`)

    _(`3-26.0 
        \\18.0`)
    _(`4-26.1 
        \\18.1`)

    _(`5-27.0 
        \\19.0`)
    _(`6-27.1 
        \\19.1`)

    _(`7-28.0 
        \\20.0`)
    _(`8-28.1 
        \\20.1`)

    _(`9-29.0 
        \\21.0`)
    _(`10-29.1 
        \\21.1`)

    _(`11-30.0 
        \\22.0`)
    _(`12-30.1 
        \\22.1`)

    _(`13-31.0 
        \\23.0`)
    _(`14-31.1  
        \\23.1`)

    _(`15-32.0 
        \\24.0`)
    _(`16-32.1 
        \\24.1`)

    _(`17-40.0 
        \\x.0`)
    _(`18-39.0 
        \\x.1`)

    _(`19-38.0 
        \\x.0`)
    _(`20-37.0 
        \\x.1`)

    _(`21-36.0 
        \\x.0`)
    _(`22-35.0 
        \\x.1`)

    _(`23-34.0 
        \\x.0`)
    _(`24-33.0 
        \\x.1`)


    return { incoming: incoming }
}