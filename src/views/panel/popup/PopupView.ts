import { RollText } from './RollText';
import { Victory } from './Victory';
import { WebDBCmd } from '../webDBCmd';
import { Champion } from './Champion';
import { ChampionM2 } from './ChampionM2';
import { GamePlayerInfo } from './GamePlayerInfo';
import { GroupRankM2 } from './GroupRankM2';
import { NoticePanel } from './NoticePanel';
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
                    this.show(ChampionM2, data)
                    : this.hide(ChampionM2)
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
            .on(WebDBCmd.sc_showRollText, data => {
                console.log('sc_showRollText', data,this.popupItemMap);
                data.visible ?
                    this.show(RollText, data)
                    : this.hide(RollText)
            })
    }
    show(cls, param) {
        if (cls.class) {
            if (!this.popupItemMap[cls.class]) {
                this.popupItemMap[cls.class] = new cls()
                this.popupItemMap[cls.class].create(this.ctn)
            }
            (this.popupItemMap[cls.class] as IPopup).show(param)
        }
        else throw 'check class def' + cls
    }

    hide(cls) {
        if (this.popupItemMap[cls.class])
            this.popupItemMap[cls.class].hide()
    }
}