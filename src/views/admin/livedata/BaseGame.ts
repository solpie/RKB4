import { $post, $get } from "../../utils/WebJsFunc";
import { WebDBCmd } from "../../panel/webDBCmd";

export interface IBaseGameView {
    gameIdx: number
    lPlayer: string
    rPlayer: string
    lScore: number
    rScore: number
    lFoul: number
    rFoul: number
    time: number
    winScore: number
    gameType: number
    start: () => void
    pause: () => void
    commit: (data: any) => void
}
export class BaseGameView implements IBaseGameView {
    public dbIdx: string;
    public gameType: number;
    public start() { };
    public pause() { };
    public commit() { };
    public gameIdx: number = 0
    public lPlayer: string = ''
    public rPlayer: string = ''
    public lScore: number = 0
    public rScore: number = 0
    public lFoul: number = 0
    public rFoul: number = 0
    public time: number = 0
    public winScore: number = 2
    gameTitle = null//'车轮战'
    constructor() { }
    //action
    protected emitScoreFoul(sf: { lScore: number, rScore: number, lFoul: number, rFoul: number }) {
        let data: any = { _: null }
        data.leftScore = sf.lScore
        data.rightScore = sf.rScore
        data.leftFoul = sf.lFoul
        data.rightFoul = sf.rFoul
        $post(`/emit/${WebDBCmd.cs_score}`, data)
    }

    //set doc
    protected setScore(scoreStr, callback?) {
        let a = scoreStr.split(' ')
        if (a.length == 2) {
            console.log('length ', 2, this.dbIdx);
            if (this.dbIdx) {
                console.log('dbIdx ', this.dbIdx);
                syncDoc(this.dbIdx, doc => {
                    let game = doc['rec'][this.gameIdx]
                    game.score = [Number(a[0]), Number(a[1])]
                    if (callback)
                        callback(doc)
                }, true)
            }
        }
    }

    protected setVS(vsStr, callback?) {
        if (this.dbIdx) {
            let a = vsStr.split(' ')
            if (a.length == 2) {
                syncDoc(this.dbIdx, doc => {
                    let game = doc['rec'][this.gameIdx]
                    game.player = a
                    if (callback)
                        callback(doc)
                }, true)
            }
        }
    }

}

export class RecData {
    gameIdx: number = -1
    player: Array<string> = ['', '']
    score: Array<number> = [0, 0]//1-2
    foul: Array<number> = [0, 0]//2-3
    time: number = -1
}

export const getDoc = (callback) => {
    $get('/db/find/519', (res) => {
        console.log('getDoc', res);
        if (!res.err && res.docs.length) {
            let doc = res.docs[0]
            for (let idx in doc.recMap) {
                let recData = doc.recMap[idx]
                recData.score = [Number(recData.score[0]), Number(recData.score[1])]
                recData.foul = [Number(recData.foul[0]), Number(recData.foul[1])]
            }
            callback(res.docs[0])
        }
        else
            callback(null)
    })
}
export const saveDoc = (doc, cb?) => {
    $post('/db/update/519', doc, () => {
        if (cb)
            cb()
    })
}

export const syncDoc = (idx, cb, isSave = false) => {
    let _get = (callback) => {
        $get('/db/find/' + idx, (res) => {
            if (!res.err && res.docs.length) {
                let doc = res.docs[0]
                callback(res.docs[0])
            }
            else
                callback(null)
        })
    }
    let _saveDoc = (doc, callback?) => {
        $post('/db/update/' + idx, doc, () => {
            if (callback)
                callback()
        })
    }
    _get(doc => {
        cb(doc)
        if (isSave)
            _saveDoc(doc)
    })
}
export const buildPlayerData = (doc, isAll = false) => {
    let sumMap: any = {}
    let sumIdx;
    isAll ? sumIdx = 99 : sumIdx = 99;
    let _new = (playerName) => {
        return {
            name: playerName,
            win: 0,
            straight: 0,//连胜
            lose: 0,
            score: 0, dtScore: 0, beat: [], time: 0
        }
    }
    for (let k in doc['rec']) {
        if (Number(k) < sumIdx) {
            let r: RecData = doc['rec'][k]
            if (!sumMap[r.player[0]])
                sumMap[r.player[0]] = _new(r.player[0])
            if (!sumMap[r.player[1]])
                sumMap[r.player[1]] = _new(r.player[1])
            if (r.score[0] == 0 && r.score[1] == 0) {
                continue;
            }
            if (r.score[0] > r.score[1]) {
                sumMap[r.player[0]].win++
                sumMap[r.player[0]].straight++
                sumMap[r.player[0]].dtScore += (r.score[0] - r.score[1])
                sumMap[r.player[0]].beat.push(r.player[1])
                sumMap[r.player[0]].score += r.score[0]

                sumMap[r.player[1]].lose++
                sumMap[r.player[1]].straight = 0
                sumMap[r.player[1]].dtScore -= (r.score[0] - r.score[1])
                sumMap[r.player[1]].score += r.score[1]
            }
            else {
                sumMap[r.player[1]].win++
                sumMap[r.player[1]].straight++
                sumMap[r.player[1]].dtScore += (r.score[1] - r.score[0])
                sumMap[r.player[1]].beat.push(r.player[0])
                sumMap[r.player[1]].score += r.score[1]

                sumMap[r.player[0]].lose++
                sumMap[r.player[0]].straight = 0
                sumMap[r.player[0]].dtScore -= (r.score[1] - r.score[0])
                sumMap[r.player[0]].score += r.score[0]
            }
            console.log(r)
        }
    }
    return sumMap
}