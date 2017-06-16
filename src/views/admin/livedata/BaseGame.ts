import { $post, $get } from "../../utils/WebJsFunc";

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
    commit: () => void
}
export class BaseGameView implements IBaseGameView {
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
    constructor()
    { }
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