import { BaseGameView, syncDoc } from "./BaseGame";

declare let io;
let gameDate = '930'
export default class DoubleElimination24View extends BaseGameView {
    constructor() {
        super()
    }

    init() {
        syncDoc(gameDate, doc => {
            console.log('sync doc', doc);
            // this.initBracket(doc)
            // this.initPlayer(_ => {
            //     this.initView(doc)
            // })
        })
    }

    initPlayer() {
        let playerIdArr = []
        let playerArr = []
        for (let i = 0; i < 32; i++) {

        }
    }

    //clear data
    initBracket(doc) {
        let rec = doc['rec'] = {}
        for (let i = 0; i < 62; i++) {
            rec[i + 1] = { gameIdx: i + 1, player: ['', ''], score: [0, 0], foul: [0, 0] }
        }
        doc['gameIdx'] = 1
        for (let i = 0; i < 16; i++) {
            let gameIdx = i + 1
            rec[i + 1].player = ['p' + (gameIdx * 2 - 1), 'p' + gameIdx * 2]
        }
        // rec[2].player = ['p13', 'p20']
        // rec[3].player = ['p15', 'p18']
        // rec[4].player = ['p14', 'p19']

        // rec[5].player = ['p8', 'p9']
        // rec[6].player = ['p5', 'p12']
        // rec[7].player = ['p7', 'p10']
        // rec[8].player = ['p6', 'p11']

        // rec[9].player = ['p1', '']
        // rec[10].player = ['p4', '']
        // rec[11].player = ['p2', '']
        // rec[12].player = ['p3', '']
    }
}