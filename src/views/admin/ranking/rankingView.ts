import { CollectionView } from './collectionView';
import { CollectionPlayer } from '../../../rkpCollection/CollectionPlayer';
import { checkRelation, FixAction } from '../../../ranking/FixRalation';
import { arrMove } from '../../../ranking/com';
import { saveDoc } from '../livedata/BaseGame';
import { findWinPath, logPath, findWinPath2 } from '../../../ranking/PlayerRelation';
import { RKPlayer } from '../../../ranking/RankingPlayer';
import { RankModel } from '../../../ranking/RankingMerge';
import { $get, $post } from '../../utils/WebJsFunc';

const collectionView = new CollectionView()

export class RankingView {
    lastRanking: Array<RKPlayer> = []
    lastPlayerRanking: Array<RKPlayer> = []
    lastGameidx = 0
    rankModel: RankModel
    relationArr = []
    inputLimit = 2
    inputQuery = 2
    gameInfo = {}
    curPlayer: any = { name: '' }
    rowColorMap = {}
    $vm: any
    lastTongzhiRanking: Array<CollectionPlayer> = []
    constructor() {
        $get('/ranking/', res => {
            console.log('get game doc', res);
            this.rankModel = new RankModel(res.doc)
            let limit = 1
            this.lastRanking = this.viewRank(this.rankModel.merge(limit))
        })
    }
    //第250站 403 2017-07-15 :东莞-第238站 
    reMergeRank(limit) {
        let a = this.rankModel.merge(limit)
        this.rankModel.flowUpPlayer(Math.min(a.length, 50))
        this.rankModel.updateBestRank()
        this.lastRanking = this.viewRank(this.rankModel.rankMerge)
    }

    mergeNext() {
        let a = this.rankModel.mergeNext()
        this.rankModel.flowUpPlayer(Math.min(a.length, 50))
        this.rankModel.updateBestRank()
        this.lastRanking = this.viewRank(this.rankModel.rankMerge)
    }

    viewRank(playerArr) {
        // this.lastPlayerRanking = playerArr
        this.gameInfo = this.rankModel.curGameInfo
        this.lastGameidx = this.rankModel.curVaildGameIdx
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

    fixActivity(times) {
        // this.lastRanking = this.mergeRank.fixRankByActivity(this.lastRanking)
        let a = this.rankModel.fixActivity(times)
        this.rankModel.rankMerge = a
        // this.lastRanking = a
        console.log('fixactivity', a);
        this.lastRanking = this.viewRank(a)
    }

    fixRelation(type, param) {
        if (type == FixAction.FIX) {
            let from = this.rankModel.rankMerge.indexOf(this.curPlayer)
            arrMove(this.rankModel.rankMerge, from, Number(param) - 1)
        }
        this.lastRanking = this.viewRank(this.rankModel.rankMerge)
    }

    showRelation(topCount) {
        // this.lastRanking = this.mergeRank.flowUpPlayer(Number(topCount))
        this.relationArr.length = 0
        console.log('showRelation');
        let playerArr = this.inputRelationPlayerArr
        // if (playerArr[0].player_id && playerArr[1].player_id) {
        let path = []
        findWinPath2(playerArr[0].player_id, playerArr[1].player_id, this.rankModel.playerMapSum,
            1, [], path)
        // console.log('path', path);
        for (let i = 0; i < path.length; i++) {
            let p = path[i];
            logPath(p, this.rankModel.playerMapSum)
        }
        path = []
        findWinPath2(playerArr[0].player_id, playerArr[1].player_id, this.rankModel.playerMapSum,
            0, [], path)
        // console.log('path', path);
        for (let i = 0; i < path.length; i++) {
            let p = path[i];
            logPath(p, this.rankModel.playerMapSum)
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
        this.rankModel.queryPlayerIdByName(n)
    }
    inputRelationPlayerArr: Array<any> = [{ name: 'p1' }, { name: 'p2' }]


    setRelation(row) {
        let p: RKPlayer = row
        this.curPlayer = row
        let sum = checkRelation(this.curPlayer, this.rankModel.rankMerge)
        this.rowColorMap = sum
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
        let rankArr = this.rankModel.rankMerge
        let p: RKPlayer
        for (let i = 0; i < rankArr.length; i++) {
            p = rankArr[i];
            doc.rankArr.push(p.toDoc())
        }
        this.$vm.$confirm(`是否保存[${season}]排行? length:${doc.rankArr.length}`)
            .then(_ => {
                console.log('toDoc', p.toDoc());
                $post('/ranking/update/' + season, doc, (res) => {
                    console.log('ranking update', res);
                })
            })
            .catch(_ => { });
        this.$vm.dialogVisible = function () {

        }
        // console.log('toDoc',p.toDoc());

    }

    mergeRank(season) {
        $get('/ranking/game/' + season, res => {
            console.log('load rank ', res);
        })
    }

    loadRank(season) {
        $get('/ranking/find/' + season, res => {
            this.rankModel.loadRank(res.doc.rankArr)
            this.lastRanking = this.viewRank(this.rankModel.rankMerge)
            console.log('load rank ', res, this.rankModel.rankMerge);
        })
    }

    fixRank(season) {

    }

    rankMove(dir) {
        let r = this.rankModel.rankMerge
        let curIdx = r.indexOf(this.curPlayer)
        if (curIdx > -1) {
            this.rankModel.rankMerge = arrMove(this.rankModel.rankMerge, curIdx, curIdx + dir)
            this.lastRanking = this.viewRank(this.rankModel.rankMerge)
        }
    }
    //  collection
    genBattle(dateStr) {
        collectionView.genBattle(dateStr, this.rankModel.rankMerge)
        this.showCollectionRanking('tongzhili')
    }
    showCollectionRanking(rankName) {
        this.lastTongzhiRanking = collectionView.showRank(rankName).slice(0, 50)
    }
    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }
}