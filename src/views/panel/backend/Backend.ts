import { BackendGroup } from './BackendGroup';
import { newBitmap, setScale } from '../../utils/PixiEx';
export class Backend extends PIXI.Container {
    playerArr = []

    groupMap = {}
    constructor() {
        super()
        let bg = newBitmap({ url: '/img/panel/backend/bg.png' })
        this.addChild(bg)
        setScale(this, 0.5)

        for (let i = 0; i < 62; i++) {
            let bkg = new BackendGroup(i + 1);
            let odd = (i + 0) % 2
            if (i < 16) {
                bkg.x = 360 + 200 * (i - odd)
                bkg.y = 1820 + odd * 150
            }
            else if (i < 24) {
                bkg.x = 240 + 220 * (i - odd - 16)
                bkg.y = 1420 + odd * 150
            }
            else if (i < 32) {
                bkg.x = 2040 + 220 * (i - odd - 24)
                bkg.y = 1420 + odd * 150
            }
            else if (i < 40) {
                bkg.x = 220
                bkg.y = 250 + (i - 32) * 120
            }
            else if (i < 44) {
                bkg.x = 660
                bkg.y = 250 + (i - 40) * 120
            }
            else if (i < 48) {
                bkg.x = 660
                bkg.y = 720 + (i - 44) * 120
            }
            else if (i < 52) {
                bkg.x = 1100
                bkg.y = 490 + (i - 48) * 120
            }
            else if (i < 54) {
                bkg.x = 1580//+480
                bkg.y = 340 + (i - 52) * 120
            }
            else if (i < 56) {
                bkg.x = 1580//
                bkg.y = 640 + (i - 54) * 120
            }
            else if (i < 58) {
                bkg.x = 1580 + 440//
                bkg.y = 640 + (i - 56) * 120
            }
            else if (i < 60) {
                bkg.x = 2440//
                bkg.y = 680 - (i - 58) * 320
            }
            else if (i < 62) {
                bkg.x = 2780 + (i - 60) * 400
                bkg.y = 540
            }
            this.addChild(bkg)
            this.groupMap[i + 1] = bkg
        }

    }
    gameMap = {}
    setRec(rec, incomingIdx) {
        let playerNameMapPokerStr = {}
        for (let i = 0; i < 62; i++) {
            let gameIdx = i + 1
            let recData = rec[gameIdx]
            let bkg:BackendGroup = this.groupMap[gameIdx]
            bkg.setRec(recData)
            // bkg
        }

        // for (let i = 0; i < 38; i++) {
        //     let gameIdx = i + 1
        //     let game = rec[gameIdx]
        //     let player20Arr = this.gameMap[gameIdx]
        //     console.log('gameIdx', gameIdx, player20Arr);
        //     // let lPlayer: Player20 = player20Arr[0]
        //     // let rPlayer: Player20 = player20Arr[1]
        //     // let pokerStr = [pokerMap[gameIdx + '.0'], pokerMap[gameIdx + '.1']]
        //     console.log('gameIdx', gameIdx, pokerStr);
        //     if (game.player[0])
        //         lPlayer.setInfo(game.player[0], game.score[0], game.poker[0])
        //     if (game.player[1])
        //         rPlayer.setInfo(game.player[1], game.score[1], game.poker[1])
        //     let lScore = Number(game.score[0])
        //     let rScore = Number(game.score[1])
        //     lPlayer.setWin(1)
        //     rPlayer.setWin(1)
        //     if (lScore == 0 && rScore == 0) {
        //         lPlayer.winSp.visible = false
        //         rPlayer.winSp.visible = false
        //     }
        //     else {
        //         if (lScore < rScore)
        //             lPlayer.setWin(0.3)
        //         else
        //             rPlayer.setWin(0.3)
        //     }
        // }

    }
}