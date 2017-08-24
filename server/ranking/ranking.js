// let nedb;
// const gameDb = new nedb({ filename: './db/game.db', autoload: true })

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
                if (res2.data && res2.data[1]) {
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
            // if (gameData.game_start.search('2017') > -1) {
            //     // console.log(gameData);
            //     gameInfoArr2017.push(gameData)
            // }
            if (gameData.id > 421) { //s3
                // console.log(gameData);
                gameInfoArr2017.push(gameData)
            }
        }

        _downLoadGameData(gameInfoArr2017, [], gameDataArr2017 => {
            console.log('db save', gameDataArr2017);
            gameDb.update({ idx: 's3' }, { idx: 's3', gameArr: gameDataArr2017 }, (err, numReplaced) => {
                // console.log(req.url, doc);
                // res.send({ err: err, numReplaced: numReplaced })
            })
        })
    })
}
// downLoadGameData()

//global
//{player_id:[{oneGameRec}]}
// const playerGameRecMap = {}

// function genPlayer(playerData) {
//     return {
//         player_id: playerData.player_id,
//         name: playerData.name,
//         gameIdMap: {},
//         win: 0,
//         lastRank: 0, //最近排名
//         beatPlayerMap: {},
//         losePlayerMap: {}, //绝对值越小差距越小
//         section: 0, //1最高 ~5
//         master: 0, //大师赛次数
//         champion: 0, //冠军次数
//         gameCount: 0
//     }
// }

// function findWinPath(start, end, playerMap, nodeNum, path = []) {
//     if (!path.length)
//         path.push(start)
//     if (nodeNum > 0) {
//         // console.log('start', start, 'end', end, path, num);
//         for (let pid in playerMap[start].beatPlayerMap) {
//             if (path.indexOf(pid) > -1) {
//                 // console.log('back', playerMap[pid].name);
//             } else {
//                 let p = playerMap[pid]
//                 return findWinPath(pid, end, playerMap, nodeNum - 1, path.concat([pid]))
//             }
//         }
//     } else {
//         // console.log('out start', start, 'end', end, path, num);
//         for (let pid in playerMap[start].beatPlayerMap) {
//             if (pid == end) {
//                 path.push(pid)
//                 let pathStr = ""
//                 let lastPid = ""
//                 for (let p2 of path) {
//                     if (lastPid)
//                         pathStr += ' ' + Math.floor(playerMap[lastPid].beatPlayerMap[p2] * 100) + '%'
//                     lastPid = p2
//                     pathStr += "->" + playerMap[p2].name
//                         //+ '[' + p2 + ']'
//                 }
//                 console.log('path', pathStr);
//                 return pathStr
//             }
//         }
//     }
// }

// function topRelationWin() {
//     //赢过最高排位的
//     //输过最高排位几分
// }

// function isAwinB(playerA, playerB, playerMap) {
//     let nodeNum = 0
//     while (nodeNum < 2) {
//         if (findWinPath(playerA.player_id, playerB.player_id, playerMap, 0))
//             return true
//         nodeNum++
//     }
//     return false
// }

// function circlePlayer(playerId, playerMap, num) {
//     // let recursion = (start, end, playerMap, nodeNum, path = []) => {

//     //     }
//     //relationWin关系胜场 
//     //nodeNum 越少关系越强，nodeNum=1为直接胜负参考
//     //击败次数越多 关系越强
//     // recursion('4', '4', playerMap, 1)
//     let pidArr = []
//     for (let pid in playerMap) {
//         pidArr.push(pid)
//     }
//     let sortBy = () => {
//             field = 'beatPlayerMap'
//             return function(a, b) {
//                 if (playerMap[a][field][b] && playerMap[b][field][b]) {
//                     if (playerMap[a][field][b] > playerMap[b][field][a])
//                         return 1
//                     else
//                         return -1
//                 }
//                 return 0;
//             };
//         }
//         //
//     pidArr = pidArr.sort(sortBy)
//     let playerArr = []
//     for (let pid of pidArr) {
//         playerArr.push(playerMap[pid])
//     }
//     console.log('sort', playerArr);

