import { newBitmap, alignScrCenter } from '../../utils/PixiEx';
import { FontName, ViewConst, TimerState } from '../const';
import { TextTimer } from '../../utils/TextTimer';

let i1 = 90
let y1 = 275
let y2 = 502
let y3 = 717
let y5 = 652
let textPosArr = [
    [
        [530, y1],
        [530, y1 + i1]
    ],
    [
        [530, y2],
        [530, y2 + i1]
    ],
    [
        [690, y3],
        [690, y3 + i1]
    ],
    [
        [1050, 332],
        [1050, 520]
    ],
    [
        [1170, y5],
        [1170, y5 + i1]
    ],
    [
        [1670, 428],
        [1670, 705]
    ]
]
const routeArr =
    [
        `1-4.0 
        \\3.0`,
        `2-4.1
        \\3.1`,
        `3-5.1
        \\0.0`,
        `4-6.0
        \\5.0`,
        `5-6.1
        \\0.0`,
    ]
export class FinalGameProcess extends PIXI.Container {
    p: any
    day1Ctn: PIXI.Container
    day2Ctn: PIXI.Container
    day1Mask: PIXI.Graphics
    day1TextArr = []
    day2TextArr = []
    titleText: PIXI.Text
    comingCtn: PIXI.Container
    constructor(p) {
        super()
        let bg = newBitmap({ url: '/img/panel/final2/process/bg.png' })
        this.addChild(bg)

        //day1
        this.day1Ctn = new PIXI.Container()
        this.addChild(this.day1Ctn)

        this.day1Ctn.addChild(newBitmap({ url: '/img/panel/final2/process/day1bg.png' }))

        let ts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '62px',
            fill: '#eee',
            fontWeight: 'bold'
        }
        for (let i = 0; i < 5; i++) {
            let lt = new PIXI.Text('', ts)
            lt.x = 560
            lt.y = 240 + i * 130
            this.day1Ctn.addChild(lt)

            let slash = new PIXI.Text('-', ts)
            this.day1Ctn.addChild(slash)
            slash.y = lt.y
            alignScrCenter(slash)

            let rt = new PIXI.Text('', ts)
            rt.x = 1085
            rt.y = lt.y

            lt.style.fill = '#0070d1'
            rt.style.fill = '#d11d00'

            this.day1Ctn.addChild(rt)

            let lSt = new PIXI.Text('0 : 0', ts)
            lSt.x = 860
            lSt.y = lt.y
            this.day1Ctn.addChild(lSt)

            let rSt = new PIXI.Text('0 : 0', ts)
            rSt.x = ViewConst.STAGE_WIDTH * .5 + 40
            rSt.y = lt.y
            this.day1Ctn.addChild(rSt)

            this.day1TextArr.push([lt, rt, lSt, rSt])
        }

        let ctnMask = new PIXI.Graphics()
        ctnMask.beginFill(0xffffff, 1)
        ctnMask.drawRect(0, 0, ViewConst.STAGE_WIDTH, 920)
        this.addChild(ctnMask)
        this.day1Mask = ctnMask
        this.day1Ctn.mask = ctnMask
        ///
        //day2
        this.day2Ctn = new PIXI.Container()
        this.addChild(this.day2Ctn)
        this.day2Ctn.addChild(newBitmap({ url: '/img/panel/final2/process/day2bg.png' }))
        for (let i = 0; i < 6; i++) {
            let tt = new PIXI.Text('', ts);
            let bt = new PIXI.Text('', ts);
            this.day2Ctn.addChild(tt)
            this.day2Ctn.addChild(bt)
            this.day2TextArr.push([tt, bt])
        }

        //
        this.addChild(newBitmap({ url: '/img/panel/final2/process/titleBar.png' }))
        let titleTex = newBitmap({ url: '/img/panel/final2/process/titleTex.png' })
        this.addChild(titleTex)

