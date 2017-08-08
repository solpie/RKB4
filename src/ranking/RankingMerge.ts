import { countMap } from "./com";
import { descendingProp } from "../views/utils/JsFunc";
import { RKPlayer } from "./RankingPlayer";

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
let genPlayerActivity = (gameId, player, myScore, opScore, opPlayer, savePlayerMap) => {
    let isFinal = (myScore == 5 || opScore == 5)
    let isMaster = (myScore == 3 || opScore == 3)
    let isRaw = (myScore == 2 || opScore == 2)
    let isWin = myScore > opScore
    let wp = 0.5
    if (isMaster)
        wp = 0.7
    else if (isFinal)
        wp = 1
    if (player.player_id) {
        if (!savePlayerMap[player.player_id])
            savePlayerMap[player.player_id] = new RKPlayer(player)
        let playerData = savePlayerMap[player.player_id]
        playerData.gameCount++;
        playerData.gameIdMap[gameId] = gameId
        if (isWin) {
            playerData.win++;
            if (!playerData.beatPlayerMap[opPlayer])
                playerData.beatPlayerMap[opPlayer] = 0
            playerData.beatPlayerMap[opPlayer] += (myScore - opScore) / myScore * wp
            if (isFinal)
                playerData.champion++;
            if (isMaster)
                playerData.master++;
        } else {
            if (!playerData.losePlayerMap[opPlayer])
                playerData.losePlayerMap[opPlayer] = 0
            playerData.losePlayerMap[opPlayer] += (myScore - opScore) / opScore * wp
        }
        return playerData
    }
    return null
}
let genBeatRaito = (player: RKPlayer, playerMap = null) => {
    if (playerMap)
        player = playerMap[player.player_id]
    let sum = 0
    for (let pid in player.beatPlayerMap) {
        sum += player.beatPlayerMap[pid]
        if (player.losePlayerMap[pid]) {
            // console.log(player.name, 'lose ', playerMap[pid].name, player.losePlayerMap[pid]);
            // console.log(player.name, 'win ', playerMap[pid].name, player.beatPlayerMap[pid]);
            sum += player.losePlayerMap[pid]
        }
    }
    return sum
}

function sumPlayer(player: RKPlayer) {
    let loseCount = player.gameCount - player.win
    player.activity = countMap(player.gameIdMap)
    player.beatCount = countMap(player.beatPlayerMap)
    player.beatRaito = genBeatRaito(player)
    return player
}
function sumGame(playerMap) {
    let playerArrRankBase = []
    for (let player_id in playerMap) {
        let player = playerMap[player_id]
        sumPlayer(player)
        let notOneRound = player.gameCount > 2
        if (notOneRound) {
            playerArrRankBase.push(player)
        }
    }
    // if (!rankArr) {
    let sortA = playerArrRankBase.sort(descendingProp('beatRaito'))
    // }
    console.log('rank base not one Round', sortA.length, sortA);
    return sortA
}
function findWinPath(start, end, playerMap, nodeNum, path = []) {
    if (!path.length)
        path.push(start)
    if (nodeNum > 0) {
        // console.log('start', start, 'end', end, path, num);
        for (let pid in playerMap[start].beatPlayerMap) {
            if (path.indexOf(pid) > -1) {
                // console.log('back', playerMap[pid].name);
            } else {
                let p = playerMap[pid]
                return findWinPath(pid, end, playerMap, nodeNum - 1, path.concat([pid]))
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
                        pathStr += ' ' + Math.floor(playerMap[lastPid].beatPlayerMap[p2] * 100) + '%'
                    lastPid = p2
                    pathStr += "->" + playerMap[p2].name
                    //+ '[' + p2 + ']'
                }
                console.log('path', pathStr);
                return pathStr
            }
        }
    }
}

