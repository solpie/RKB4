import { arrMove, arrRipple, countMap, findRankIn } from './com';
import { descendingProp } from "../views/utils/JsFunc";
import { RKPlayer } from "./RankingPlayer";
import { findWinPath, isAwinB, logPath } from './PlayerRelation';

export let genValidGameArr = (rawGameArr) => {
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
    if (player.player_id) {

        if (!savePlayerMap[player.player_id])
            savePlayerMap[player.player_id] = new RKPlayer(player)
        let p: RKPlayer = savePlayerMap[player.player_id]

        p.pushActivity(gameId, myScore, opScore, opPlayer)
        return p
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
    // let loseCount = player.gameCount - player.win
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



const mergeGame = (rankArrOld, rankArrNew, playerMapSum) => {
    let rMerge = rankArrOld.concat()

    let rankByBeatRaito = (player: RKPlayer, playerMapSum) => {
        let pInsertBeatRaito = genBeatRaito(player, playerMapSum)
        let isInsert = false
        for (let i = 0; i < rMerge.length; i++) {
            let p: RKPlayer = rMerge[i];
            if (p.player_id != player.player_id) {
                if (player.realWeight > p.realWeight)
                // if (genBeatRaito(p, playerMapSum) < pInsertBeatRaito) 
                {//
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
            if (rMerge[rankIdx + 1])
                console.log('rankByRelation Insert', pNew.name, 'rank in', rankIdx, rMerge[rankIdx + 1].name);
            else
                console.log('rankByRelation Insert', pNew.name, 'rank in', rankIdx, rMerge.length);
        }
    }
    let sumArr = []
    for (let p of rMerge) {
        sumArr.push(sumPlayer(playerMapSum[p.player_id]))
    }
    console.log('after merge', sumArr);
    return sumArr
}
export class RankModel {
    doc: any
    playerMapSum: any
    gameIdMap: any
    //402 肯帝亚 123 124 2016总决赛
    skipGame = [123, 124, 402]
    rankMerge: Array<RKPlayer> = []
    vaildGameIdArr: any
    gameInfoMap: any
    topZenRealWeight = 0
    constructor(doc) {
        this.doc = doc
        this.playerMapSum = {}
        this.gameIdMap = {}
        this.vaildGameIdArr = []
        this.gameInfoMap = {}
        for (let i = 0; i < doc.gameArr.length; i++) {
            let game = doc.gameArr[doc.gameArr.length - 1 - i]
            let info = game.info
            if (this.skipGame.indexOf(info.id) > -1 || game.gameArr.length == 0) {

            }
            else {
                let validGameArr = genValidGameArr(game.gameArr)
                this.gameIdMap[info.id] = validGameArr
                this.gameInfoMap[info.id] = info
                this.vaildGameIdArr.push(info.id)
            }
        }
    }

    mergeNext() {
        this.curVaildGameIdx++
        let gameId = this.vaildGameIdArr[this.curVaildGameIdx]
        this.curGameInfo = this.gameInfoMap[gameId]
        console.log('merge next', this.curVaildGameIdx);
        return this.mergeGameArr([gameId])
    }

    mergeGameArr(gameIdArr) {
        let playerMap
        let rankArr;
        let rankArrLast
        let finalFour;
        let rewardArr = [0, 0]
        if (this.rankMerge.length)
            rankArrLast = this.rankMerge
        let playerMapSum = this.playerMapSum
        for (let i = 0; i < gameIdArr.length; i++) {
            let gameId = gameIdArr[i];
            if (this.gameIdMap[gameId]) {
                let validGameArr = this.gameIdMap[gameId];
                finalFour = validGameArr.slice(validGameArr.length - 4)
                let info = this.gameInfoMap[gameId]
                playerMap = {}
                for (let validGame of validGameArr) {
                    let lScore = Number(validGame.left.score)
                    let rScore = Number(validGame.right.score)

                    let lPlayer = validGame.left
                    let rPlayer = validGame.right

                    let lPlayer2 = genPlayerActivity(info.id, lPlayer, lScore, rScore, rPlayer.player_id, playerMap)
                    let rPlayer2 = genPlayerActivity(info.id, rPlayer, rScore, lScore, lPlayer.player_id, playerMap)

                    let playerSum1 = genPlayerActivity(info.id, lPlayer, lScore, rScore, rPlayer.player_id, playerMapSum)
                    let playerSum2 = genPlayerActivity(info.id, rPlayer, rScore, lScore, lPlayer.player_id, playerMapSum)
                }
                // break;

                rankArr = sumGame(playerMap)
                // sumGame(playerMapSum)

                if (!rankArrLast)
                    rankArrLast = rankArr.concat()
                else {
                    // rankArrOld = this.rippleProp(rankArrOld, 'avgZen')
                    rankArrLast = mergeGame(rankArrLast, rankArr, playerMapSum)
                }
                //updateZenWeight
                for (let pActId in playerMap) {
                    let pAct: RKPlayer = playerMapSum[pActId]
                    sumPlayer(pAct)
                }
                for (let pActId in playerMap) {
                    let pAct: RKPlayer = playerMapSum[pActId]
                    // console.log('realWeight', pAct.name, pAct.realWeight);
                    this.topZenRealWeight = Math.max(this.topZenRealWeight || pAct.updateZenRealWeight(playerMapSum))
                }
                console.log('final four', finalFour);
                // }
            }
        }
        this.rankMerge = rankArrLast
        return rankArrLast
    }

    rippleProp(playerArr: Array<RKPlayer>, prop, step = 50) {
        let m = {}
        let maxAct = 0
        for (let i = 0; i < playerArr.length; i++) {
            let p: RKPlayer = playerArr[i];
            let propValue = Math.ceil(p[prop] / step) || 0
            // console.log('propValue',p[prop],propValue);
            if (!m[propValue])
                m[propValue] = []
            maxAct = Math.max(maxAct, propValue)
            m[propValue].push(p)
        }
        let pA = []
        for (let i = 0; i < maxAct; i++) {
            if (m[i + 1])
                pA = m[i + 1].concat(pA)
        }
        return pA
    }

    fixActivity(times) {
        // let a = []
        // for (let i = 0; i < this.rankMerge.length; i++) {
        //     let p: RKPlayer = this.rankMerge[i];
        //     if (p.activity > times - 1) {
        //         a.push(p)
        //     }
        // }
        // return a
        return this.layerRank()
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
            if (p.name.toLocaleLowerCase().search(n.toLocaleLowerCase()) > -1)
                console.log('player', p);
        }
    }


    hasPath(pid1, pid2, nodeNum) {
        let path = findWinPath(pid1, pid2, this.playerMapSum, 0)
        if (path && path.length) {
            logPath(path, this.playerMapSum)
            return true
        }
        return false
    }

    flowUpPlayer(topCount, times = 1) {
        //todo flow champion >1
        if (times > 3)
            return this.rippleProp(this.rankMerge, 'realWeight', 0.5)
        let playerArr: Array<RKPlayer> = this.rankMerge.slice(0, topCount)
        let exRW;
        // let needEx = false
        for (let p0 of playerArr) {
            p0.exRealWeight = 0
        }
        for (let p of playerArr)
            for (let op of playerArr) {
                if (p.player_id != op.player_id && p.champion > 0) {
                    let rank1 = findRankIn(p, this.rankMerge)
                    let rank2 = findRankIn(op, this.rankMerge)
                    if (rank1 > rank2) {
                        //todo 2 beatRaito>80% 换位
                        //低位是否赢过高位
                        if (!this.hasPath(p.player_id, op.player_id, 0)) {
                            if (!this.hasPath(p.player_id, op.player_id, 1)) {
                            }
                            else {
                                //up
                                exRW = p.exRealWeight
                                p.exRealWeight = Math.abs(p.realWeight - op.realWeight) * p.beatPlayerMap[op.player_id] * .2 / p.zenPlayerMap[op.player_id].length
                                p.exRealWeight *= (p.zenRealWeight / this.topZenRealWeight)
                                // if (exRW != p.exRealWeight)
                                //     needEx = true
                                console.log('need up 2', rank1, p.name, 'high', rank2, op.name);
                            }
                        }
                        else {
                            //up

                            exRW = p.exRealWeight
                            p.exRealWeight = Math.abs(p.realWeight - op.realWeight) * p.beatPlayerMap[op.player_id] / p.zenPlayerMap[op.player_id].length * .8
                            p.exRealWeight *= (p.zenRealWeight / this.topZenRealWeight)
                            // if (exRW != p.exRealWeight)
                            //     needEx = true
                            console.log('need up', rank1, p.name, 'high', rank2, op.name);
                        }
                    }
                }
            }
        // if (needEx) {
        this.rankMerge = this.rippleProp(this.rankMerge, 'realWeight', 1)
        return this.flowUpPlayer(topCount, times + 1)
    }
    updateBestRank() {
        for (let i = 0; i < this.rankMerge.length; i++) {
            let p = this.rankMerge[i]
            p.bestRanking = Math.min(p.bestRanking, i + 1)
        }
    }

    curVaildGameIdx = -1
    curGameInfo: any = {}
    merge(limit) {
        this.curVaildGameIdx = -1
        let playerMapSum = this.playerMapSum = {}
        for (let i = 0; i < limit; i++) {
            this.mergeNext()
        }
        return this.rankMerge
    }

    loadRank(playerArr) {
        let a = []
        for (let i = 0; i < playerArr.length; i++) {
            let p = playerArr[i];
            let rkp = new RKPlayer(p)
            rkp.load(p)
            a.push(rkp)
        }
        this.rankMerge = a
    }

    fixRankByRank(playerArr) {
        // let from = this.rankModel.rankMerge.indexOf(this.curPlayer)
        // arrMove(this.rankModel.rankMerge, from, Number(param) - 1)
        let a = []

        for (let i = 0; i < playerArr.length; i++) {
            let p = playerArr[i];
            let rkp = new RKPlayer(p)
            rkp.load(p)
            for (let j = 0; j < this.rankMerge.length; j++) {
                let curP: RKPlayer = this.rankMerge[j]
                if (curP.player_id == rkp.player_id) {
                    // let from = this.rankMerge.indexOf(curP)
                    console.log('move', p.name, j, i);
                    arrMove(this.rankMerge, j, i)
                    break;
                }
            }
            // break
            // a.push(rkp)
        }
    }

    layerRank() {
        let a1a2 = []//
        let a1c1 = []
        let a3 = []
        let a3c0 = []
        let layers = [a3, a1c1, a3c0, a1a2]
        for (let p of this.rankMerge) {
            if (p.activity < 3) {
                if (p.champion > 0)
                    a1c1.push(p)
                else {
                    a1a2.push(p)
                }
            }
            else {
                if (p.champion == 0)
                    a3c0.push(0)
                else
                    a3.push(p)
            }
        }
        a1a2 = a1a2.sort(descendingProp('avgReward'))

        //击败对手数
        // console.log('layer count a3', a3.length);
        a3 = arrRipple(a3, (item) => {
            return item.beatCount > 9
        })
        // console.log('layer count a3', a3.length);
        
        let layers2 = []
        for (let l of layers) {
            layers2 = layers2.concat(l)
        }
        this.rankMerge = layers2
        return this.rankMerge
    }
}