        let tts = {
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '40px',
            fill: '#fff',
            fontWeight: 'bold'
        }
        let titleText = new PIXI.Text('第一天积分赛', tts)
        titleText.y = 118
        titleText.x = 930
        this.addChild(titleText)
        this.titleText = titleText
        titleTex.mask = this.titleText



        //coming
        this.comingCtn = new PIXI.Container()
        this.addChild(this.comingCtn)

        this.comingCtn.addChild(newBitmap({ url: '/img/panel/final2/process/coming.png' }))
        tts.fontSize = '55px'
        let comingTimer = new TextTimer('', tts)
        comingTimer.isMin = true
        comingTimer.x = 1640
        comingTimer.y = 980
        comingTimer.setTimeBySec(0)
        comingTimer.toggleTimer(TimerState.RUNNING)
        this.comingCtn.addChild(comingTimer)
        this.comingCtn.visible = false
        this.comingCtn['timer'] = comingTimer


        this.p = p
    }
    bracketGen(gameArr) {
        // let 
        let getScore = (score) => {
            let a = [score[0], score[1]]
            let player = [score[2]]
            return { score: a, player: player }
        }
        for (let g of gameArr) {
            g.player = g.team
        }
        let route = (gameIdx, winGameIdx, winPos, loseGameIdx, losePos) => {
            let rFrom = gameArr[gameIdx]

            let rWin = gameArr[winGameIdx]
            let rLose = gameArr[loseGameIdx]

            if (rWin) {
                if (rFrom.score[0] == 0 && rFrom.score[1] == 0)
                    return

                if (rFrom.score[0] > rFrom.score[1]) {
                    rWin.player[winPos] = rFrom.player[0]
                    if (loseGameIdx != -1)
                        rLose.player[losePos] = rFrom.player[1]
                }
                else {
                    rWin.player[winPos] = rFrom.player[1]
                    if (loseGameIdx != -1)
                        rLose.player[losePos] = rFrom.player[0]
                }
            }
        }
        let _ = (s: string) => {
            let re = /\d+/ig;
            let a1 = s.match(re)
            let gameIdx = Number(a1[0]) - 1
            let winIdx = Number(a1[1]) - 1
            let winPos = Number(a1[2])
            let loseIdx = Number(a1[3]) - 1
            let losePos = Number(a1[4])
            route(gameIdx, winIdx, winPos, loseIdx, losePos)
        }
        for (let i = 0; i < routeArr.length; i++) {
            let r = routeArr[i];
            _(r)
        }
        console.log('gen bracket', gameArr);
        return gameArr
    }

    show(data) {
        if (data.visible) {
            this.titleText.text = data.title
            alignScrCenter(this.titleText)
            let colorTeamName = (tt, bt, lScore, rScore) => {
                tt.style.fill = '#0070d1'
                bt.style.fill = '#d11d00'
                tt.alpha = 1
                bt.alpha = 1
                if (lScore != 0 || rScore != 0) {
                    if (lScore < rScore) {
                        tt.alpha = 0.3
                        tt.style.fill = '#444'
                    }
                    else {
                        bt.alpha = 0.3
                        bt.style.fill = '#444'
                    }
                }
            }
            if (data.tab == 'day1') {
                this.day1Mask.y = 0
                this.day1Ctn.visible = true
                this.day2Ctn.visible = false
                let gameArr;
                let startIdx = 0
                if (data.param == 1) {
                    startIdx = 5
                }
                for (let i = 0; i < this.day1TextArr.length; i++) {
                    let a = this.day1TextArr[i];
                    let lt = a[0]
                    let rt = a[1]
                    let lScoreText = a[2]
                    let rScoreText = a[3]
                    let g = data.gameArr[i + startIdx]
                    let lTeamInfo = g.team[0]
                    let rTeamInfo = g.team[1]
                    lt.text = lTeamInfo.hz + lTeamInfo.name
                    lt.x = 840 - lt.width
                    // lt.x = 893 - lt.width * .5
                    rt.text = rTeamInfo.hz + rTeamInfo.name
                    lScoreText.text = Math.floor(g.score[0]) + ''
                    lScoreText.x = ViewConst.STAGE_WIDTH * .5 - lScoreText.width + 15
                    lScoreText.x = 893 - lScoreText.width * .5
                    rScoreText.text = '' + Math.floor(g.score[1])
                    rScoreText.x = 1027 - rScoreText.width * .5
                    colorTeamName(lt, rt, g.score[0], g.score[1])
                }
            }
            else if (data.tab == 'day2.1') {
                this.day1Mask.y = -270
                this.day1Ctn.visible = true
                this.day2Ctn.visible = false
                for (let i = 0; i < this.day1TextArr.length; i++) {
                    let a = this.day1TextArr[i];
                    let lt = a[0]
                    let rt = a[1]
                    let lScoreText = a[2]
                    let rScoreText = a[3]
                    if (i > 2) {
                        lt.text = ''
                        rt.text = ''
                        lScoreText.text = ''
                        rScoreText.text = ''
                    }
                    else {
                        let g = data.gameArr[i]
                        let lTeamInfo = g.team[0]
                        let rTeamInfo = g.team[1]
                        if (lTeamInfo && rTeamInfo) {
                            lt.text = lTeamInfo.hz + lTeamInfo.name
                            lt.x = 840 - lt.width
                            rt.text = rTeamInfo.hz + rTeamInfo.name
                            lScoreText.text = Math.floor(g.score[0]) + ''
                            lScoreText.x = ViewConst.STAGE_WIDTH * .5 - lScoreText.width + 15
                            lScoreText.x = 893 - lScoreText.width * .5
                            rScoreText.text = '' + Math.floor(g.score[1])
                            rScoreText.x = 1027 - rScoreText.width * .5
                            colorTeamName(lt, rt, g.score[0], g.score[1])
                        }
                        else {
                            lt.text = ''
                            rt.text = ''
                            lScoreText.text = ''
                            rScoreText.text = ''
                        }
                    }
                }
            }
            else if (data.tab == 'day2.2') {
                this.day1Ctn.visible = false
                this.day2Ctn.visible = true
                let b = this.bracketGen(data.gameArr)

                for (let i = 0; i < this.day2TextArr.length; i++) {
                    let a = this.day2TextArr[i];
                    let tt = a[0]
                    let bt = a[1]
                    let g = data.gameArr[i]
                    let lTeamInfo = g.player[0]
                    let rTeamInfo = g.player[1]
                    let lScore = g.score[0]
                    let rScore = g.score[1]
                    let pos = textPosArr[i]
                    if (lTeamInfo) {
                        tt.text = lTeamInfo.hz + lTeamInfo.name
                        tt.x = pos[0][0] - tt.width
                        tt.y = pos[0][1]
                    }
                    if (rTeamInfo) {
                        bt.text = rTeamInfo.hz + rTeamInfo.name
                        bt.x = pos[1][0] - bt.width
                        bt.y = pos[1][1]
                    }


                    tt.style.fill = '#0070d1'
                    bt.style.fill = '#d11d00'
                    tt.alpha = 1
                    bt.alpha = 1
                    let isLose = (i == 2 || i == 4)
                    if (lScore != 0 || rScore != 0) {
                        if (lScore < rScore) {
                            tt.alpha = 0.3
                            if (isLose)
                                tt.style.fill = '#444'
                        }
                        else {
                            bt.alpha = 0.3
                            if (isLose)
                                bt.style.fill = '#444'
                        }
                    }
                }
            }

            this.p.addChild(this)
        }
        else
            this.hide()
    }

    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }

    showTimer(data) {
        this.comingCtn.visible = data.visible
        if (data.visible) {
            this.comingCtn['timer'].setTimeBySec(data.sec)
        }
    }

}