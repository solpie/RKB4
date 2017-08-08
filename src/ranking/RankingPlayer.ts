export class RKPlayer {
    player_id: string
    name: string
    gameIdMap = {}
    win = 0
    lastRank = 0 //最近排名
    beatPlayerMap = {}
    losePlayerMap = {} //绝对值越小差距越小
    section = 0 //1最高 ~5
    master = 0 //大师赛次数
    champion = 0 //冠军次数
    gameCount = 0


    ranking = 0
    activity: number = 0
    beatCount = 0
    beatRaito = 0
    constructor(playerData) {
        this.player_id = playerData.player_id
        this.name = playerData.name
    }

    get playerId() {
        return this.player_id
    }

    get avgZen() {
        let az = (this.beatRaito / this.beatCount) * .5 + this.activity * 2 + this.champion * .7
        return Math.floor(az * 100)
    }

    get winRaito() {
        return Math.floor(this.win/this.gameCount*100)+"%"
    }
}