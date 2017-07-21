import { BaseGameView, syncDoc } from './BaseGame';
import LiveDataView from './livedataView';
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
let gameDate = 730
declare let io;
export default class DoubleEliminationView extends BaseGameView {
    //gameIdx from 1 - 39

    gameInfoTable = []
    lHupuID = ''
    rHupuID = ''
    constructor(liveDataView: LiveDataView) {
        super()
        syncDoc(gameDate, doc => {
            console.log('sync doc', doc);
            // if (!doc['rec']) {
            // this.initBracket(doc)
            this.initView(doc)
            // }
        })

        liveDataView.on(WebDBCmd.cs_init, data => {
            console.log('DoubleElimination cs_init', data);
            syncDoc(gameDate, doc => {
                $post(`/emit/${WebDBCmd.cs_bracket20Init}`, doc)
            })
        })

        liveDataView.on(WebDBCmd.cs_score, data => {
            console.log('DoubleElimination', data);
            this.lScore = data.leftScore || this.lScore
            this.rScore = data.rightScore || this.rScore
        })

        liveDataView.on(WebDBCmd.cs_commit, data => {
            console.log(this, 'cs_commit', data);
            this.commit()
        })

        liveDataView.on(liveDataView.EVENT_SET_GAME_INFO, gameIdx => {
            console.log(this, 'EVENT_SET_GAME_INFO', gameIdx);
            this.setGameInfo(gameIdx)
        })
        this.initWS()
    }

    setGameInfo(gameIdx) {
        syncDoc(gameDate, doc => {
            let rec = doc['rec'][gameIdx]
            this.gameIdx = gameIdx
            this.lPlayer = rec.player[0]
            this.rPlayer = rec.player[1]
            this.lScore = Number(rec.score[0]) || 0
            this.rScore = Number(rec.score[1]) || 0
            this.lFoul = Number(rec.foul[0]) || 0
            this.rFoul = Number(rec.foul[1]) || 0
        })
    }

    initView(doc) {
        //  this.recMap = doc['recMap']
        let recMap = doc['rec']
        let gameIdx = doc.gameIdx
        this.setGameInfo(gameIdx)
        //gameInfoTable
        let rowArr: any = []
        for (let idx in recMap) {
            console.log('idx', idx, recMap);
            let rec = recMap[idx]
            let row = { idx: 0, gameIdx: 0, vs: '', score: '', rPlayer: '', lPlayer: '' }
            row.gameIdx = Number(idx)
            row.idx = row.gameIdx
            row.vs = `[${rec.player[0]} : ${rec.player[1]}]`
            row.lPlayer = this.getHupuId(rec.player[0])
            row.rPlayer = this.getHupuId(rec.player[1])
            row.score = rec.score[0] + " : " + rec.score[1]
            console.log('row', row);
            rowArr.push(row)
        }
        // console.log('init GameInfo Table', rowArr, this.nameMapHupuId);
        this.gameInfoTable = rowArr
    }

    getHupuId(groupName) {
        return groupName
    }

    initWS() {
        io.connect('/rkb')
            .on('connect', () => {
                console.log('connect DoubleEliminationView initWS')
            })
            .on(`${WebDBCmd.sc_bracket20Created}`, () => {
                console.log('sc_bracketCreated');
                this.emitBracket()
            })
            .on(`${WebDBCmd.sc_panelCreated}`, () => {
                console.log('sc_panelCreated');
                // this.emitGameInfo()
            })
    }
    emitBracket() {
        syncDoc(gameDate, doc => {
            console.log('emit bracket', doc);
            $post(`/emit/${WebDBCmd.cs_bracket20Init}`, { _: null, rec: doc.rec })
        })
    }

    commit() {
        syncDoc(gameDate, doc => {
            console.log('commit', doc, 'gameIdx:', this.gameIdx);
            let rec = doc['rec'][this.gameIdx]
            rec.score = [this.lScore, this.rScore]
            rec.foul = [this.lFoul, this.rFoul]
            rec.player = [this.lPlayer, this.rPlayer]
            this.gameIdx++
            doc.gameIdx = this.gameIdx
            this.initView(doc)
        }, true)
    }

    initBracket(doc) {
        let rec = doc['rec'] = {}
        for (let i = 0; i < 39; i++) {
            rec[i + 1] = { gameIdx: i + 1, player: ['', ''], score: [0, 0], foul: [0, 0] }
        }
        doc['gameIdx'] = 1
        rec[1].player = ['p16', 'p17']
        rec[2].player = ['p13', 'p20']
        rec[3].player = ['p15', 'p18']
        rec[4].player = ['p14', 'p19']

        rec[5].player = ['p8', 'p9']
        rec[6].player = ['p5', 'p12']
        rec[7].player = ['p7', 'p10']
        rec[8].player = ['p6', 'p11']

        rec[9].player = ['p1', '']
        rec[10].player = ['p4', '']
        rec[11].player = ['p2', '']
        rec[12].player = ['p3', '']
    }
}