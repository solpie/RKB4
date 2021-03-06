import { VictoryM2 } from './VictoryM2';
import { StaticImg } from './StaticImg';
import { GameProcess } from './GameProcess';
import { RollText } from './RollText';
import { Victory } from './Victory';
import { WebDBCmd } from '../webDBCmd';
import { Champion } from './Champion';
import { ChampionM2 } from './ChampionM2';
import { GamePlayerInfo } from './GamePlayerInfo';
import { GroupRankM2 } from './GroupRankM2';
import { NoticePanel } from './NoticePanel';
import { Victory0 } from "./Victory0";
import { FxImg } from './FxImg';
import { TweenEx } from '../../utils/TweenEx';
import { ComboSp } from './ComboSp';
export interface IPopup {
    create: (parent) => void
    show: (param: any) => void
    hide: (param?: any) => void
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
            .on(WebDBCmd.sc_showCombo, data => {
                console.log('sc_showCombo', data);
                data.visible ?
                    this.show(ComboSp, data)
                    : this.hide(ComboSp)
            })
            .on(WebDBCmd.sc_showVictory, data => {
                console.log('sc_showVictory', data);
                if (data.panel == 'M2') {
                    data.visible ?
                        this.show(VictoryM2, data)
                        : this.hide(VictoryM2)
                }
                else {
                    if (data.visible) {
                        let stateMap = FxImg.isShowFxImg(data)
                        if (stateMap.texArr.length > 0) {
                            TweenEx.delayedCall(1500, _ => {
                                this.show(Victory0, data)
                            })
                            this.show(FxImg, data)
                        }
                        else
                            this.show(Victory0, data)
                    }
                    else {
                        this.hide(FxImg)
                        this.hide(Victory0)
                    }
                }
            })
            .on(WebDBCmd.sc_showRollText, data => {
                console.log('sc_showRollText', data, this.popupItemMap);
                data.visible ?
                    this.show(RollText, data)
                    : this.hide(RollText)
            })
            .on(WebDBCmd.sc_showGameProcess, data => {
                console.log('sc_showGameProcess', data);
                data.visible ?
                    this.show(GameProcess, data)
                    : this.hide(GameProcess)
            })
            .on(WebDBCmd.sc_showImg, data => {
                console.log('sc_showImg');
                data.visible ?
                    this.show(StaticImg, data)
                    : this.hide(StaticImg, data)
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

    hide(cls, param?) {
        if (this.popupItemMap[cls.class])
            this.popupItemMap[cls.class].hide(param)
    }
}