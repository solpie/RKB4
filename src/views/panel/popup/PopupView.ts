import { Champion } from './Champion';
import { GroupRank } from './GroupRank';
import { WebDBCmd } from '../webDBCmd';
export interface IPopup {
    create: (parent) => void
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
            if (data.visible)
                this.show(GroupRank, data)
            else
                this.hide(GroupRank)
        })
            .on(WebDBCmd.sc_showChampion, data => {
            console.log('sc_showChampion', data);
                data.visible ?
                    this.show(Champion, data)
                    : this.hide(Champion)
            })
    }

    show(cls, param) {
        if (!this.popupItemMap[cls]) {
            this.popupItemMap[cls] = new cls()
            this.popupItemMap[cls].create(this.ctn)
        }
        (this.popupItemMap[cls] as IPopup).show(param)
    }

    hide(cls) {
        if (this.popupItemMap[cls])
            this.popupItemMap[cls].hide()
    }
}