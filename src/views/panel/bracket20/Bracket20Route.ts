export const routeBracket = (rec) => {
    let incoming = 1
    let route = (gameIdx, toWin, toLose) => {
        let rFrom = rec[gameIdx]
        let a = toWin.split('.')
        let winGameIdx = a[0]
        let winPos = Number(a[1])

        a = toLose.split('.')
        let loseGameIdx = a[0]
        let losePos = Number(a[1])

        let rWin = rec[winGameIdx]
        let rLose = rec[loseGameIdx]
        if (rFrom.score[0] == 0 && rFrom.score[1] == 0)
            return
        incoming++
        if (gameIdx == 5) {
            console.log('toWin', rWin, 'toLose', rLose, losePos);
        }
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
    route(1, '9.1', '16.1')
    route(2, '10.1', '15.1')
    route(3, '11.1', '14.1')
    route(4, '12.1', '13.1')

    route(5, '21.1', '13.0')
    route(6, '22.1', '14.0')
    route(7, '23.1', '15.0')
    route(8, '24.1', '16.0')

    route(9, '21.0', '17.0')
    route(10, '22.0', '18.0')
    route(11, '23.0', '19.0')
    route(12, '24.0', '20.0')

    route(13, '17.1', 'x.0')
    route(14, '18.1', 'x.0')
    route(15, '19.1', 'x.0')
    route(16, '20.1', 'x.0')

    route(17, '27.1', 'x.0')
    route(18, '28.1', 'x.0')
    route(19, '25.1', 'x.0')
    route(20, '26.1', 'x.0')

    route(21, '31.0', '25.0')
    route(22, '31.1', '26.0')
    route(23, '32.0', '27.0')
    route(24, '32.1', '28.0')

    route(25, '29.1', 'x.0')
    route(26, '29.0', 'x.0')
    route(27, '30.1', 'x.0')
    route(28, '30.0', 'x.0')

    route(29, '34.1', 'x.0')
    route(30, '33.1', 'x.0')

    route(31, '36.0', '33.0')
    route(32, '36.1', '34.0')

    route(33, '35.1', 'x.0')
    route(34, '35.0', 'x.0')

    route(35, '37.1', 'x.0')
    route(36, '38.0', '37.0')

    route(37, '38.1', 'x.0')
    // route(38, '38.1', 'x.0')
    return { incoming: incoming }
}