//     //winPoint 胜点，当球员A在决赛中击败对手B的时候，可以认为A比B强
//     /**
//      *relationWin关系胜场，目的,计算A比B赢多少的问题。
//             1.有直接交手 A->B 
//      *      一般比赛A赢B我们就算A赢了B一个胜场。其中忽略了比分
//      *      5-0赢和5-4赢对于AB之间的实力差距就无法用只计算一场胜负区分
//      *      因此结合比分scoreRatio以及几种不同比赛的权重winPoint来计算。
//      *      2.交手环 A->B->C->.....->A
//      *      3.无交手 A->B->C->D->...
//      *
//      *nodeNum[nn]  交手权重 
//      *scoreRatio[sr] 赢球百分比 (winScore-opScore)/winScore
//      *winPoint[wp] 胜点，当球员A在决赛中击败对手B的时候，可以认为A比B强
//      *         车轮：0.5   随机性强，可认为双方五五开
//      *         大师：0.7   七成实力
//      *         决赛：1     绝对实力
//      *
//      *车轮战 1或0.5
//      *大师 1 0.333 0.667
//      *决赛 1 0.2 0.4 0.6 0.8
//      *relationWin
//      *   车轮一场 0.25~0.5
//      *      大师  0.42~0.7
//      *      决赛  0.8~1
//      *
//      * 活跃
//      */
//     //relationWin 车轮一场 +0.5*wp
//     //relationWin 大师 +0.7*wp
//     //relationWin final +1*wp
//     findWinPath(playerId, playerId, playerMap, 1)
// }

// function countMap(map) {
//     return Object.keys(map).length
// }

// function sumPlayer(player) {
//     let loseCount = player.gameCount - player.win
//     player.activity = countMap(player.gameIdMap)
//     player.beatCount = countMap(player.beatPlayerMap)
//     player.beatRaito = genBeatRaito(player)
//     return player
// }
// let genBeatRaito = (player, playerMap = null) => {
//     if (playerMap)
//         player = playerMap[player.player_id]
//     let sum = 0
//     for (let pid in player.beatPlayerMap) {
//         sum += player.beatPlayerMap[pid]
//         if (player.losePlayerMap[pid]) {
//             // console.log(player.name, 'lose ', playerMap[pid].name, player.losePlayerMap[pid]);
//             // console.log(player.name, 'win ', playerMap[pid].name, player.beatPlayerMap[pid]);
//             sum += player.losePlayerMap[pid]
//         }
//     }
//     return sum
// }

// function sumGame(playerMap) {
//     let playerArrRankBase = []
//     for (let player_id in playerMap) {
//         let player = playerMap[player_id]
//         sumPlayer(player)
//         let notOneRound = player.gameCount > 2
//         if (notOneRound) {
//             playerArrRankBase.push(player)
//         }
//     }
//     // if (!rankArr) {
//     let sortA = playerArrRankBase.sort(descendingProp('beatRaito'))
//         // }
//     console.log('rank base not one Round', sortA.length, sortA);
//     return sortA
// }

// const MergerType = {
//     BEAT_RAITO: 'beat raito',
//     REF: 'ref',
// }

// function mergeRank(rankArrOld, rankArrNew, playerMapSum) {
//     let rMerge = rankArrOld.concat()
//         // let genLink = (player, header, tail) => {
//         //     return { header: header, player: player, tail: tail }
//         // }
//     let findRankIn = (player, rankInArr) => {
//         for (let i = 0; i < rankInArr.length; i++) {
//             let p = rankInArr[i];
//             if (p.player_id == player.player_id) {
//                 return i;
//             }
//         }
//         return -1
//     }

//     let rankByBeatRaito = (player, playerMapSum) => {
//         let pInsertBeatRaito = genBeatRaito(player, playerMapSum)
//         let isInsert = false
//         for (let i = 0; i < rMerge.length; i++) {
//             let p = rMerge[i];
//             if (p.player_id != player.player_id) {
//                 if (player.beatCount > p.beatCount)
//                     if (genBeatRaito(p, playerMapSum) < pInsertBeatRaito) {
//                         rMerge.splice(i, 0, player)
//                         isInsert = true
//                         break;
//                     }
//             }
//         }
//         //todo 
//         if (!isInsert)
//             rMerge.push(player)
//     }

//     let rankByRelation = (playerIn, playerRef, playerMapSum) => {
//         let playerInLoseRaito = playerIn.losePlayerMap[playerRef.player_id]
//         if (playerIn.beatPlayerMap[playerRef.player_id])
//             playerInLoseRaito += playerIn.beatPlayerMap[playerRef.player_id]
//         let nearestPlayer;
//         let rankIdx = -1;
//         for (let losePlayerId in playerRef.beatPlayerMap) {
//             let losePlayer = playerMapSum[losePlayerId]
//             let loseRaito = losePlayer.losePlayerMap[playerRef.player_id]
//             if (losePlayer.beatPlayerMap[playerRef.player_id])
//                 loseRaito += losePlayer.beatPlayerMap[playerRef.player_id]
//             let isA = isAwinB(playerIn, losePlayer, playerMapSum)
//             let isB = isAwinB(losePlayer, playerIn, playerMapSum)
//                 // findWinPath(playerIn.player_id,losePlayer.player_id,playerMapSum)
//                 // if (isA || isB) {
//                 //     console.log('rankByRelationAB', playerIn.name, isA, losePlayer.name, isB);
//                 // }
//             if (playerInLoseRaito > loseRaito && isA) {
//                 let r = findRankIn(losePlayer, rMerge)
//                 if (rankIdx < 0 || (r > 0 && r < rankIdx)) {
//                     rankIdx = r
//                 }
//                 console.log('rankByRelation lose raito', playerIn.name, playerInLoseRaito, losePlayer.name, loseRaito, rankIdx);
//             }
//         }

