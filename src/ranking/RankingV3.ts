import { RKPlayer } from "./RankingPlayer";
import { genValidGameArr } from "./RankingMerge";
import { descendingProp } from "../views/utils/JsFunc";
import { arrRipple } from "./com";

export class RankingV3 {
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