import { PokerPlayer } from '../poker/PokerPlayer';
import { imgLoader } from '../../utils/ImgLoader';
import { newBitmap } from '../../utils/PixiEx';
import { Player20 } from './Player20';

export const zoomMax = 2
const pokerMap = {
    '1.0': 'L1',
    '1.1': 'R1',
    '2.0': 'L2',
    '2.1': 'R2',
    '3.0': 'L3',
    '3.1': 'R3',
    '4.0': 'L4',
    '4.1': 'R4',

    '5.0': 'L5',
    '5.1': 'R5',
    '6.0': 'L6',
    '6.1': 'R6',
    '7.0': 'L7',
    '7.1': 'R7',
    '8.0': 'L8',
    '8.1': 'R8',

    '9.0': 'L9',
    '10.0': 'R9',

    '11.0': 'L10',
    '12.0': 'R10',
}
export class Bracket20 extends PIXI.Container {
    gameMap = {}
    incomingSp: PIXI.Sprite
    posMap: any
    pokerPlayer: PokerPlayer
    playerNameMapPoker = {}
    constructor(stage) {
        super()
        stage.addChild(this)

        let bg = newBitmap({ url: '/img/panel/bracket/final/bracketBg.png' })
        this.addChild(bg)
        let bg2 = newBitmap({ url: '/img/panel/bracket/final/bracket.png' })
        this.addChild(bg2)
        let x1 = 78
        let y1 = 82
        let y1_2 = 750
        let yI1_2 = 80
        let yI1 = 159

        let x2 = 395
        let y2 = 45
        let yI2 = 78

        let x2_2 = 365
        let y2_2 = 730
        let yI2_2 = 80

        let x3 = 712
        let y3 = 82
        let yI3 = 160

        let x3_2 = 652
        let y3_2 = 710
        let yI3_2 = yI2_2

        let x7 = x3
        let y7 = 645
        let yI7 = yI2_2

        let x4 = 1030
        let x4_2 = 930
        let x5 = 1168

        // let x6 = 1130
        let posMap = {
            '1': [x1, y1],
            '2': [x1, y1 + yI1 * 1],
            '3': [x1, y1 + yI1 * 2],
            '4': [x1, y1 + yI1 * 3 + 3],
            '5': [x2, y2 + yI2 * 1],
            '6': [x2, y2 + yI2 * 3],
            '7': [x2, y2 + yI2 * 5 + 4],
            '8': [x2, y2 + yI2 * 7 + 10],
            '9': [x2, y2 + yI2 * 0],
            '10': [x2, y2 + yI2 * 2],
            '11': [x2, y2 + yI2 * 4 + 2],
            '12': [x2, y2 + yI2 * 6 + 6],
            '13': [x1, y1_2 + yI1_2 * 3],
            '14': [x1, y1_2 + yI1_2 * 2],
            '15': [x1, y1_2 + yI1_2 * 1],
            '16': [x1, y1_2 + yI1_2 * 0],
            '17': [x2_2, y2_2 + yI2_2 * 3],
            '18': [x2_2, y2_2 + yI2_2 * 2],
            '19': [x2_2, y2_2 + yI2_2 * 1],
            '20': [x2_2, y2_2 + yI2_2 * 0],
            '21': [x3, y3 + yI3 * 0],
            '22': [x3, y3 + yI3 * 1],
            '23': [x3, y3 + yI3 * 2],
            '24': [x3, y3 + yI3 * 3],
            '25': [x3_2, y3_2 + yI3_2 * 1],
            '26': [x3_2, y3_2 + yI3_2 * 0],
            '27': [x3_2, y3_2 + yI3_2 * 3],
            '28': [x3_2, y3_2 + yI3_2 * 2],
            '29': [x4_2, 750],
            '30': [x4_2, 910],
            '31': [x4, 162],
            '32': [x4, 482],
            '33': [x5, 870],
            '34': [x5, 710],
            '35': [1405, 795],
            '36': [1345, 320],
            '37': [1650, 758],
            '38': [1662, 448],
            // '39': [1690, 365],
        }
        this.posMap = posMap
        let smallMap = {
            '29': true,
            '30': true,
            '33': true,
            '34': true,
            '35': true,
        }
        imgLoader.loadTexArr([
            '/img/panel/bracket/final/pokerBlack.png',
            '/img/panel/bracket/final/pokerRed.png',
            '/img/panel/bracket/final/winHint.png',
        ], _ => {
            for (let i = 0; i < 38; i++) {
                let pos = posMap[i + 1]
                pos[0] *= zoomMax
                pos[1] *= zoomMax
                let isSmall = Boolean(smallMap[i + 1])
                let lPlayer = new Player20(isSmall)
                lPlayer.x = pos[0]
                lPlayer.y = pos[1]

                lPlayer.setInfo('', '')

                let rPlayer = new Player20(isSmall)
                rPlayer.x = lPlayer.x
                rPlayer.y = lPlayer.y + 35 * zoomMax

                rPlayer.setInfo('', '')
                this.addChild(lPlayer)
                this.addChild(rPlayer)
                this.gameMap[i + 1] = [lPlayer, rPlayer]
            }



            let incoming = newBitmap({ url: '/img/panel/bracket/final/incoming.png' })
            // this.addChild(incoming)
            incoming.scale.x = incoming.scale.y = .5
            this.incomingSp = incoming
            this.initKey()
            this.scale.x = this.scale.y = 0.5
        }, false)

    }
    setFirstView() {
        this.x = 0
        this.scale.x = this.scale.y = .8
        this.y = -30
    }
    initKey() {
        window.onkeyup = (e) => {
            if (e.keyCode == 219) {
                //zoom out 缩小
                console.log('zoom out');
                this.scale.x = this.scale.y = .5
                this.x = this.y = 0
            }
            else if (e.keyCode == 81) {//q
                this.setFirstView()
            }
            else if (e.keyCode == 65) {//a
                this.x = 0
                this.y = -1080
                this.scale.x = this.scale.y = 1
            }
            else if (e.keyCode == 87) {//w
                this.x = -1920 * .3
                this.y = 0
                this.scale.x = this.scale.y = 1
            }
            else if (e.keyCode == 83) {//s
                this.x = -1920 * .2
                this.y = -1080
                this.scale.x = this.scale.y = 1
            }
            else if (e.keyCode == 69) {//e
                this.x = -1920
                this.y = -50
                this.scale.x = this.scale.y = 1
            }
            else if (e.keyCode == 68) {//d
                this.x = -1920
                this.y = -1080
                this.scale.x = this.scale.y = 1
            }
            else if (e.keyCode == 221) {
                //zoom in
                console.log('zoom in');
                this.scale.x = this.scale.y = 1
            }

            console.log('key up', e.keyCode);
        }
        let isPress = false
        let lastX = 0, lastY = 0
        let onMouseMove = (e) => {
            if (isPress && this.scale.x != .5) {
                this.x += e.movementX
                this.y += e.movementY
                if (this.x > 0)
                    this.x = 0
                if (this.y > 0)
                    this.y = 0
                if (this.x < -1920)
                    this.x = -1920
                if (this.y < -1080)
                    this.y = -1080
            }
        }
        window.onmousemove = (e) => {
            // console.log('move', e.movementX, e.movementX);
            onMouseMove(e)
        }
        window.onmouseup = (e) => {
            isPress = false
        }
        window.onmousedown = (e) => {
            isPress = true
        }
    }

