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
    new _f('2525', FixAction.BEFORE, "4"),//lgy before 郝天佶
    new _f('753', FixAction.AFTER, "4"),//Li_DD after 郝天佶
    new _f('1213', FixAction.AFTER, "753"),//安云鹏 after Li_DD
    new _f('9931', FixAction.WIN, "753"),//孙胖 win Li_DD
    new _f('7184', FixAction.FIX, "9"),//Gyoung fix 9
    new _f('4250', FixAction.AFTER, "574"),//蔡炜少年 after 军哥
    new _f('1230', FixAction.AFTER, "574"),//林瑞宏ail same with 军哥
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
    console.log('lose to', player.losePlayerMap);
    console.log('win to', player.beatPlayerMap);

    for (let pid in player.losePlayerMap) {
        let lp: RKPlayer = playerMap[pid]
        if (lp) {
            let lpIdx = rankPlayerArr.indexOf(lp)
            console.log('lose to', lp.name, lpIdx);
            colorMap[pid] = { color: 'red' }
        }
    }
    for (let pid in player.beatPlayerMap) {
        let wp: RKPlayer = playerMap[pid]
        if (wp) {
            let wpIdx = rankPlayerArr.indexOf(wp)
            console.log('win', wp.name, wpIdx);
            if (player.losePlayerMap[pid])
                colorMap[pid] = { color: 'yellow' }
            else
                colorMap[pid] = { color: 'green' }
        }
    }

    for (let i = 0; i < fixS2.length; i++) {
        let fa: FixAction = fixS2[i];
        if (fa.player_id == player.player_id) {
            // if()

        }
    }
    return colorMap
}
