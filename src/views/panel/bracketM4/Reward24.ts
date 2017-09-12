const winGroupReward: number = 2000
const loseGroupReward: number = 1000
const reward1: number = 50000
const reward2: number = 20000
const reward3: number = 10000
const reward4: number = 5000
export class RewardModel {


    static calcReward(rec, winLoseMap) {
        let playerMap = {}
        let _calc = (winPlayer, gameIdx, losePlayer) => {
            if (!playerMap[winPlayer])
                playerMap[winPlayer] = []

            if (!playerMap[losePlayer])
                playerMap[losePlayer] = []

            let winRewardArr = playerMap[winPlayer]
            let loseRewardArr = playerMap[losePlayer]

            if (gameIdx > 16) {
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
            console.log('reward idx', gameIdx);

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
            for (let r of rewardArr) {
                sum += r
            }
        }
        console.log('total reward ', sum);
        return playerMap
    }
}