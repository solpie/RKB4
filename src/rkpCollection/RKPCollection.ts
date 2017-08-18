import { getPlayerInfo } from '../views/utils/HupuAPI';
import { countMap, findRankIn } from '../ranking/com';
import { ascendingProp, descendingProp } from '../views/utils/JsFunc';
import { CollectionPlayer } from './CollectionPlayer';
import { firstBy } from "../views/admin/livedata/thenBy";
export class RKPCollectionModel {
    rewardTop = 500
    rewardStep = 10
    week = 3

    tongzhiRanking: Array<CollectionPlayer>;
    heimaRanking: Array<CollectionPlayer> = [];
    tuLongRanking: Array<CollectionPlayer> = [];
    masterConRanking: Array<CollectionPlayer>;

    rewardPlayerMap = {}
    activityPlayerMap = {}
    sectionCountArr = [0, 0, 0, 0, 0]
    qualityCountArr = [0, 0, 0, 0, 0]

    playerDataMap = {}
    constructor() {

    }

    setGameArr(gameArr) {

    }

    genPlayerMapSum(gameId, player, myScore, opScore, opPlayer, savePlayerMap) {
        if (player.player_id) {
            let p: CollectionPlayer = savePlayerMap[player.player_id]
            p.pushActivity(gameId, myScore, opScore, opPlayer)
            return p
        }
        return null
    }

    genPlayer(player_data, playerMap, rankPlayerArr): CollectionPlayer {
        if (!playerMap[player_data.player_id]) {
            playerMap[player_data.player_id] = new CollectionPlayer(player_data)
            let p: CollectionPlayer = playerMap[player_data.player_id]
            if (!this.playerDataMap[p.player_id]) {
                this.playerDataMap[p.player_id] = p
                getPlayerInfo(p.player_id, res => {
                    // console.log('data', res);
                    this.playerDataMap[p.player_id].age = res.data.age
                    // this.playerDataMap[p.player_id] = res
                })
            }
            p.lastRanking = findRankIn(player_data, rankPlayerArr) + 1
            p.setRewardFactor()
        }
        return playerMap[player_data.player_id]
    }

    startBattle(gameDataArr, rankPlayerArr) {
        this.sectionCountArr = []
        this.rewardPlayerMap = {}
        let playerMap = {}
        for (let gd of gameDataArr) {
            let info = gd.info
            for (let pid in playerMap) {
                let cPlayer: CollectionPlayer = playerMap[pid]
                cPlayer.curWinCount = cPlayer.curLoseCount = 0
                cPlayer.hasMasterCon = false
            }
            for (let validGame of gd.gameArr) {
                let lScore = Number(validGame.left.score)
                let rScore = Number(validGame.right.score)

                let lPlayer = validGame.left
                let rPlayer = validGame.right
                // console.log('lp',lPlayer);
                // lPlayer.ranking = findRankIn(lPlayer, rankPlayerArr) + 1
                // rPlayer.ranking = findRankIn(rPlayer, rankPlayerArr) + 1

                let lCPlayer: CollectionPlayer = this.genPlayer(lPlayer, playerMap, rankPlayerArr)
                let rCPlayer: CollectionPlayer = this.genPlayer(rPlayer, playerMap, rankPlayerArr)

                this.genPlayerMapSum(info.id, lPlayer, lScore, rScore, rCPlayer, playerMap)
                this.genPlayerMapSum(info.id, rPlayer, rScore, lScore, lCPlayer, playerMap)
            }
        }
        console.log('playerMap', playerMap, rankPlayerArr.length);
        this.tongzhiRanking = this.genTongzhiRank(playerMap)
        this.heimaRanking = this.genHeimaRank(playerMap)
        this.tuLongRanking = this.genTuLong(playerMap)
        this.masterConRanking = this.genMasterCon(playerMap)
        this.setRewardPlayer(this.tongzhiRanking)
        this.setRewardPlayer(this.heimaRanking)
        this.setRewardPlayer(this.tuLongRanking)
        this.setRewardPlayer(this.masterConRanking)
        // for (let i = 0; i < userArr.length; i++) {
        //     let u: User = userArr[i];
        //     for (let pid in u.playerIdMap) {
        //         let c: CollectionPlayer = u.playerIdMap[pid]
        //         if (c.type == CollectionPlayer.POS_1) {

        //         }
        //         else if (c.type == CollectionPlayer.POS_2) {

        //         }
        //         else if (c.type == CollectionPlayer.POS_3) {

        //         }
        //         else if (c.type == CollectionPlayer.POS_4) {

        //         }
        //         else if (c.type == CollectionPlayer.POS_5) {

        //         }
        //     }
        //     // for(let i = 0;i<.length;i++){
        //     // let  = [i];
        //     // }
        // }
        this.activityPlayerMap = playerMap
        this.countSectionArr(playerMap)
    }

    countSectionArr(playerMap) {
        let sectionCountArr = [0, 0, 0, 0, 0]
        for (let pid in playerMap) {
            let cp: CollectionPlayer = playerMap[pid]
            if (cp.section != 0) {
                sectionCountArr[cp.section - 1]++
            }
        }
        let a = [0, 0, 0, 0, 0]
        a[0] += sectionCountArr[4] + sectionCountArr[3] + sectionCountArr[2] + sectionCountArr[1]
        a[1] += sectionCountArr[4] + sectionCountArr[3] + sectionCountArr[2]
        a[2] += sectionCountArr[4] + sectionCountArr[3]
        a[3] += sectionCountArr[4]

        a[0] += sectionCountArr[0]
        a[1] += sectionCountArr[1]
        a[2] += sectionCountArr[2]
        a[3] += sectionCountArr[3]
        a[4] += sectionCountArr[4]
        this.sectionCountArr = sectionCountArr
        this.qualityCountArr = a
    }

    setRewardPlayer(playerArr: Array<CollectionPlayer>) {
        let r = playerArr.slice(0, 50)
        for (let p of r) {
            if (!this.rewardPlayerMap[p.player_id])
                this.rewardPlayerMap[p.player_id] = p
        }
    }
    get rewardPlayerCount() {
        return countMap(this.rewardPlayerMap)
    }
    get activePlayerCount() {
        return countMap(this.activityPlayerMap)
    }

    genTongzhiRank(playerMap) {
        let r = []
        for (let pid in playerMap) {
            r.push(playerMap[pid])
        }
        r = r.sort(descendingProp('vTongZhiLi'))
        return r
    }

    genHeimaRank(playerMap) {
        let r = []
        for (let pid in playerMap) {
            let cP: CollectionPlayer = playerMap[pid]
            if (cP.vHeima != 0) {
                r.push(playerMap[pid])
            }
        }
        r = r.sort(ascendingProp('vHeima'))
        return r
    }

    genTuLong(playerMap) {
        let r = []
        for (let pid in playerMap) {
            let cP: CollectionPlayer = playerMap[pid]
            if (cP.vTuLong != 0) {
                r.push(playerMap[pid])
            }
        }
        r = r.sort(descendingProp('vTuLong'))
        return r
    }

    genMasterCon(playerMap) {
        let r = []
        for (let pid in playerMap) {
            r.push(playerMap[pid])
        }
        r = r.sort(firstBy(function (v1, v2) { return v2.masterCon - v1.masterCon; })
            .thenBy(function (v1, v2) { return v2.vTongZhiLi - v1.vTongZhiLi; })
        )
        return r
    }
    //
}