import { PokerPlayer } from './PokerPlayer';
export class PokerView {
    pokerPlayer: Array<PokerPlayer>
    pokerMap: any
    constructor() {
        this.pokerPlayer = []
        for (let i = 0; i < 12; i++) {
            let p = new PokerPlayer
            this.pokerPlayer.push(p)
        }
        this.pokerMap = {}
    }
    /**
     * p1 d1
     *
     * 
     */
    show(data) {
        let rowNum = data.rowNum
        if (rowNum == 4) {
            for (let i = 0; i < 4; i++) {
                let pokerPlayer = this.pokerPlayer[i];
                pokerPlayer.x = 20 + i * 150
                pokerPlayer.y = 200
            }
            for (let i = 0; i < 4; i++) {
                let pokerPlayer = this.pokerPlayer[4 + i];
                pokerPlayer.x = 20 + i * 150
                pokerPlayer.y = 200
            }
        }
        else if (rowNum == 6) {

        }
    }
}