import { findWinPath } from '../../../ranking/PlayerRelation';
import { RKPlayer } from '../../../ranking/RankingPlayer';
import { MergeRank } from '../../../ranking/RankingMerge';
import { $get } from '../../utils/WebJsFunc';
export class RankingView {
    lastRanking: Array<RKPlayer> = []
    lastPlayerRanking: Array<RKPlayer> = []
    mergeRank: MergeRank
    inputLimit = 2
    inputQuery = 2
    constructor() {
        $get('/ranking/', res => {
            console.log('get game doc', res);
            this.mergeRank = new MergeRank(res.doc)
            let limit = 1
            this.lastRanking = this.viewRank(this.mergeRank.merge(limit))
        })
    }

    reMergeRank(limit) {
        this.lastRanking = this.viewRank(this.mergeRank.merge(limit))
    }

    viewRank(playerArr) {
        this.lastPlayerRanking = playerArr
        let a = []
        for (let i = 0; i < Math.min(playerArr.length, 100); i++) {
            let p: RKPlayer = playerArr[i];
            p.ranking = i + 1
            p.name = p.name.substring(0, 6)
            p['beatRaitoStr'] = Math.floor(p.beatRaito * 100) / 100
            a.push(p)
        }
        return a
    }

    fixActivity() {
        // this.lastRanking = this.mergeRank.fixRankByActivity(this.lastRanking)
        let a = this.lastPlayerRanking
        a = this.mergeRank.rippleProp(a, 'realWeight', 0.5)
        // a = this.mergeRank.rippleProp(a, 'beatCount')
        // a = this.mergeRank.rippleProp(a, 'activity')
        this.lastRanking = a
    }

    mergeNext() {
        this.lastRanking = this.mergeRank.mergeNext()
    }

    showRelation(topCount) {
        this.lastRanking = this.mergeRank.flowUpPlayer(Number(topCount))
    }

    queryPlayer(n) {
        this.mergeRank.queryPlayerIdByName(n)
    }

    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }
}