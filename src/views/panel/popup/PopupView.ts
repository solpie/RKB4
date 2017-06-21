import { GroupRank } from './GroupRank';
import { WebDBCmd } from '../webDBCmd';
export interface IPopup {
    show: (param: any) => void
    hide: () => void
}
export class PopupView {
    ctn: PIXI.Container
    popupItemMap = {}
    constructor(parent, localWS) {
        this.ctn = parent
        this.initWS(localWS)
    }
    initWS(io) {
        io.on(WebDBCmd.sc_showGroupRank, data => {
            console.log('sc_groupRank', data);
            this.show(GroupRank, data)
        })
            .on(WebDBCmd.sc_hideGroupRank, _ => {
                this.hide(GroupRank)
            })
    }

    show(cls, param) {
        if (!this.popupItemMap[cls]) {
            this.popupItemMap[cls] = new cls(this.ctn)
        }
        this.popupItemMap[cls].show(param)
    }

    hide(cls) {
        if (this.popupItemMap[cls])
            this.popupItemMap[cls].hide()
    }
}