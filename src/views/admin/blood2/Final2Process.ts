import { finalData, getTeamMap } from './Final2TeamConst';
import { postGameJson } from '../../utils/HupuAPI';
let a = ['1-2',
    '3-4',
    '1-5',
    '2-3',
    '4-5',
    '1-4',
    '2-3',
    '4-5',
    '1-3',
    '2-5']
let isGameOver = (scoreArr) => {
    let lWin = (scoreArr[0] * 10) % 10 == 1
    let rWin = (scoreArr[1] * 10) % 10 == 1
    if (lWin)
        return 1
    if (rWin)
        return 2
    return 0
}
let getPlayerArr = (teamInfo) => {
    let a = []
    for (let p of teamInfo) {
        a.push({ name: p.name, header: p.avatarUrl })
    }
    return a
}
let newGame = (gameName, l, r) => {
    return {
        game_name: gameName, list: [
            {
                vs: l.id + '-' + r.id,
                left_team: { team_name: l.hz + l.name, players: getPlayerArr(l.playerArr) },
                right_team: { team_name: r.hz + r.name, players: getPlayerArr(r.playerArr) }
            }]

    }
}
function dumpVsScore(doc, scoreData) {
    let gameIdx = 1
    let teamMap = getTeamMap(doc)
    let _ = (scoreArr) => {
        for (let rec of scoreArr) {
            let lTeamInfo = teamMap[rec[2][0]]
            let rTeamInfo = teamMap[rec[2][1]]
            if (lTeamInfo && rTeamInfo)
                console.log(gameIdx, lTeamInfo.name,rec[0], 'vs',rec[1], rTeamInfo.name);
            else
                console.log(gameIdx, '- vs -');
            gameIdx++
        }
    }
    _(scoreData['day1'].scoreArr)
    _(scoreData['day2.1'].scoreArr)
    _(scoreData['day2.2'].scoreArr)
}
export function getGameProcess(doc, scoreData) {
    dumpVsScore(doc, scoreData)
    console.log('score data', scoreData);
    let teamMap = getTeamMap(doc)

    let readyArr = []
    let overArr = []


    let gameD1ready;
    for (let gs of a) {
        let a2 = gs.split('-')
        let lTeamInfo = teamMap[a2[0]]
        let rTeamInfo = teamMap[a2[1]]
        if (!gameD1ready)
            gameD1ready = newGame('Day1_积分赛', lTeamInfo, rTeamInfo)
        else {
            let g = newGame('', lTeamInfo, rTeamInfo)
            gameD1ready.list = gameD1ready.list.concat(g.list)
        }
    }
    console.log('game d1', gameD1ready);
    let gameJson = { ready: [], over: [] }


    let gameD1Over = JSON.parse(JSON.stringify(gameD1ready))
    gameD1Over.list = []
    let listClone = gameD1ready.list
    gameD1ready.list = []


    for (let i = 0; i < listClone.length; i++) {
        let g = listClone[i];
        let score = scoreData.day1.scoreArr[i]

        delete g.vs
        // let lScore =Mathscore[0]
        let winFlag = isGameOver(score)
        if (score && winFlag > 0) {
            if (winFlag == 1)
                g.left_team.win = true
            if (winFlag == 2)
                g.right_team.win = true
            gameJson.over.push(g)
        }
        else
            gameJson.ready.push(g)
    }
    gameD1ready.list = gameJson.ready
    gameD1Over.list = gameJson.over
    gameJson.ready = [gameD1ready]
    gameJson.over = [gameD1Over]

    let day2_1 = day2game3v3(doc, scoreData)
    if (day2_1.over)
        gameJson.over.push(day2_1.over)
    if (day2_1.ready)
        gameJson.ready.push(day2_1.ready)

    let day2_2 = day2gameDouble(doc, scoreData)
    if (day2_2.over)
        gameJson.over.push(day2_2.over)
    if (day2_2.ready)
        gameJson.ready.push(day2_2.ready)
    console.log('gameJson', gameJson);
    postGameJson(gameJson, res => {
        console.log('res');
    })
    return gameJson
}
function day2gameData(gameName, gameIdx, doc, scoreData) {
    let teamMap = getTeamMap(doc)
    let game3v3over, gameReady
    for (let rec of scoreData[gameIdx].scoreArr) {
        if (rec[2][0] != 0 && rec[2][1] != 0) {
            let lTeamInfo = teamMap[rec[2][0]]
            let rTeamInfo = teamMap[rec[2][1]]
            let winFlag = isGameOver(rec)
            if (winFlag > 0) {
                if (!game3v3over)
                    game3v3over = newGame(gameName, lTeamInfo, rTeamInfo)
                else {
                    let g = newGame('', lTeamInfo, rTeamInfo)
                    game3v3over.list = game3v3over.list.concat(g.list)
                }
                let g = game3v3over.list[game3v3over.list.length - 1]
                if (winFlag == 1)
                    g.left_team.win = true
                if (winFlag == 2)
                    g.right_team.win = true
                delete g.vs
            }
            else {
                if (!gameReady)
                    gameReady = newGame(gameName, lTeamInfo, rTeamInfo)
                else {
                    let g = newGame('', lTeamInfo, rTeamInfo)
                    gameReady.list = gameReady.list.concat(g.list)
                }
            }
        }
    }
    return { over: game3v3over, ready: gameReady }
}
function day2game3v3(doc, scoreData) {
    return day2gameData('Day2_3v3', 'day2.1', doc, scoreData)
}
function day2gameDouble(doc, scoreData) {
    return day2gameData('Day2_双败赛', 'day2.2', doc, scoreData)
}