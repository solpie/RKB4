export class RankingView {
    lastRanking = [{ name: '11', champion: 1, activity: 2, ranking: 1 }]
    constructor() {

    }
    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }
}