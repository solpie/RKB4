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
    master = 0 //大师赛次数
    champion = 0 //冠军次数
    gameCount = 0


    ranking = 0
    activity: number = 0
    beatCount = 0
    beatRaito = 0
    rankInRecArr: Array<RankInRec> = []
    constructor(playerData) {
        this.player_id = playerData.player_id
        this.name = playerData.name
    }

    get playerId() {
        return this.player_id
    }

    get avgZen() {
        let zenSum = 0
        for (let p in this.zenPlayerMap) {
            let zenArr = this.zenPlayerMap[p]
            let zenSumOp = 0
            for (let zen of zenArr) {
                zenSumOp += zen
            }
            zenSumOp = zenSumOp / zenArr.length
            zenSum += zenSumOp
        }

        let az = (zenSum / this.beatCount)
        // + (this.champion / this.activity) * .9
        return az
        // return Math.floor(az * 100)
    }

    get championRaito() {
        // if()
        return this.champion / this.activity
    }

    get realWeight() {
        let winRatioPow2 = this.winRaito * this.winRaito
        if (this.champion > 0)
            return winRatioPow2 * this.championRaito * .9 * this.avgZen * this.activity + this.champion * .2
        return winRatioPow2 * .02 * this.avgZen * this.activity + this.champion * .2
    }

    get winRaito() {
        return this.win / this.gameCount
    }

    pushActivity(gameId, myScore, opScore, opPlayerId) {
        let isFinal = (myScore == 5 || opScore == 5)
        let isMaster = (myScore == 3 || opScore == 3)
        let isRaw = (myScore == 2 || opScore == 2)
        let isWin = myScore > opScore
        let wp = 0.5
        if (isMaster)
            wp = 0.7
        else if (isFinal)
            wp = 1
        let playerData = this
        playerData.gameCount++;
        playerData.gameIdMap[gameId] = gameId
        if (isWin) {
            playerData.win++;
            let zen = (myScore - opScore) / myScore * wp
            if (!playerData.beatPlayerMap[opPlayerId])
                playerData.beatPlayerMap[opPlayerId] = 0
            playerData.beatPlayerMap[opPlayerId] += zen

            if (!this.zenPlayerMap[opPlayerId])
                this.zenPlayerMap[opPlayerId] = []
            this.zenPlayerMap[opPlayerId].push(zen)

            if (isFinal)
                playerData.champion++;
            if (isMaster)
                playerData.master++;
        } else {
            if (!playerData.losePlayerMap[opPlayerId])
                playerData.losePlayerMap[opPlayerId] = 0
            playerData.losePlayerMap[opPlayerId] += (myScore - opScore) / opScore * wp
        }
        return playerData
    }
}