//         return rankIdx
//     }

//     for (let i = 0; i < rankArrNew.length; i++) {
//         let pNew = rankArrNew[i];
//         let rankIdx = -1;
//         for (let i = 0; i < rankArrOld.length; i++) {
//             let pOld = rankArrOld[i];
//             // let pOld = rankArrOld[rankArrOld.length - 1 - i];
//             if (pNew.player_id != pOld.player_id) {
//                 if (findRankIn(pNew, rMerge) < 0) { //新人入榜
//                     if (isAwinB(pNew, pOld, playerMapSum)) { //和老人有交手
//                         // if()
//                         // rankByRelation(pNew, pOld, playerMapSum)
//                         // let oldARank = findRankIn(pNew, rankArrOld)
//                         // let oldBRank = findRankIn(pOld, rankArrOld)
//                         // if (oldARank < oldBRank) { //

//                         // } else {
//                         //     console.log('todo 修正交手排名');
//                         //     // rankArrOld.splice(oldBRank, 0)
//                         //     // break;
//                         // }
//                         // console.log('todo oldRank', pNew.name, oldARank, pOld.name, oldBRank);
//                     } else {
//                         console.log('rank by beatRaito', pNew.name);
//                         rankByBeatRaito(pNew, playerMapSum)
//                         break;
//                     }
//                 } else { //relation
//                     //排名修正
//                     if (isAwinB(pNew, pOld, playerMapSum)) { //和老人有交手
//                         // if()
//                         let r = rankByRelation(pNew, pOld, playerMapSum)
//                         if (r > -1) {
//                             if (rankIdx < 0)
//                                 rankIdx = r
//                             else if (r < rankIdx) {
//                                 rankIdx = r
//                             }
//                         }
//                     }
//                 }
//             } else {
//                 //same player
//             }
//         }
//         if (rankIdx > -1) {
//             let oldRank = findRankIn(pNew, rMerge)
//             if (oldRank > -1) {
//                 if (rankIdx < oldRank) {
//                     rMerge.splice(rankIdx, 0, pNew)
//                     rMerge.splice(oldRank + 1, 1)
//                 } else {
//                     console.log('oldRank', oldRank, pNew.name, 'new Rank', rankIdx);
//                 }
//             } else
//                 rMerge.splice(rankIdx, 0, pNew)
//             console.log('rankByRelation Insert', pNew.name, 'rank in', rankIdx, rMerge[rankIdx + 1].name);
//         }
//     }
//     let sumArr = []
//     for (let p of rMerge) {
//         sumArr.push(sumPlayer(playerMapSum[p.player_id]))
//     }
//     console.log('after merge', sumArr);
//     return sumArr
// }

// function rankIn(playerArr, playerMap) {
//     let playerArrRankInOrder = playerArr.sort(ascendingProp('beatCount'))

//     // playerArr = playerArr.slice(0, 50)
//     console.log('playArr', playerArr[0], playerArrRankInOrder[0]);
//     let rankArr = [playerArrRankInOrder[0]]
//     for (let i = 1; i < playerArr.length; i++) {
//         let p = playerArr[i];
//         let index = rankArr.length
//         for (let j = 0; j < rankArr.length; j++) {
//             let pr = rankArr[j]
//             if (findWinPath(p.player_id, pr.player_id, playerMap, 0)) {
//                 if (p.beatPlayerMap[pr.player_id] > pr.beatPlayerMap[p.player_id])
//                     index = rankArr.length - j
//                 else
//                     index = rankArr.length - j + 1
//             }
//         }
//         rankArr.splice(index, 0, p)
//     }

//     return rankArr
// }


