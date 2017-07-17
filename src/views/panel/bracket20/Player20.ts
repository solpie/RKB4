import { FontName } from "../const";

export class Player20 extends PIXI.Container {
    nameText: PIXI.Text
    pokeText: PIXI.Text
    pokeSp: PIXI.Sprite
    constructor() {
        super()
        let ns = {
            fill: '#fff',
            fontWeight: 'bold',
            fontFamily: FontName.MicrosoftYahei,
            fontSize: '20px'
        }
        let nt = new PIXI.Text('',ns)
        nt.x = 40
        this.nameText = nt
        this.addChild(nt)

        let pt = new PIXI.Text('',ns)
        pt.x = 40
        this.pokeText = pt
        this.addChild(pt)

        let sp = new PIXI.Sprite()
        this.pokeSp = sp
        this.addChild(sp)
    }

    setInfo(playerName, poke = 'L1') {
        this.nameText.text = playerName
    }
}