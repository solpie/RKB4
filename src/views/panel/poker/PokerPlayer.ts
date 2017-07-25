
export class PokerPlayer extends PIXI.Container {
    avt: PIXI.Sprite
    nameText: PIXI.Text
    infoText: PIXI.Text
    constructor() {
        super()
        let avt = new PIXI.Sprite()
        avt.x = 20
        avt.y = 20
        this.addChild(avt)
        this.avt = avt

        let nameText = new PIXI.Text()
        nameText.x = 20
        nameText.y = 40
        this.addChild(nameText)
        this.nameText = nameText

        let infoText = new PIXI.Text()
        infoText.x = 20
        infoText.y = 80
        this.addChild(infoText)
        this.infoText = infoText
    }
    
    setInfo(playerData) {
        this.nameText.text = playerData.name
        this.infoText.text = playerData.height + " CM /" + playerData.weight + ' KG'
    }
}