import { $get, $post } from '../../utils/WebJsFunc';
import { GameInfo } from "./GameInfo";
import { getAllPlayer } from "../../utils/HupuAPI";

let gameInfo: GameInfo

const getDoc = (callback) => {
    $get('/db/find/519', (res) => {
        if (res.length)
            callback(res[0])
        else
            callback(null)
    })
}
const saveDoc = (doc, cb?) => {
    $post('/db/update/519', doc, () => {
        if (cb)
            cb()
    })
}
export class GameMonthView {
    gameInfo: any
    recMap: any
    constructor() {

    }
    initGameMonth(gameId) {
        getAllPlayer(gameId, (res, data) => {
            console.log('all player ', gameId, res, data);
            this.initGameInfo(res)
        })
    }
    initGameInfo(res) {
        let playerIdArr = ['郝天佶', 'Beans吴', 'NGFNGN', 'zzz勇'
            , 'tracyld11', '雷雷雷雷子', '带伤上阵也不怕', 'lgy1993131'
            , '平常心myd', '大霖哥666', '蔡炜少年', 'AL张雅龙'
            , '新锐宋教练', '邓丹阿丹', '认得挖方一号', '习惯过了头'
        ]
        let playerOrderArr = []
        let getData = (name) => {
            for (let p of res.data) {
                if (p.name == name)
                { return p }
            }
        }

        for (let p of playerIdArr) {
            playerOrderArr.push(getData(p))
        }
        getDoc((doc) => {
            if (doc) {
                console.log('getHupuPlayer',doc, res, playerOrderArr)
                gameInfo = GameInfo.create(playerOrderArr)
                // console.log(gameInfo.gameArr);
                // if (!doc['recMap']) {
                // doc['recMap'] = {}
                // let gameArr = gameInfo.getGameArr()
                // for (let i = 0; i < 38; i++) {
                //     let r = new RecData()
                //     let gp =gameArr[i]
                //     if (gp)
                //         r.player = [gp[0].name, gp[1].name]
                //     r.gameIdx = i
                //     doc['recMap'][i] = JSON.parse(JSON.stringify(r))
                // }
                // saveDoc(doc)
                // }
                // Vue.set('recMap', doc['recMap'])
                this.recMap = doc['recMap']
                gameInfo.recMap = doc['recMap']
                gameInfo.start(doc.gameIdx)
                this.gameInfo = gameInfo

                // if (!doc['gameIdx']) {
                //     doc['gameIdx'] = 0
                //     saveDoc(doc)
                // }
                this.emitBracket()
            }
        })
    }
    emitBracket() {

    }
}