    setRec(rec, incomingIdx) {
        for (let i = 0; i < 38; i++) {
            let gameIdx = i + 1
            let game = rec[gameIdx]
            let player20Arr = this.gameMap[gameIdx]
            let lPlayer: Player20 = player20Arr[0]
            let rPlayer: Player20 = player20Arr[1]
            let pokerStr = [pokerMap[gameIdx+'.0'],pokerMap[gameIdx+'.1']]
            console.log('gameIdx',gameIdx,pokerStr);
            if (game.player[0])
                lPlayer.setInfo(game.player[0], game.score[0], pokerStr[0])
            if (game.player[1])
                rPlayer.setInfo(game.player[1], game.score[1], pokerStr[1])
            let lScore = Number(game.score[0])
            let rScore = Number(game.score[1])
            lPlayer.setWin(1)
            rPlayer.setWin(1)
            if (lScore == 0 && rScore == 0) {
                lPlayer.winSp.visible = false
                rPlayer.winSp.visible = false
            }
            else {
                if (lScore < rScore)
                    lPlayer.setWin(0.3)
                else
                    rPlayer.setWin(0.3)
            }
        }
        let pos = this.posMap[incomingIdx]
        if (pos) {
            this.incomingSp.x = pos[0] - 40
            this.incomingSp.y = pos[1] - 20 * zoomMax
        }
    }
}