function isAwinB(playerA: RKPlayer, playerB: RKPlayer, playerMap) {
    let nodeNum = 0
    while (nodeNum < 2) {
        if (findWinPath(playerA.player_id, playerB.player_id, playerMap, 0))
            return true
        nodeNum++
    }
    return false
}
const mergeGame = (rankArrOld, rankArrNew, playerMapSum) => {
    let rMerge = rankArrOld.concat()
    // let genLink = (player, header, tail) => {
    //     return { header: header, player: player, tail: tail }
    // }
    let findRankIn = (player, rankInArr) => {
        for (let i = 0; i < rankInArr.length; i++) {
            let p = rankInArr[i];
            if (p.player_id == player.player_id) {
                return i;
            }
        }
        return -1
    }

    let rankByBeatRaito = (player: RKPlayer, playerMapSum) => {
        let pInsertBeatRaito = genBeatRaito(player, playerMapSum)
        let isInsert = false
        for (let i = 0; i < rMerge.length; i++) {
            let p:RKPlayer = rMerge[i];
            if (p.player_id != player.player_id) {
                if (player.avgZen > p.avgZen)
                    if (genBeatRaito(p, playerMapSum) < pInsertBeatRaito) {
                        rMerge.splice(i, 0, player)
                        isInsert = true
                        break;
                    }
            }
        }
        //todo 
        if (!isInsert)
            rMerge.push(player)
    }

    let rankByRelation = (playerIn: RKPlayer, playerRef: RKPlayer, playerMapSum) => {
        let playerInLoseRaito = playerIn.losePlayerMap[playerRef.player_id]
        if (playerIn.beatPlayerMap[playerRef.player_id])
            playerInLoseRaito += playerIn.beatPlayerMap[playerRef.player_id]
        let nearestPlayer;
        let rankIdx = -1;
        for (let losePlayerId in playerRef.beatPlayerMap) {
            let losePlayer = playerMapSum[losePlayerId]
            let loseRaito = losePlayer.losePlayerMap[playerRef.player_id]
            if (losePlayer.beatPlayerMap[playerRef.player_id])
                loseRaito += losePlayer.beatPlayerMap[playerRef.player_id]
            let isA = isAwinB(playerIn, losePlayer, playerMapSum)
            let isB = isAwinB(losePlayer, playerIn, playerMapSum)
            // findWinPath(playerIn.player_id,losePlayer.player_id,playerMapSum)
            // if (isA || isB) {
            //     console.log('rankByRelationAB', playerIn.name, isA, losePlayer.name, isB);
            // }
            if (playerInLoseRaito > loseRaito && isA) {
                let r = findRankIn(losePlayer, rMerge)
                if (rankIdx < 0 || (r > 0 && r < rankIdx)) {
                    rankIdx = r
                }
                console.log('rankByRelation lose raito', playerIn.name, playerInLoseRaito, losePlayer.name, loseRaito, rankIdx);
            }
        }

        return rankIdx
    }

    for (let i = 0; i < rankArrNew.length; i++) {
        let pNew = rankArrNew[i];
        let rankIdx = -1;
        for (let i = 0; i < rankArrOld.length; i++) {
            let pOld = rankArrOld[i];
            // let pOld = rankArrOld[rankArrOld.length - 1 - i];
            if (pNew.player_id != pOld.player_id) {
                if (findRankIn(pNew, rMerge) < 0) { //新人入榜
                    if (isAwinB(pNew, pOld, playerMapSum)) { //和老人有交手
                        // if()
                        // rankByRelation(pNew, pOld, playerMapSum)
                        // let oldARank = findRankIn(pNew, rankArrOld)
                        // let oldBRank = findRankIn(pOld, rankArrOld)
                        // if (oldARank < oldBRank) { //

                        // } else {
                        //     console.log('todo 修正交手排名');
                        //     // rankArrOld.splice(oldBRank, 0)
                        //     // break;
                        // }
                        // console.log('todo oldRank', pNew.name, oldARank, pOld.name, oldBRank);
                    } else {
                        console.log('rank by beatRaito', pNew.name);
                        rankByBeatRaito(pNew, playerMapSum)
                        break;
                    }
                } else { //relation
                    //排名修正
                    if (isAwinB(pNew, pOld, playerMapSum)) { //和老人有交手
                        // if()
                        let r = rankByRelation(pNew, pOld, playerMapSum)
                        if (r > -1) {
                            if (rankIdx < 0)
                                rankIdx = r
                            else if (r < rankIdx) {
                                rankIdx = r
                            }
                        }
                    }
                }
            } else {
                //same player
            }
        }
        if (rankIdx > -1) {
            let oldRank = findRankIn(pNew, rMerge)
            if (oldRank > -1) {
                if (rankIdx < oldRank) {
                    rMerge.splice(rankIdx, 0, pNew)
                    rMerge.splice(oldRank + 1, 1)
                } else {
                    console.log('oldRank', oldRank, pNew.name, 'new Rank', rankIdx);
                }
            } else
                rMerge.splice(rankIdx, 0, pNew)
            console.log('rankByRelation Insert', pNew.name, 'rank in', rankIdx, rMerge[rankIdx + 1].name);
        }
    }
    let sumArr = []
    for (let p of rMerge) {
        sumArr.push(sumPlayer(playerMapSum[p.player_id]))
    }
    console.log('after merge', sumArr);
    return sumArr
}
export class MergeRank {
    doc: any
    playerMapSum: any
    gameIdMap: any
    //402 肯帝亚 123 124 2016总决赛
    skipGame = [123, 124, 402]
    rankMerge = []
    constructor(doc) {
        this.doc = doc
        this.playerMapSum = {}
        this.gameIdMap = {}
        for (let i = 0; i < doc.gameArr.length; i++) {
            let game = doc.gameArr[doc.gameArr.length - 1 - i]
            let info = game.info
            if (this.skipGame.indexOf(info.id) > -1 || game.gameArr.length == 0) {

            }
            else {
                let validGameArr = genValidGameArr(game.gameArr)
                this.gameIdMap[info.id] = validGameArr
            }
        }
    }

