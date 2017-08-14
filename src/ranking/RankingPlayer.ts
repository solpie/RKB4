import { countMap } from './com';
class RankInRec {
    gameIdx = 0
    opPlayerId = 0
}
export class RKPlayer {
    player_id: string
    name: string
    gameIdMap = {}
    win = 0
    lastRank = 0 //最近排名
    beatPlayerMap = {}
    zenPlayerMap = {}//p
    losePlayerMap = {} //绝对值越小差距越小
    section = 0 //1最高 ~5
    bestRanking = 99999
    master = 0 //大师赛次数
    champion = 0 //冠军次数
    runnerUp = 0 //亚军次数
    reward = 0//奖金 3月6前冠军两千
    gameCount = 0


    ranking = 0
    activity: number = 0
    beatCount = 0
    beatRaito = 0
    rankInRecArr: Array<RankInRec> = []

    exRealWeight = 0
    constructor(playerData) {
        this.player_id = playerData.player_id
        this.name = playerData.name
    }

    load(playerDoc) {
        for (let k in playerDoc) {
            this[k] = playerDoc[k]
        }
    }
    get playerId() {
        return this.player_id
    }

    toDoc() {
        let doc = JSON.parse(JSON.stringify(this))
        delete doc['rankInRecArr']
        delete doc['exRealWeight']
        delete doc['_zenRealWeight']
        delete doc['lastRank']
        return doc
    }

    get avgZen() {
        let zenSum = 0
        let zenSumOp = 0

        for (let p in this.zenPlayerMap) {
            let zenArr = this.zenPlayerMap[p]
            if (zenArr.length) {
                zenSumOp = 0
                for (let zen of zenArr) {

                    zenSumOp += zen
                }
                if (zenSumOp)
                    zenSumOp = zenSumOp / zenArr.length
                zenSum += zenSumOp
            }
        }
        if (zenSum > 0) {
            // console.log(this.name, zenSum, 'beatCount', this.beatCount,'zen count',countMap(this.zenPlayerMap));
            return zenSum / countMap(this.zenPlayerMap)
        }
        // + (this.champion / this.activity) * .9
        return 0
        // return Math.floor(az * 100)
    }

    get championRaito() {
        // if()
        if (this.champion)
            return this.champion / this.activity
        return 0
    }

    get realWeight() {
        // console.log(this.name, 'realWeight get', this.championRaito, this.winRaito, this.avgZen);
        let winRatioPow2 = this.winRaito * this.winRaito
        if (this.champion > 0)
            return winRatioPow2 * this.championRaito * .9 * this.avgZen * this.activity + this.champion * .2 + this.exRealWeight
        return winRatioPow2 * .2 * this.avgZen * this.activity + this.champion * .2 + this.exRealWeight
    }

    get exZenRealWeight() {
        return this.zenRealWeight + this.realWeight
    }

    _zenRealWeight = 0
    get zenRealWeight() {
        return this._zenRealWeight
    }

    updateZenRealWeight(playerMap) {
        let sum = 0
        for (let pid in this.beatPlayerMap) {
            let p: RKPlayer = playerMap[pid]
            // if (p.realWeight)
            sum += p.realWeight
            // if (this.player_id == '4')
            //     console.log(this.name,'updateZenRealWeight', this.realWeight, p.name, p.realWeight);
        }
        this._zenRealWeight = sum
        // console.log('updateZenRealWeight',this.name,sum);
        return sum
    }

    get winRaito() {
        if (this.win)
            return this.win / this.gameCount
        return 0
    }

    pushActivity(gameId, myScore, opScore, opPlayerId) {
        let isFinal = (myScore == 5 || opScore == 5)
        let isMaster = (myScore == 3 || opScore == 3)
        let isRaw = (myScore == 2 || opScore == 2)
        let isWin = myScore > opScore
        let wp = 0.5

        let rewardArr;
        if (isFinal) {
            if (Number(gameId) < 148) {
                rewardArr = [2000, 0]
            }
            else {
                let rewardYa = Math.min(myScore, opScore) * 200
                rewardArr = [2600 - rewardYa, rewardYa]
            }
        }

        if (isMaster)
            wp = 0.7
        else if (isFinal)
            wp = 1
        let playerData = this
        playerData.gameCount++;
        playerData.gameIdMap[gameId] = gameId
        let zen
        if (isWin) {
            playerData.win++;
            zen = (myScore - opScore) / myScore * wp
            if (!playerData.beatPlayerMap[opPlayerId])
                playerData.beatPlayerMap[opPlayerId] = 0
            playerData.beatPlayerMap[opPlayerId] += zen


            if (isFinal) {
                playerData.reward += rewardArr[0]
                playerData.champion++;
            }
            if (isMaster)
                playerData.master++;
        } else {
            if (!playerData.losePlayerMap[opPlayerId])
                playerData.losePlayerMap[opPlayerId] = 0
            zen = (myScore - opScore) / opScore * wp
            playerData.losePlayerMap[opPlayerId] += zen
            if (isFinal) {
                playerData.runnerUp++
                playerData.reward += rewardArr[1]
            }
        }
        if (!this.zenPlayerMap[opPlayerId])
            this.zenPlayerMap[opPlayerId] = []
        this.zenPlayerMap[opPlayerId].push(zen)
        return playerData
    }
}