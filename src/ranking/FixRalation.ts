//id1xid2    小的在前
//            正值为强
import { RKPlayer } from "./RankingPlayer";

export const fixRelation = {
    '4x2525': -1.2//郝天吉 x lgy
}
export class FixAction {
    static FIX = 'fixed'//ripple to param
    static AFTER = 'after'//after param
    static BEFORE = 'before'//before  param
    static WIN = 'win'//get param realweight 
    static SAME = 'same type'//same type with param
    player_id = "0"
    action = 'fixed'
    param: any
    constructor(player_id, action, param) {
        this.player_id = player_id
        this.action = action
        this.param = param
    }
}
const _f = FixAction
export const fixS2 = [
    new _f('2525', FixAction.FIX, "0"),//lgy 
    new _f('753', FixAction.AFTER, "4"),//Li_DD after 郝天佶
    new _f('1213', FixAction.AFTER, "753"),//安云鹏 after Li_DD
    new _f('9931', FixAction.SAME, "753"),//孙胖 same Li_DD
    new _f('7184', FixAction.FIX, "9"),//Gyoung fix 9
    new _f('4250', FixAction.AFTER, "574"),//蔡炜少年 after 军哥
    new _f('1230', FixAction.AFTER, "574"),//林瑞宏ail same with 军哥
    new _f('3536', FixAction.FIX, "15"),//大霖哥666
]
export const fixRankingS2 = [
    '2525',//lgy
    '4',//	郝天佶
    '753',//Li_DD
    '1213',//安云鹏
    '9931',//孙胖
    '7184',//Gyoung
]
export const checkRelation = (player: RKPlayer, rankPlayerArr: Array<RKPlayer>) => {
    let colorMap = {}
    let playerMap = {}
    for (let p of rankPlayerArr) {
        playerMap[p.player_id] = p
    }


    let myIdx = rankPlayerArr.indexOf(player)
    let sumZenMap = {}
    let sum
    for (let pid in player.zenPlayerMap) {
        pid = pid + ''
        let beatRaitoArr = player.zenPlayerMap[pid]
        sum = 0
        // console.log('zen ',pid,beatRaitoArr);
        for (let i = 0; i < beatRaitoArr.length; i++) {
            let b = beatRaitoArr[i];
            sum += b
        }
        sumZenMap[pid] = sum
    }
    // console.log('zen map', player.name, sumZenMap, colorMap);
    for (let i = 0; i < fixS2.length; i++) {
        let fa: FixAction = fixS2[i];
        if (fa.player_id == player.player_id) {
            // if()

        }
    }
    return sumZenMap
}
