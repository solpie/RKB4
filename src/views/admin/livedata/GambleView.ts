import { $post } from '../../utils/WebJsFunc';
import { syncDoc } from "./BaseGame";
let docGamble = 'gamble'
class GambleState {
    static START = 'start'
    static FLAKE = 'FLAKE'//流盘
    static FIN = 'fin'//正常开奖
    static WAIT = 'wait'//封盘

}
export class GambleView {
    topicIdArr = []
    gmv
    initGambleArr(gmv) {
        this.gmv = gmv
        syncDoc(docGamble, doc => {
            this._initGmv(gmv, doc)
        })
    }

    _initGmv(gmv, doc) {
        let a = []
        for (let t of doc['topicIdArr']) {
            if (t.state == GambleState.START
                || t.state == GambleState.WAIT) {
                a.push(t)
            }
        }
        gmv.gambleArr = a
        console.log('gambleArr', gmv.gambleArr);
    }

    startGamble(roomId, left, right) {
        $post('/autoGamble/start', { roomId: roomId, leftPlayer: left, rightPlayer: right }, (res) => {
            console.log('gamble start', res);
            if (res.code == 1) {
                syncDoc(docGamble, doc => {
                    let topicId = res.data.topic_id
                    if (!doc['topicIdArr'])
                        doc['topicIdArr'] = []
                    doc['topicIdArr'].push({ left: left, right: right, topicId: topicId, state: GambleState.START })
                    this._initGmv(this.gmv, doc)
                }, true)
            }
        })
    }

    gambleAct(act, topicId?, option?) {
        if (act == 'stop') {
            this.stopGamble(topicId)
        }
        else if (act == 'cancel') {
            this.cancelGamble(topicId)
        }
        else if (act == 'fin') {
            this.finGamble(topicId, option)
        }

    }
    finGamble(topicId, option) {
        $post('/autoGamble/fin', { topicId: topicId, option: option }, (res) => {
            console.log('gamble cancel', res);
            if (res.code == 1) {
                syncDoc(docGamble, doc => {
                    for (let t of doc['topicIdArr']) {
                        if (topicId == t.topicId) {
                            t.state = GambleState.FIN
                        }
                    }
                    this._initGmv(this.gmv, doc)
                }, true)
            }
        })
    }
    //流盘
    cancelGamble(topicId) {
        $post('/autoGamble/cancel', { topicId: topicId }, (res) => {
            console.log('gamble cancel', res);
            if (res.code == 1) {
                syncDoc(docGamble, doc => {
                    for (let t of doc['topicIdArr']) {
                        if (topicId == t.topicId) {
                            t.state = GambleState.FLAKE
                        }
                    }
                    this._initGmv(this.gmv, doc)
                }, true)
            }
        })
    }
    //封盘
    stopGamble(topicId) {
        $post('/autoGamble/stop', { topicId: topicId }, (res) => {
            console.log('gamble stop', res);
            if (res.code == 1) {
                syncDoc(docGamble, doc => {
                    for (let t of doc['topicIdArr']) {
                        if (topicId == t.topicId) {
                            t.state = GambleState.WAIT
                        }
                    }
                    this._initGmv(this.gmv, doc)
                }, true)
            }
        })
    }
}