    mergeGameArr(gameIdArr) {
        for (let i = 0; i < gameIdArr.length; i++) {
            let gameId = gameIdArr[i];
            if (this.gameIdMap[gameId]) {
                let validGameArr = this.gameIdMap[gameId];
            }
        }
    }

    rippleProp(playerArr: Array<RKPlayer>, prop) {
        let m = {}
        let maxAct = 0
        for (let i = 0; i < playerArr.length; i++) {
            let p: RKPlayer = playerArr[i];
            if (!m[p[prop]])
                m[p[prop]] = []
            maxAct = Math.max(maxAct, p[prop])
            m[p[prop]].push(p)
        }
        let pA = []
        for (let i = 0; i < maxAct; i++) {
            if (m[i + 1])
                pA = m[i + 1].concat(pA)
        }
        return pA
    }

    fixRankByActivity(playerArr: Array<RKPlayer>) {
        return this.rippleProp(playerArr, 'activity')
    }

    queryPlayerArrInFight(playerIdArr) {
        let playerMap;
        let gameIdArr = []
        for (let gameId in this.gameIdMap) {
            let validGameArr = this.gameIdMap[gameId]
            playerMap = {}
            for (let validGame of validGameArr) {
                let lScore = Number(validGame.left.score)
                let rScore = Number(validGame.right.score)

                let lPlayer = validGame.left
                let rPlayer = validGame.right
                if (!playerMap[lPlayer.player_id])
                    playerMap[lPlayer.player_id] = 0
                playerMap[lPlayer.player_id]++

                if (!playerMap[rPlayer.player_id])
                    playerMap[rPlayer.player_id] = 0
                playerMap[rPlayer.player_id]++
            }
            let allFind = true
            for (let playerId of playerIdArr) {
                if (!playerMap[playerId]) {
                    allFind = false
                    break
                }
            }
            if (allFind)
                gameIdArr.push(gameId)
        }
        return gameIdArr
    }

    queryPlayerIdByName(n) {
        for (let pid in this.playerMapSum) {
            let p: RKPlayer = this.playerMapSum[pid]
            if (p.name.toLocaleLowerCase().search(n.toLocaleLowerCase())>-1)
                console.log('player', p);
        }
    }

    flowUpPlayer(p: RKPlayer) {

    }

    merge(limit) {
        let doc = this.doc
        let playerMap;
        let playerMapSum = this.playerMapSum = {}
        console.log('game arr', doc);
        let rankArr;
        let rankArrOld;

        let passGameIdxArr = [123, 124, 402]
        // for (let i = 0; i < 5; i++) {
        let sumCount = 0
        let sumLimit = limit
        for (let i = 0; i < doc.gameArr.length; i++) {
            // for (let i = 0; i < 2; i++) {
            let game = doc.gameArr[doc.gameArr.length - 1 - i]
            let info = game.info
            if (passGameIdxArr.indexOf(info.id) > -1 || game.gameArr.length == 0) {

            } else {
                playerMap = {}
                let validGameArr = genValidGameArr(game.gameArr)
                console.log(info.game_start.split(' ')[0], info.id, info.title, validGameArr.length);
                // let oneGamePlayerMap = {}
                for (let validGame of validGameArr) {
                    let lScore = Number(validGame.left.score)
                    let rScore = Number(validGame.right.score)

                    let lPlayer = validGame.left
                    let rPlayer = validGame.right
                    let lPlayer2 = genPlayerActivity(info.id, lPlayer, lScore, rScore, rPlayer.player_id, playerMap)
                    let rPlayer2 = genPlayerActivity(info.id, rPlayer, rScore, lScore, lPlayer.player_id, playerMap)

                    genPlayerActivity(info.id, lPlayer, lScore, rScore, rPlayer.player_id, playerMapSum)
                    genPlayerActivity(info.id, rPlayer, rScore, lScore, lPlayer.player_id, playerMapSum)
                    // if (lPlayer2 && rPlayer2)
                    //     genBeatRaito(lPlayer2, rPlayer2, lScore > rScore)
                }
                // break;
                rankArr = sumGame(playerMap)
                if (!rankArrOld)
                    rankArrOld = rankArr.concat()
                else
                    rankArrOld = mergeGame(rankArrOld, rankArr, playerMapSum)
                window['rankArr'] = rankArrOld
                //test
                sumCount++
                if (sumCount > sumLimit - 1) {
                    window['rankArr'] = rankArrOld
                    break;
                }
            }
        }
        return rankArrOld
        // logRank(rankArrOld, 100)
    }
}