import { countMap } from '../ranking/com';
import { RKPlayer } from '../ranking/RankingPlayer';
export class CollectionPlayer {
    static POS_1 = '统帅'
    static POS_2 = '黑马'
    static POS_3 = '屠龙高手'
    static POS_4 = '勋章狂魔'
    static POS_5 = '青年军'
    name = ''
    player_id = ''
    height = 0
    weight = 0
    age = 0
    lastRanking = 0//from 1
    win = 0

    gameIdMap = {}
    get activity() {
        return countMap(this.gameIdMap)
    }

    activity2 = 0

    section = 0//1~5
    meetPlayerMap = {}
    get meetCount() {
        return countMap(this.meetPlayerMap)
    }
    // get section() {
    //     let n;
    //     if(this.lastRanking)
    //     return n
    // }
    type = ''//
    get vTongZhiLi() {
        return this.winScore / this.loseScore
    }
    loseScore = 0
    winScore = 0

    curWinCount = 0//每轮清空
    curLoseCount = 0

    hasMasterCon = false
    masterCon = 0

    _sumHeima = 0
    get vHeima() {
        return this._sumHeima / this.activity
    }

    _sumTuLong = 0
    get vTuLong() {
        return this._sumTuLong / this.activity
    }
    // get section() {
    //     if(this.lastRanking>300)
    //     {
    //         return = 1
    //         }
    // }
    rewardFactor = 1//max
    vXunZhang = 0
    vYoung = 0
    cast = 0//工资 1-5

    constructor(player) {
        this.name = player.name
        this.age = player.age
        this.player_id = player.player_id
        this.height = Number(player.height)
        this.weight = Number(player.weight)
    }

    setRewardFactor() {
        if (this.lastRanking > 300) {
            this.rewardFactor = 1
        }
        else if (this.lastRanking > 100) {
            this.rewardFactor = 2
        }
        else if (this.lastRanking > 30) {
            this.rewardFactor = 3
        }
        else if (this.lastRanking > 5) {
            this.rewardFactor = 4
        }
        else if (this.lastRanking > 0) {
            this.rewardFactor = 5
        }
        this.section = this.rewardFactor
    }

    pushActivity(gameId, myScore, opScore, opPlayer: CollectionPlayer) {
        let isFinal = (myScore == 5 || opScore == 5)
        let isMaster = (myScore == 3 || opScore == 3)
        let isRaw = (myScore == 2 || opScore == 2)
        let isWin = myScore > opScore


        this.loseScore += opScore
        this.winScore += myScore
        this.gameIdMap[gameId] = gameId
        if (!this.meetPlayerMap[opPlayer.player_id]) {
            this.meetPlayerMap[opPlayer.player_id] = opPlayer
        }
        if (isMaster) {
            if (this.curWinCount - this.curLoseCount == 1 && this.curLoseCount > 1) {
                // if(this.masterCon<this.activity)
                //     this.
                if (!this.hasMasterCon) {
                    this.hasMasterCon = true
                    this.masterCon++
                }
            }
            // console.log('master con', this);
        }
        if (isWin) {
            this.curWinCount++
            if (opPlayer.lastRanking != 0 && opPlayer.lastRanking < this.lastRanking)
                this._sumHeima += (opPlayer.lastRanking - this.lastRanking)
            if (opPlayer.height > this.height)
                this._sumTuLong += (opPlayer.height - this.height)
        }
        else {
            this.curLoseCount++
        }
    }
}

