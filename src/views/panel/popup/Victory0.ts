import { blink2 } from '../../utils/Fx';
import { RewardModel } from '../bracketM4/Reward24';
import { paddy } from '../../utils/JsFunc';
import { TweenEx } from '../../utils/TweenEx';
import { BaseAvatar } from '../base/BaseAvatar';
import { ViewConst, FontName } from '../const';
import { FramesFx } from '../../utils/FramesFx';
import { alignCenter, newBitmap, newModal, setScale } from '../../utils/PixiEx';
import { IPopup } from './PopupView';
import { GameType, GameTypeMap } from '../bracketM4/Bracket24Route';
import { simplifyName } from "../score/Com2017";
import { fitWidth } from "../bracket/BracketGroup";

export class Victory0 extends PIXI.Container implements IPopup {
    static class = 'Victory0'
    bg: PIXI.Sprite
    p: any
    fx: FramesFx
    playerNameText: PIXI.Text
    winLoseText: PIXI.Text
    rewardText: PIXI.Text
    avt: BaseAvatar
    create(parent: any) {
        this.p = parent
        this.addChild(newModal(0.4))
        let bg = newBitmap({ url: '/img/panel/score/m4/winBg.png' })
        this.addChild(bg)
        this.bg = bg

        let fx = new FramesFx('/img/fx/victory/winFx_', 0, 24)
        this.fx = fx
        this.addChild(fx)

        let playerBg = newBitmap({ url: '/img/panel/score/m4/winPlayerBg.png' })
        playerBg.x = (ViewConst.STAGE_WIDTH - 564) * .5
        playerBg.y = 376
        this.addChild(playerBg)

        let avt = new BaseAvatar('/img/panel/score/m4/avtMaskR.png', 180)
        avt.x = 20
        avt.y = 5
        this.avt = avt
        playerBg.addChild(avt)

        let pns = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '54px', fill: '#fff',
            fontWeight: 'bold',
            stroke: '#000',
            strokeThickness: 3,
            dropShadow: true,
            dropShadowAngle: Math.PI / 2,
            dropShadowColor: 0x0d5c92,
            dropShadowDistance: 3,
        }
        let playerName = new PIXI.Text('player name', pns)
        this.playerNameText = playerName
        playerName.x = 220
        playerName.y =12
        playerBg.addChild(playerName)
        pns.fontSize = '34px'
        let winLose = new PIXI.Text('1胜1负', pns)
        winLose.x = 220
        winLose.y = 96
        this.winLoseText = winLose
        playerBg.addChild(winLose)


        let rewardStyle = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '80px', fill: "#fff",
        }
        let r = new PIXI.Text('￥20,000', rewardStyle)
        this.rewardText = r
        r.y = 150
        r.x = 125
        playerBg.addChild(r)
        let rewardTex = newBitmap({ url: '/img/panel/score/m4/rewardTex.png' })
        setScale(rewardTex, 3)
        rewardTex.scale.x = 4
        rewardTex.x = 15
        rewardTex.y = 160
        playerBg.addChild(rewardTex)
        rewardTex.mask = r
    }

    show(param: any) {
        this.alpha = 1
        let playerData = param.winner
        this.playerNameText.text = simplifyName(playerData.name)
        fitWidth(this.playerNameText, 300, 54)
        
        this.avt.load(playerData.avatar)
        let prefix = ""
        if (GameTypeMap[param.gameIdx] == GameType.lose) {
            prefix = '败者组'
        }
        else if (GameTypeMap[param.gameIdx] == GameType.win) {
            prefix = '胜者组'
        }
        else if (GameTypeMap[param.gameIdx] == GameType.pre) {
            prefix = '分组赛'
        }
        this.winLoseText.text = prefix + "  " + param.rec.win + '胜  ' + param.rec.lose + '负'
        if (param.isLeft) {
            this.playerNameText.style.dropShadowColor = 0x0d5c92
            this.winLoseText.style.dropShadowColor = 0x0d5c92
        }
        else {
            this.playerNameText.style.dropShadowColor = 0x353032
            this.winLoseText.style.dropShadowColor = 0x353032
        }
        let rewardArr = param.reward.rewardArr
        if (rewardArr.length == 0) {
            this.rewardText.text = "￥000,00"
        }
        else {
            // this.rewardText.text = "￥" + param.reward.lastReward / 1000 + ",000"
            let num = { reward: 0 }
            let sumReward = RewardModel.sumRewardArr(rewardArr)
            let lastReward = sumReward - rewardArr[rewardArr.length - 1]
            let oneReward = rewardArr[rewardArr.length - 1]
            new TweenEx(num).to({ reward: oneReward }, 600).update(_ => {
                this.rewardText.text = "￥" + Math.floor((lastReward + num.reward) / 1000) + ","
                    + paddy(Math.floor((lastReward + num.reward) % 1000), 3)
                setScale(this.rewardText, 1 + Math.random() * .2)
            })
                .start()
            TweenEx.delayedCall(700, _ => {
                setScale(this.rewardText, 1)
                this.rewardText.text = "￥" + sumReward / 1000 + ",000"
            })
        }
        TweenEx.delayedCall(2500, _ => {
            this.hide()
        })
        // this.winLoseText = playerData.win
        this.fx.playOnce()
        this.p.addChild(this)
    };
    hide() {
        TweenEx.to(this, 250, { alpha: 0 }, _ => {
            this.p.removeChild(this)
        })
    };

}