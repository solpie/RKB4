// let nedb;
const gameDb = new nedb({ filename: './db/game.db', autoload: true })

var XMLHttpRequest = require('xhr2');
let apiUrl = (url, callback) => {
    var reqProxy = new XMLHttpRequest();
    reqProxy.open('GET', url, true);
    reqProxy.responseType = 'json'
    reqProxy.onload = () => {
        callback(reqProxy.response)
    }
    reqProxy.send();
}
let getRoundRawData = (gameId, callback) => {
    let url = 'http://api.liangle.com/api/passerbyking/game/match/' + gameId
    apiUrl(url, callback)
}
let getRoundList = (callback) => {
    let url = 'http://api.liangle.com/api/passerbyking/game/list'
    apiUrl(url, callback)
}

function downLoadGameData() {
    let _downLoadGameData = (gameInfoArr, gameDataArr, callback) => {
        if (gameInfoArr.length) {
            let gameInfo = gameInfoArr.pop()
            console.log('getRoundRawData', gameInfo);
            getRoundRawData(gameInfo.id, res2 => {
                console.log('round data', res2);
                if (res2.data) {
                    gameDataArr.push({ info: gameInfo, gameArr: res2.data })
                }
                _downLoadGameData(gameInfoArr, gameDataArr, callback)
            })
        } else
            callback(gameDataArr)
    }
    getRoundList(res => {
        let gameDataArr = res.data
            // let gameDataArr = JSON.parse(res).data
        console.log('download game data:', gameDataArr)
        let gameInfoArr2017 = []
        for (var i = 0; i < gameDataArr.length; i++) {
            var gameData = gameDataArr[i];
            if (gameData.game_start.search('2017') > -1) {
                // console.log(gameData);
                gameInfoArr2017.push(gameData)
            }
        }

        _downLoadGameData(gameInfoArr2017, [], gameDataArr2017 => {
            console.log('db save');
            gameDb.insert({ idx: 2017, gameArr: gameDataArr2017 }, (err, numReplaced) => {
                // console.log(req.url, doc);
                // res.send({ err: err, numReplaced: numReplaced })
            })
        })
    })
}
// downLoadGameData()


function genPlayer(playerData) {
    return {
        player_id: playerData.player_id,
        name: playerData.name,
        gameIdMap: {},
        win: 0,
        beatPlayerMap: {},
        losePlayerMap: {},
        meetPlayerWinRaitoMap: {}, //交手胜率
        section: 0, //1最高 ~5
        champion: 0,
        gameCount: 0
    }
}

function circlePlayer(playerId, playerMap, num) {
    let recursion = (start, end, playerMap, nodeNum, path = []) => {
            // if (!path)
            //     path = []
            if (!path.length)
                path.push(start)
            if (nodeNum > 0) {
                // console.log('start', start, 'end', end, path, num);
                for (let pid in playerMap[start].beatPlayerMap) {
                    if (path.indexOf(pid) > -1) {
                        // console.log('back', playerMap[pid].name);
                    } else {
                        let p = playerMap[pid]
                        recursion(pid, end, playerMap, nodeNum - 1, path.concat([pid]))
                    }
                }
            } else {
                // console.log('out start', start, 'end', end, path, num);
                for (let pid in playerMap[start].beatPlayerMap) {
                    if (pid == end) {
                        path.push(pid)
                        let pathStr = ""
                        let lastPid = ""
                        for (let p2 of path) {
                            if (lastPid)
                                pathStr += ' ' + playerMap[lastPid].beatPlayerMap[p2] + 'x'
                            lastPid = p2
                            pathStr += "->" + playerMap[p2].name
                                //+ '[' + p2 + ']'
                        }
                        console.log('path', pathStr);
                    }
                }
            }
        }
        //relationWin
        //nodeNum 越少关系越强，nodeNum=1为直接胜负参考
        //击败次数越多 关系越强
        //赢球百分比 winScore-opScore/winScore
        //车轮战 1或0.5
        //大师 1 0.333 0.667
        //决赛 1 0.2 0.4 0.6 0.8
        //relationWin 车轮一场+1*赢球百分比
    recursion('4', '4', playerMap, 2)
        // recursion('4', '4', playerMap, 1)
}

