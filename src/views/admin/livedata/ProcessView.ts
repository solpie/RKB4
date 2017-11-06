import { GameType, GameTypeMap, routeCallback } from '../../panel/bracketM4/Bracket24Route';
let getGamePlayer = (rec, start, end, playerDataMap) => {
    start--;
    let gamePlayerArr = []
    console.log('getGamePlayer', start, end);
    let lPlayer, rPlayer
    for (let i = start; i < end; i++) {
        let gameIdx = i + 1
        let playerArr = rec[gameIdx].player

        if (playerDataMap[playerArr[0]]) {
            lPlayer = JSON.parse(JSON.stringify(playerDataMap[playerArr[0]]))
            lPlayer.score = rec[gameIdx].score[0]
        }
        else {
            lPlayer = { data: {} }
        }
        if (playerDataMap[playerArr[1]])
        {
            rPlayer = JSON.parse(JSON.stringify(playerDataMap[playerArr[1]]))
            rPlayer.score = rec[gameIdx].score[1]
        }   
        else {
            rPlayer = { data: {} }
        }
        // try {
        // if (lPlayer)
        //     lPlayer.score = rec[gameIdx].score[0]
        // else
        //     lPlayer = { data: {} }
        // if (rPlayer)
        //     rPlayer.score = rec[gameIdx].score[1]
        // else
        //     rPlayer = { data: {} }
        console.log('rec[gameIdx]', rec[gameIdx], lPlayer.score, rPlayer.score);
        gamePlayerArr.push([lPlayer, rPlayer])
    }
    return gamePlayerArr
}
export class ProcessView {
    constructor() {

    }

    static showPlayerProcess(rec, gameIdx, player, playerDataMap) {
        for (let i = gameIdx - 1; i < 62; i++) {
            let r = rec[i + 1]
            if (r.player[0] == player || r.player[1] == player) {
                let lData = playerDataMap[r.player[0]]
                let rData = playerDataMap[r.player[1]]
                console.log(lData, rData);
                return { player: [lData.hupuID, rData.hupuID], gameIdx: i + 1 }
            }
        }
        return { player: [], gameIdx: 0 }
    }

    static showPlayerProcess2(data, doc, gameIdx, playerDataMap) {
        if (data.lastGame) {
            let lastGameIdx = gameIdx - 1
            let playerArr = doc.rec[lastGameIdx].player
            let p1 = ProcessView.showPlayerProcess(doc.rec, gameIdx, playerArr[0], playerDataMap)
            let p2 = ProcessView.showPlayerProcess(doc.rec, gameIdx, playerArr[1], playerDataMap)
            if (p1.gameIdx && p2.gameIdx) {
                let _ = (gameIdx) => {
                    let gt = GameTypeMap[gameIdx]
                    if (gt == GameType.lose)
                        return '败者组'
                    if (gt == GameType.win)
                        return '胜者组'
                }
                let gameTypeStr1 = _(p1.gameIdx)
                let gameTypeStr2 = _(p2.gameIdx)
                data.text = '比赛预告:  [第' + p1.gameIdx + `场 - ${gameTypeStr1}] ` + p1.player[0] + ' vs ' + p1.player[1]
                data.text += '   [第' + p2.gameIdx + `场 - ${gameTypeStr2}] ` + p2.player[0] + ' vs ' + p2.player[1]
                data.visible = true
            }
        }
        else {
            let processParam = ProcessView.showPlayerProcess(doc.rec, gameIdx, data.player, playerDataMap)
            data.processParam = processParam
            if (processParam.player.length) {
                console.log('EVENT_SHOW_PLAYER_PROCESS', processParam);
                data.text = '比赛预告:  [第' + processParam.gameIdx + '场] ' + processParam.player[0] + ' vs ' + processParam.player[1]
                data.visible = true
            }
        }
        return data
    }

    static showTab(rec, tab, playerDataMap, gameIdx) {
        let gamePlayerArr;
        let title;
        let idx
        let start, end;
        let seMap = {
            'pre1': [1, 8],
            'pre2': [9, 16],
            'lose1': [17, 24],
            'win1': [25, 32],
            'lose2': [33, 40],
            'win2': [41, 44],
            'lose3': [45, 48],
            'lose4': [49, 52],
            'final8': [53, 62],
            'final': [53, 62],
        }
        if (tab == 'auto') {
            for (let k in seMap) {
                let se = seMap[k]
                if (gameIdx >= se[0] && gameIdx <= se[1]) {
                    tab = k
                    break;
                }
            }
        }
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
        console.log('gamePlayerArr', gamePlayerArr);
        return { gamePlayerArr: gamePlayerArr, title: title, idx: idx, start: start, gameIdx: 0 }
    }

    static curPlayerRoute(doc, playerDataMap, gameIdx, callback) {
        let rec = doc.rec
        let playerArr = rec[gameIdx].player
        // let 
        console.log('cur player route game ', gameIdx, playerArr);

        let p1From, p2From;
        if (gameIdx > 16) {
            for (let idx = 1; idx < gameIdx; idx++) {
                let gamePlayerArr = rec[idx].player
                // console.log('game',idx,gamePlayerArr);
                if (playerArr[0] == gamePlayerArr[0]
                    || playerArr[0] == gamePlayerArr[1]) {
                    p1From = idx
                }
                if (playerArr[1] == gamePlayerArr[0]
                    || playerArr[1] == gamePlayerArr[1]) {
                    p2From = idx
                }
            }
            console.log('cur player route p1 from ', p1From, 'p2 from', p2From);
        }

        let winToIdx = 0;
        let loseToIdx = 0;
        let losePlayer = []
        let winPlayer = []
        let winFromIdxArr = []

        let curPlayer = rec[gameIdx].player
        routeCallback((gameIdx2, winIdx, winPos, loseIdx, losePos) => {
            if (gameIdx == gameIdx2) {
                console.log('win to', winIdx);
                console.log('lose to', loseIdx);
                // if (!winIdx2) {
                winToIdx = winIdx
                loseToIdx = loseIdx
                // }
                if (winIdx) {
                    winPlayer = rec[winIdx].player
                    console.log('win player at ', winToIdx, winPlayer);
                }
                if (loseToIdx) {
                    losePlayer = rec[loseToIdx].player
                    console.log('lose player at ', loseToIdx, losePlayer);
                }
            }
            let _getData = (arr) => {
                let a = []
                for (let p of arr) {
                    if (p) {
                        a.push(playerDataMap[p])
                    }
                    else
                        a.push('')
                }
                return a
            }
            // let find
            if (gameIdx2 == 62) {
                if (winToIdx > 0)
                    routeCallback((gameIdx3, winIdx3, winPos3, loseIdx3, losePos3) => {
                        if (winIdx3 == winToIdx || loseIdx3 == winToIdx) {
                            winFromIdxArr.push(gameIdx3)
                            // console.log('game', gameIdx3, 'player', rec[gameIdx3].player)
                            if (winFromIdxArr.length == 2) {
                                console.log(winIdx3, 'win from', winFromIdxArr);
                                let from = []
                                if (p1From) {
                                    from = [
                                        _getData(rec[p1From].player),
                                        _getData(rec[p2From].player)
                                    ]
                                }
                                let d = {
                                    from: from,
                                    lose: _getData(losePlayer),
                                    cur: _getData(curPlayer),
                                    win: _getData(winPlayer)
                                }
                                console.log('player route:', d);
                                callback(d)
                            }
                        }
                    })
            }
        })
        // console.log('win to', winIdx);

        // return
    }

}