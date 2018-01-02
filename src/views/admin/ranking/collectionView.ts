import { CollectionPlayer } from '../../../rkpCollection/CollectionPlayer';
import { RKPCollectionModel } from '../../../rkpCollection/RKPCollection';
import { getRoundList, getRoundRawData } from "../../utils/HupuAPI";
import { $get } from "../../utils/WebJsFunc";
import { genValidGameArr } from "../../../ranking/RankingMerge";
import { DateFormat } from "../../utils/JsFunc";
function downLoadGameData(callback) {
    let _downLoadGameData = (gameInfoArr, gameDataArr, callback) => {
        if (gameInfoArr.length) {
            let gameInfo = gameInfoArr.pop()
            console.log('getRoundRawData', gameInfo);
            getRoundRawData(gameInfo.id, res2 => {
                console.log('round data', res2);
                if (res2.data && res2.data[1]) {
                    gameDataArr.push({ info: gameInfo, gameArr: res2.data })
                }
                _downLoadGameData(gameInfoArr, gameDataArr, callback)
            })
        } else
            callback(gameDataArr)
    }
    getRoundList(res => {
        // let gameDataArr = res.data
        let gameDataArr = JSON.parse(res).data
        console.log('download game data:', gameDataArr)
        let gameInfoArr2017 = []
        for (var i = 0; i < gameDataArr.length; i++) {
            var gameData = gameDataArr[i];
            // if (gameData.game_start.search('2017') > -1) {
            //     // console.log(gameData);
            //     gameInfoArr2017.push(gameData)
            // }
            // if (gameData.id > 421) { //s3
            // console.log(gameData);
            gameInfoArr2017.push(gameData)
            // }
        }

        _downLoadGameData(gameInfoArr2017, [], gameDataArr2017 => {
            console.log('db save', gameDataArr2017);
            callback(gameDataArr2017)
        })
    })
}
export class CollectionView {
    gameDataArr: any
    collectionModel: RKPCollectionModel
    curDate: Date
    curRankArr: Array<CollectionPlayer>
    get m() {
        return this.collectionModel
    }
    constructor() {
        this.collectionModel = new RKPCollectionModel()
        // $get('/ranking/game/' + 's3', res => {
        //     console.log('load rank ', res);
        //     let gameDataArr = res.doc.gameArr
        //     this.gameDataArr = []
        //     for (let gameData of gameDataArr) {
        //         this.gameDataArr.push(gameData)
        //     }
        // })
    }

    genBattle(dateStr, gameCount, rankPlayerArr) {
        // if (passDayCount == 0) {
        // }
        // dateStr = '2017-03-01'
        // let a = dateStr.split(' ')
        // dateStr
        // let gameCount = 15
        this.curRankArr = rankPlayerArr
        this.curDate = dateStr
        let gameDataArr = []
        let isStart = false
        for (let gd of this.gameDataArr) {
            let date = gd.info.game_start.split(' ')[0]
            if (gameDataArr.length > gameCount - 1)
                break;

            if (date == dateStr || isStart) {
                isStart = true
                // console.log('game info', gd.info);
                if (gd.gameArr[1]) {
                    gd.gameArr = genValidGameArr(gd.gameArr)
                    gameDataArr.push(gd)
                }
            }
        }
        // console.log('gameDataArr', gameDataArr);

        this.collectionModel.startBattle(gameDataArr, rankPlayerArr)
        this.sumSeason()
        return [this.collectionModel.tongzhiRanking]
    }

    sumSeason() {
        let gameDataArr = []
        let isStart = false
        for (let gd of this.gameDataArr) {
            let date = gd.info.game_start.split(' ')[0]
            if (gd.gameArr[1]) {
                gd.gameArr = genValidGameArr(gd.gameArr)
                gameDataArr.push(gd)
            }
        }
        this.collectionModel.sumGameDataArr(gameDataArr)
        console.log('sum season', gameDataArr);
    }
    showRank(rankName) {
        let a;
        if (rankName == 'tongzhili') {
            a = this.collectionModel.tongzhiRanking
        }
        else if (rankName == 'heima') {
            a = this.collectionModel.heimaRanking
        }
        else if (rankName == 'tulong') {
            a = this.collectionModel.tuLongRanking
        }
        else if (rankName == 'masterCon') {
            a = this.collectionModel.masterConRanking
        }
        // for (let i = 0; i < a.length; i++) {
        //     let cPlayer: CollectionPlayer = a[i];

        // }
        return a
    }
    nextWeek() {
        let d = new Date(this.curDate)
        let nextDate = new Date(d.getTime() + 24 * 60 * 60 * 1000 * this.m.week)
        let dateStr = DateFormat(nextDate, 'yyyy-MM-dd')
        this.genBattle(dateStr, this.m.week, this.curRankArr)
    }
}