import { CommandId } from '../../panel/score/CommandId';
import { $get, $post } from '../../utils/WebJsFunc';
import { BaseView } from '../BaseView';
const getDoc = (callback) => {
    $get('/db/find/79', (res) => {
        console.log('getDoc', res);
        if (!res.err && res.docs.length) {
            let doc = res.docs[0]
            callback(res.docs[0])
        }
        else
            callback(null)
    })
}
const saveDoc = (doc, cb?) => {
    $post('/db/update/79', doc, () => {
        if (cb)
            cb()
    })
}
const syncDoc = (cb) => {
    getDoc(doc => {
        cb(doc)
        saveDoc(doc)
    })
}
export class DashboardView extends BaseView {
    inputDelay = 12

    init() {
        getDoc(res => {
            console.log('res', res);
            if (res['delaySec']) {
                this.inputDelay = res['delaySec']
            }
        })
    }


    onSetDelay(sec) {
        console.log('onSetDelay', sec);
        syncDoc(doc => {
            doc.delaySec = sec
        })
        let data = { _: null, delayTimeMS: Number(sec) * 1000 }

        $post(`/emit/${CommandId.cs_setDelayTime}`, data)
    }

    onSetChampion() {

    }
}