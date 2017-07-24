import { newBitmap } from '../../utils/PixiEx';
import { Player20 } from './Player20';
export class Bracket20 extends PIXI.Container {
    gameMap = {}
    incomingSp: PIXI.Sprite
    posMap: any
    constructor(stage) {
        super()
        stage.addChild(this)

        let bg = newBitmap({ url: '/img/panel/bracket/final/bracket.png' })
        this.addChild(bg)
        let x1 = 30
        let yI2 = 61
        let x2 = 300
        let yI3 = 61
        let y4 = 673
        let yI4 = 61

        let x3 = 580
        let y5 = 152
        let yI5 = 122

        let x6 = x3
        let y6 = 645
        let yI6 = yI4

        let x7 = x3
        let y7 = 645
        let yI7 = yI4

        let x4 = 855
        let x5 = 1130
        // let x6 = 1130
        let posMap = {
            '1': [x1, 150],
            '2': [x1, 150 + 123 * 1],
            '3': [x1, 150 + 123 * 2],
            '4': [x1, 150 + 123 * 3],
            '5': [x2, 122 + yI2 * 1],
            '6': [x2, 122 + yI2 * 3],
            '7': [x2, 122 + yI2 * 5],
            '8': [x2, 122 + yI2 * 7],
            '9': [x2, 122 + yI2 * 0],
            '10': [x2, 122 + yI2 * 2],
            '11': [x2, 122 + yI2 * 4],
            '12': [x2, 122 + yI2 * 6],
            '13': [x1, 705 + yI3 * 3],
            '14': [x1, 705 + yI3 * 2],
            '15': [x1, 705 + yI3 * 1],
            '16': [x1, 705 + yI3 * 0],
            '17': [x2, y4 + yI4 * 3],
            '18': [x2, y4 + yI4 * 2],
            '19': [x2, y4 + yI4 * 1],
            '20': [x2, y4 + yI4 * 0],
            '21': [x3, y5 + yI5 * 0],
            '22': [x3, y5 + yI5 * 1],
            '23': [x3, y5 + yI5 * 2],
            '24': [x3, y5 + yI5 * 3],
            '25': [x6, y6 + yI6 * 1],
            '26': [x6, y6 + yI6 * 0],
            '27': [x6, y6 + yI6 * 3],
            '28': [x6, y6 + yI6 * 2],
            '29': [x4, 670],
            '30': [x4, 795],
            '31': [x4, 212],
            '32': [x4, 457],
            '33': [x5, 764],
            '34': [x5, 640],
            '35': [1410, 705],
            '36': [x5, 335],
            '37': [1690, 675],
            '38': [1410, 365],
            '39': [1690, 365],
        }
        this.posMap = posMap
        for (let i = 0; i < 39; i++) {
            let pos = posMap[i + 1]
            let lPlayer = new Player20()
            lPlayer.x = pos[0]
            lPlayer.y = pos[1]
            lPlayer.setInfo('', '')

            let rPlayer = new Player20()
            rPlayer.x = lPlayer.x
            rPlayer.y = lPlayer.y + 25
            rPlayer.setInfo('', '')
            this.addChild(lPlayer)
            this.addChild(rPlayer)
            this.gameMap[i + 1] = [lPlayer, rPlayer]
        }

        let incoming = newBitmap({ url: '/img/panel/bracket/final/incoming.png' })
        this.addChild(incoming)
        this.incomingSp = incoming
    }

    setRec(rec, incomingIdx) {
        for (let i = 0; i < 39; i++) {
            let gameIdx = i + 1
            let game = rec[gameIdx]
            let player20Arr = this.gameMap[gameIdx]
            let lPlayer: Player20 = player20Arr[0]
            let rPlayer: Player20 = player20Arr[1]
            // if(game.score[0]!=0&&game.score[1]!=0)
            if (game.player[0])
                lPlayer.setInfo(game.player[0], game.score[0])
            if (game.player[1])
                rPlayer.setInfo(game.player[1], game.score[1])
            let lScore = Number(game.score[0])
            let rScore = Number(game.score[1])
            lPlayer.setAlpha(1)
            rPlayer.setAlpha(1)
            if (lScore == 0 && rScore == 0) {
            }
            else {
                if (lScore < rScore)
                    lPlayer.setAlpha(0.3)
                else
                    rPlayer.setAlpha(0.3)
            }
        }
        let pos = this.posMap[incomingIdx]
        if (pos) {
            this.incomingSp.x = pos[0]
            this.incomingSp.y = pos[1]-20
        }
    }
}