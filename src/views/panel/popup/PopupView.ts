import { Victory } from './Victory';
import { NoticePanel } from './NoticePanel';
import { GamePlayerInfo } from './GamePlayerInfo';
import { Champion } from './Champion';
import { WebDBCmd } from '../webDBCmd';
import { GroupRankM2 } from "./GroupRankM2";
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
                this.show(GroupRankM2, data)
            else
                this.hide(GroupRankM2)
        })
            .on(WebDBCmd.sc_showChampion, data => {
                console.log('sc_showChampion', data);
                data.visible ?
                    this.show(Champion, data)
                    : this.hide(Champion)
            })
            .on(WebDBCmd.sc_showGamePlayerInfo, data => {
                console.log('sc_showGamePlayerInfo', data);
                data.visible ?
                    this.show(GamePlayerInfo, data)
                    : this.hide(GamePlayerInfo)
            })
            .on(WebDBCmd.sc_showNotice, data => {
                console.log('sc_showNotice', data);
                data.visible ?
                    this.show(NoticePanel, data)
                    : this.hide(NoticePanel)
            })
            .on(WebDBCmd.sc_showVictory, data => {
                console.log('sc_showVictory', data);
                data.visible ?
                    this.show(Victory, data)
                    : this.hide(Victory)
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