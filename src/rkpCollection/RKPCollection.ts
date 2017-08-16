import { findRankIn } from '../ranking/com';
import { ascendingProp, descendingProp } from '../views/utils/JsFunc';
import { CollectionPlayer, User } from './CollectionPlayer';
export class RKPCollectionModel {
    rewardTop = 500
    rewardStep = 10
    week = 7

    tongzhiRanking: Array<CollectionPlayer>;
    heimaRanking: Array<CollectionPlayer>;
    tuLongRanking: Array<CollectionPlayer>;
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
            p.lastRanking = findRankIn(player_data, rankPlayerArr) + 1
            p.setRewardFactor()
        }
        return playerMap[player_data.player_id]
    }
    startBattle(gameDataArr, rankPlayerArr) {
        let playerMap = {}
        for (let gd of gameDataArr) {
            let info = gd.info
            for (let validGame of gd.gameArr) {
                let lScore = Number(validGame.left.score)
                let rScore = Number(validGame.right.score)

                let lPlayer = validGame.left
                let rPlayer = validGame.right

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
            r.push(playerMap[pid])
        }
        r = r.sort(ascendingProp('vHeima'))
        return r
    }

    genTuLong(playerMap) {
        let r = []
        for (let pid in playerMap) {
            r.push(playerMap[pid])
        }
        r = r.sort(descendingProp('vTuLong'))
        return r
    }
}