// function genRanking() {
//     let playerMap = {}
//     let playerMapSum = {}
//     let genPlayerActivity = (gameId, player, myScore, opScore, opPlayer, savePlayerMap) => {
//         let isFinal = (myScore == 5 || opScore == 5)
//         let isMaster = (myScore == 3 || opScore == 3)
//         let isRaw = (myScore == 2 || opScore == 2)
//         let isWin = myScore > opScore
//         let wp = 0.5
//         if (isMaster)
//             wp = 0.7
//         else if (isFinal)
//             wp = 1
//         if (player.player_id) {
//             if (!savePlayerMap[player.player_id])
//                 savePlayerMap[player.player_id] = genPlayer(player)
//             let playerData = savePlayerMap[player.player_id]
//             playerData.gameCount++;
//             playerData.gameIdMap[gameId] = gameId
//             if (isWin) {
//                 playerData.win++;
//                 if (!playerData.beatPlayerMap[opPlayer])
//                     playerData.beatPlayerMap[opPlayer] = 0
//                 playerData.beatPlayerMap[opPlayer] += (myScore - opScore) / myScore * wp
//                 if (isFinal)
//                     playerData.champion++;
//                 if (isMaster)
//                     playerData.master++;
//             } else {
//                 if (!playerData.losePlayerMap[opPlayer])
//                     playerData.losePlayerMap[opPlayer] = 0
//                 playerData.losePlayerMap[opPlayer] += (myScore - opScore) / opScore * wp
//             }
//             // if (!playerData.meetPlayerWinRaitoMap[against])
//             //     playerData.meetPlayerWinRaitoMap[against] = []
//             // playerData.meetPlayerWinRaitoMap[against].push(isWin)
//             return playerData
//         }
//         return null
//     }
//     let genValidGameArr = (rawGameArr) => {
//         let g = []
//         let j = 1
//         while (rawGameArr[j]) {
//             let rawGame = rawGameArr[j]
//             if (rawGame.left.player_id && rawGame.right.player_id) {
//                 g.push(rawGame)
//             }
//             j++
//         }
//         return g
//     }

//     gameDb.find({ idx: 2017 }, (err, doc) => {
//         console.log('game arr', doc[0]);
//         let rankArr;
//         let rankArrOld;
//         //402 肯帝亚 123 124 2016总决赛
//         let passGameIdxArr = [123, 124, 402]
//             // for (let i = 0; i < 5; i++) {
//         let sumCount = 0
//         let sumLimit = 30
//         for (let i = 0; i < doc[0].gameArr.length; i++) {
//             // for (let i = 0; i < 2; i++) {
//             let game = doc[0].gameArr[doc[0].gameArr.length - 1 - i]
//             let info = game.info
//             if (passGameIdxArr.indexOf(info.id) > -1 || game.gameArr.length == 0) {

//             } else {
//                 playerMap = {}
//                 let validGameArr = genValidGameArr(game.gameArr)
//                 console.log(info.game_start.split(' ')[0], info.id, info.title, validGameArr.length);
//                 // let oneGamePlayerMap = {}
//                 for (let validGame of validGameArr) {
//                     let lScore = Number(validGame.left.score)
//                     let rScore = Number(validGame.right.score)

//                     let lPlayer = validGame.left
//                     let rPlayer = validGame.right
//                     let lPlayer2 = genPlayerActivity(info.id, lPlayer, lScore, rScore, rPlayer.player_id, playerMap)
//                     let rPlayer2 = genPlayerActivity(info.id, rPlayer, rScore, lScore, lPlayer.player_id, playerMap)

//                     genPlayerActivity(info.id, lPlayer, lScore, rScore, rPlayer.player_id, playerMapSum)
//                     genPlayerActivity(info.id, rPlayer, rScore, lScore, lPlayer.player_id, playerMapSum)
//                         // if (lPlayer2 && rPlayer2)
//                         //     genBeatRaito(lPlayer2, rPlayer2, lScore > rScore)
//                 }
//                 // break;
//                 rankArr = sumGame(playerMap)
//                 if (!rankArrOld)
//                     rankArrOld = rankArr.concat()
//                 else
//                     rankArrOld = mergeRank(rankArrOld, rankArr, playerMapSum)
//                 window['rankArr'] = rankArrOld
//                     //test
//                 sumCount++
//                 if (sumCount > sumLimit - 1) {
//                     window['rankArr'] = rankArrOld
//                     break;
//                 }
//             }
//         }
//         logRank(rankArrOld, 100)
//             // for (let r of rankArr) {
//             //     console.log('ranking', r.name);
//             // }
//             // rankArr = sumPlayer(playerMap)
//             // console.log(playerMap)
//     })
// }
// // genRanking()

// function logRank(rankArr, count) {
//     for (let i = 0; i < count; i++) {
//         let p = rankArr[i]
//         if (p.activity > 1)
//             console.log(i + 1, p.name, 'act', p.activity, 'C', p.champion);
//     }
// }

// function findPlayer(name) {
//     for (let i = 0; i < window['rankArr'].length; i++) {
//         let p = window['rankArr'][i]
//         if (p.name.search(name) > -1)
//             console.log(i + 1, p.name, '活', p.activity, '冠', p.champion);
//     }
// }

// app.get('/ranking/', (req, res) => {
//     gameDb.find({ idx: 2017 }, (err, docs) => {
//         let ret = { err: err, doc: docs[0] }
//         if (docs.length)
//             res.send(ret)
//     })
// });