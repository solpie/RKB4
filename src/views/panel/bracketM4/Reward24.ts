import { descendingProp } from '../../utils/JsFunc';
import { routeBracket24 } from "./Bracket24Route";

const winGroupReward: number = 2000
const loseGroupReward: number = 1000
const reward1: number = 50000
const reward2: number = 20000
const reward3: number = 10000
const reward4: number = 5000
export class RewardModel {

    static getReward(rec, lPlayer, rPlayer, isArr = false, playerDataMap = {}) {
        return RewardModel._getReward(rec, lPlayer, rPlayer, isArr, playerDataMap)
    }
    static _getReward(rec, lPlayer, rPlayer, isArr = false, playerDataMap) {
        let rData = routeBracket24(rec)
        let rewardPlayerMap = RewardModel.calcReward(rec, rData.winLoseMap)
        for (let k in rewardPlayerMap) {
            if (playerDataMap[k]) {
                let playerName = playerDataMap[k].hupuID
                let r1 = RewardModel.sumRewardArr(rewardPlayerMap[k])
                console.log('reward2', playerName,r1);
            }

        }
        let lRewardArr = rewardPlayerMap[lPlayer]
        let rRewardArr = rewardPlayerMap[rPlayer]
        if (isArr) {
            return [lRewardArr, rRewardArr]
        }
        else {
            let lSum = 0
            if (lRewardArr) {
                for (let r of lRewardArr) {
                    lSum += r
                }
            }
            let rSum = 0
            if (rRewardArr) {
                for (let r of rRewardArr) {
                    rSum += r
                }
            }
            return [lSum, rSum]
        }
    }
    static sumRewardArr(rewardArr) {
        let sum = 0
        for (let r of rewardArr) {
            sum += r
        }
        return sum
    }

    static calcReward(rec, winLoseMap) {
        let playerMap = {}
        let _calc = (winPlayer, gameIdx, losePlayer) => {
            if (!playerMap[winPlayer])
                playerMap[winPlayer] = []

            if (!playerMap[losePlayer])
                playerMap[losePlayer] = []

            let winRewardArr = playerMap[winPlayer]
            let loseRewardArr = playerMap[losePlayer]

            if (gameIdx > 0) {
                if (gameIdx == 62) {
                    winRewardArr.push(reward1)
                    loseRewardArr.push(reward2)
                }
                else {
                    if (gameIdx == 61) {
                        loseRewardArr.push(reward3)
                    }
                    if (gameIdx == 59) {
                        loseRewardArr.push(reward4)
                    }
                    if (winLoseMap[gameIdx])
                        winRewardArr.push(winGroupReward)
                    else
                        winRewardArr.push(loseGroupReward)
                }

            }
        }
        for (let i = 0; i < 62; i++) {
            let gameIdx = i + 1
            let r = rec[i + 1]

            let lScore = r.score[0]
            let rScore = r.score[1]
            // console.log('reward idx', gameIdx);

            if (lScore != 0 || rScore != 0) {
                if (lScore > rScore) {
                    _calc(r.player[0], gameIdx, r.player[1])
                }
                else {
                    _calc(r.player[1], gameIdx, r.player[0])
                }
            }
        }
        let sum = 0
        for (let k in playerMap) {
            let rewardArr = playerMap[k]
            let playerSum = 0
            for (let r of rewardArr) {
                sum += r
                playerSum += r
            }
            // console.log('total reward ', k, playerSum);
        }
        console.log('total reward ', sum);
        return playerMap
    }

    static final4Reward(rec, playerDataMap, data) {
        let rArr = RewardModel.getReward(rec, 'p1', 'p2', false,playerDataMap)

        return rArr
    }
    static final4Reward2(rec, playerDataMap, data) {
        let playerArr1 = rec['59'].player
        let playerArr2 = rec['60'].player
        let rewardArr1 = this.getReward(rec, playerArr1[0], playerArr1[1])
        let rewardArr2 = this.getReward(rec, playerArr2[0], playerArr2[1])
        let playerArr = [
            { player: playerArr1[0], reward: rewardArr1[0], data: null },
            { player: playerArr1[1], reward: rewardArr1[1], data: null },
            { player: playerArr2[0], reward: rewardArr2[0], data: null },
            { player: playerArr2[1], reward: rewardArr2[1], data: null },
        ]
        playerArr = playerArr.sort(descendingProp('reward'))
        data.text = ''
        data.visible = true
        for (let p of playerArr) {
            p.data = playerDataMap[p.player]
            data.text += `${p.data.hupuID} :￥${p.reward / 1000},000       `
        }
        return playerArr
    }
}