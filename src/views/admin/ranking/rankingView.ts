import { checkRelation } from '../../../ranking/FixRalation';
import { arrMove } from '../../../ranking/com';
import { saveDoc } from '../livedata/BaseGame';
import { findWinPath, logPath, findWinPath2 } from '../../../ranking/PlayerRelation';
import { RKPlayer } from '../../../ranking/RankingPlayer';
import { MergeRank } from '../../../ranking/RankingMerge';
import { $get, $post } from '../../utils/WebJsFunc';
export class RankingView {
    lastRanking: Array<RKPlayer> = []
    lastPlayerRanking: Array<RKPlayer> = []
    lastGameidx = 0
    mergeRank: MergeRank
    relationArr = []
    inputLimit = 2
    inputQuery = 2
    gameInfo = {}
    curPlayer: any = { name: '' }
    rowColorMap = {}
    constructor() {
        $get('/ranking/', res => {
            console.log('get game doc', res);
            this.mergeRank = new MergeRank(res.doc)
            let limit = 1
            this.lastRanking = this.viewRank(this.mergeRank.merge(limit))
        })
    }
    //第250站 403 2017-07-15 :东莞-第238站 
    reMergeRank(limit) {
        let a = this.mergeRank.merge(limit)
        this.mergeRank.flowUpPlayer(Math.min(a.length, 50))
        this.mergeRank.updateBestRank()
        this.lastRanking = this.viewRank(this.mergeRank.rankMerge)
    }

    mergeNext() {
        let a = this.mergeRank.mergeNext()
        this.mergeRank.flowUpPlayer(Math.min(a.length, 50))
        this.mergeRank.updateBestRank()
        this.lastRanking = this.viewRank(this.mergeRank.rankMerge)
    }

    viewRank(playerArr) {
        // this.lastPlayerRanking = playerArr
        this.gameInfo = this.mergeRank.curGameInfo
        this.lastGameidx = this.mergeRank.curVaildGameIdx
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
        let a = this.mergeRank.fixActivity()
        // this.lastRanking = a
        console.log('fixactivity', a);
        this.lastRanking = this.viewRank(a)

    }

    showRelation(topCount) {
        // this.lastRanking = this.mergeRank.flowUpPlayer(Number(topCount))
        this.relationArr.length = 0
        console.log('showRelation');
        let playerArr = this.inputRelationPlayerArr
        // if (playerArr[0].player_id && playerArr[1].player_id) {
        let path = []
        findWinPath2(playerArr[0].player_id, playerArr[1].player_id, this.mergeRank.playerMapSum,
            1, [], path)
        // console.log('path', path);
        for (let i = 0; i < path.length; i++) {
            let p = path[i];
            logPath(p, this.mergeRank.playerMapSum)
        }
        path = []
        findWinPath2(playerArr[0].player_id, playerArr[1].player_id, this.mergeRank.playerMapSum,
            0, [], path)
        // console.log('path', path);
        for (let i = 0; i < path.length; i++) {
            let p = path[i];
            logPath(p, this.mergeRank.playerMapSum)
        }
        // let path1 = findWinPafindWinPath2th(playerArr[0].player_id, playerArr[1].player_id, this.mergeRank.playerMapSum, 1)
        // let ps0 = logPath(path, this.mergeRank.playerMapSum)
        // let ps1 = logPath(path1, this.mergeRank.playerMapSum)

        // if (ps0)
        //     this.relationArr.push(ps0)
        // if (ps1)
        //     this.relationArr.push(ps1)
        // }

    }

    queryPlayer(n) {
        this.mergeRank.queryPlayerIdByName(n)
    }
    inputRelationPlayerArr: Array<any> = [{ name: 'p1' }, { name: 'p2' }]

  
    setRelation(row) {
        let p: RKPlayer = row
        this.curPlayer = row
        this.rowColorMap = checkRelation(this.curPlayer,this.mergeRank.rankMerge)
        // if (this.inputRelationPlayerArr.length < 2)
        // {
        //     this.inputRelationPlayerArr.push(p)
        // }
        // else {
        this.inputRelationPlayerArr.shift()
        this.inputRelationPlayerArr.push(p)
        // }
        console.log('row', p.name);
    }

    saveRank(season) {
        let doc = { idx: season, rankArr: [] }
        let rankArr = this.mergeRank.rankMerge
        let p: RKPlayer
        for (let i = 0; i < rankArr.length; i++) {
            p = rankArr[i];
            doc.rankArr.push(p.toDoc())
        }
        // console.log('toDoc',p.toDoc());
        $post('/ranking/update/' + season, doc, (res) => {
            console.log('ranking update', res);
        })
    }

    loadRank(season) {
        $get('/ranking/find/' + season, res => {
            this.mergeRank.loadRank(res.doc.rankArr)
            this.lastRanking = this.viewRank(this.mergeRank.rankMerge)
            console.log('load rank ', res, this.mergeRank.rankMerge);
        })
    }

    fixRank(season) {

    }

    rankMove(dir) {
        let r = this.mergeRank.rankMerge
        let curIdx = r.indexOf(this.curPlayer)
        if (curIdx > -1) {
            this.mergeRank.rankMerge = arrMove(this.mergeRank.rankMerge, curIdx, curIdx + dir)
            this.lastRanking = this.viewRank(this.mergeRank.rankMerge)
        }
    }

    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }
}