function sumPlayer(playerMap) {
    let playerArrAnimal = []
    for (let player_id in playerMap) {
        let player = playerMap[player_id]
        let loseCount = player.gameCount - player.win
        player.activity = Object.keys(player.gameIdMap).length
        player.beatCount = Object.keys(player.beatPlayerMap).length
        if (player.champion > 1) {
            // if (player.champion && loseCount < 10) {
            // console.log('lose 10', player);
            playerArrAnimal.push(player)
        }
    }
    // playerArrAnimal.sort(ascendingProp('beatCount'))
    playerArrAnimal.sort(descendingProp('beatCount'))
    console.log('lose 10', playerArrAnimal);

    circlePlayer("4", playerMap, 3)
}

function genRanking() {
    let playerMap = {}
    let genPlayerActivity = (gameId, player, isWin, against, isFinal) => {
        if (player.player_id) {
            if (!playerMap[player.player_id])
                playerMap[player.player_id] = genPlayer(player)
            let playerData = playerMap[player.player_id]
            playerData.gameCount++;
            playerData.gameIdMap[gameId] = gameId
            if (isWin) {
                playerData.win++;
                if (!playerData.beatPlayerMap[against])
                    playerData.beatPlayerMap[against] = 0
                playerData.beatPlayerMap[against]++
                    if (isFinal)
                        playerData.champion++
            } else {
                playerData.losePlayerMap[against] = against
            }
            if (!playerData.meetPlayerWinRaitoMap[against])
                playerData.meetPlayerWinRaitoMap[against] = []
            playerData.meetPlayerWinRaitoMap[against].push(isWin)
            return playerData
        }
        return null
    }
    let genValidGameArr = (rawGameArr) => {
        let g = []
        let j = 1
        while (rawGameArr[j]) {
            let rawGame = rawGameArr[j]
            if (rawGame.left.player_id && rawGame.right.player_id) {
                g.push(rawGame)
            }
            j++
        }
        return g
    }
    let genBeatRaito = (lPlayer, rPlayer, isLPlayerWin) => {
        let winCount = Object.keys(lPlayer.beatPlayerMap).length
        let loseCount = Object.keys(lPlayer.losePlayerMap).length
        let lBeatRaito = winCount / (winCount + loseCount)

        winCount = Object.keys(rPlayer.beatPlayerMap).length
        loseCount = Object.keys(rPlayer.losePlayerMap).length
        let rBeatRaito = winCount / (winCount + loseCount)

        // if (isLPlayerWin) {
        //     lPlayer.beatRaito =
        // }

    }
    gameDb.find({ idx: 2017 }, (err, doc) => {
        console.log('game arr', doc[0]);

        //402 肯帝亚 123 124 2016总决赛
        let passGameIdxArr = [123, 124, 402]
            // for (let i = 0; i < 5; i++) {
        for (let i = 0; i < doc[0].gameArr.length; i++) {
            let game = doc[0].gameArr[doc[0].gameArr.length - 1 - i]
            let info = game.info
            if (passGameIdxArr.indexOf(info.id) > -1 || game.gameArr.length == 0) {

            } else {
                let validGameArr = genValidGameArr(game.gameArr)
                console.log(info.game_start.split(' ')[0], info.id, info.title, validGameArr.length);
                for (let validGame of validGameArr) {
                    let lScore = Number(validGame.left.score)
                    let rScore = Number(validGame.right.score)
                    let isFinal = (lScore == 5 || rScore == 5)
                    let lPlayer = validGame.left
                    let rPlayer = validGame.right
                    let lPlayer2 = genPlayerActivity(info.id, lPlayer, lScore > rScore, rPlayer.player_id, isFinal)
                    let rPlayer2 = genPlayerActivity(info.id, rPlayer, lScore < rScore, lPlayer.player_id, isFinal)
                    if (lPlayer2 && rPlayer2)
                        genBeatRaito(lPlayer2, rPlayer2, lScore > rScore)
                }
            }
        }
        // console.log(playerMap)
        sumPlayer(playerMap)
    })
}
genRanking()