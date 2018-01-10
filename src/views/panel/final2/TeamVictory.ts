import { newBitmap, alignCenter, alignScrCenter } from '../../utils/PixiEx';
import { TeamVictoryItem } from './TeamVictoryItem';
import { TweenEx } from '../../utils/TweenEx';
import { imgLoader } from "../../utils/ImgLoader";
import { FontName, ViewConst } from "../const";

export class TeamVictory extends PIXI.Container {
    p: any
    itemArr: Array<TeamVictoryItem> = []
    teamLogo: PIXI.Sprite
    teamText: PIXI.Text
    teamTextShadow: PIXI.Text
    scoreText: PIXI.Text
    constructor(parent) {
        super()
        this.p = parent

    }
    isLoad = false
    preload(callback) {
        if (!this.isLoad)
            imgLoader.loadTexArr([
                '/img/panel/final2/victory/bg.png',
                '/img/panel/final2/victory/teamTex.png',
                '/img/panel/final2/victory/itemBg.png',
                '/img/panel/final2/victory/avtMask.png',
                '/img/panel/final2/victory/itemFrame.png',
                '/img/panel/final2/victory/barBg.png',
                '/img/panel/final2/victory/team1.png',
                '/img/panel/final2/victory/team2.png',
                '/img/panel/final2/victory/team3.png',
                '/img/panel/final2/victory/team4.png',
                '/img/panel/final2/victory/team5.png',
                '/img/panel/final2/victory/bar.png',
            ], _ => {
                let bg = newBitmap({ url: '/img/panel/final2/victory/bg.png' })
                this.addChild(bg)
                for (let i = 0; i < 5; i++) {
                    let item = new TeamVictoryItem()
                    this.addChild(item)
                    item['ty'] = 0 + i * 125
                    item['idx'] = i
                    item.x = 0
                    this.itemArr.push(item)
                }

                let tex = newBitmap({ url: '/img/panel/final2/victory/teamTex.png' })

                this.teamLogo = new PIXI.Sprite()
                this.teamLogo.x = 880
                this.teamLogo.y = 100
                this.addChild(this.teamLogo)

                let bs = {
                    fontFamily: FontName.MicrosoftYahei,
                    fontSize: '35px',
                    fill: '#eee',
                    fontWeight: 'bold'
                }

                let t = new PIXI.Text('南方队获胜', bs)
                // t.x = 860
                t.y = 540
                this.teamText = t
                tex.mask = t

                bs.fill = '#000'
                t = new PIXI.Text('南方队获胜', bs)
                this.teamTextShadow = t
                t.y = 543
                let blur = new PIXI.filters.BlurFilter();
                t.filters = [blur]
                blur.blur = 3
                this.addChild(t)
                this.addChild(this.teamText)

                this.addChild(tex)


                //score
                let ss = {
                    fontFamily: FontName.Impact,
                    fontSize: '75px',
                    dropShadow: true,
                    dropShadowDistance:12,
                    dropShadowAngle:70,
                    dropShadowColor:'#444',
                    fill: '#ffc382',
                    fontWeight: 'bold'
                }

                let s = new PIXI.Text('', ss)
                this.scoreText = s
                s.y = 435
                this.addChild(s)

                this.isLoad = true
                callback()
            })
        else
            callback()
    }

    show(data) {
        this.preload(_ => {
            let avtArr = []
            let lPlayerArr = []
            let rPlayerArr = []
            for (let player of data.lTeamInfo.playerArr) {
                avtArr.push(player.avatar)
                player.kda = data.kdaMap[player.pid]
                lPlayerArr.push(player)
            }
            for (let player of data.rTeamInfo.playerArr) {
                avtArr.push(player.avatar)
                player.kda = data.kdaMap[player.pid]
                rPlayerArr.push(player)
            }
            //win team name
            this.teamText.text = data.winTeamInfo.name + ' 获胜'
            alignScrCenter(this.teamText)
            this.teamTextShadow.text = this.teamText.text
            this.teamTextShadow.x = this.teamText.x
            //score

            this.scoreText.text = data.lTeamScore + " : " + data.rTeamScore
            // this.scoreText.x = 0.5 * (ViewConst.STAGE_WIDTH - this.teamText.width)
            alignScrCenter(this.scoreText)
            imgLoader.loadTexArr(avtArr, _ => {
                this.p.addChild(this)
                for (let i = 0; i < this.itemArr.length; i++) {
                    let item = this.itemArr[i];
                    item.setData(lPlayerArr[i], rPlayerArr[i])
                    this.moveIn2(item)
                }
            }, true)
        })
    }
    moveIn2(item2) {
        item2.y = item2['ty'] - 500
        item2.alpha = 0
        TweenEx.delayedCall(item2['idx'] * 80, _ => {
            console.log('item idx', item2['idx']);
            TweenEx.to(item2, 120, { y: item2['ty'], alpha: 1 })
        })
    }
    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }
}