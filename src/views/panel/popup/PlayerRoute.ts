import { newBitmap } from '../../utils/PixiEx';
export class PlayerRoute extends PIXI.Container {
    constructor() {
        super()
        let bg = newBitmap({ url: '/img/panel/process/routeBg.png' })
        this.addChild(bg)
        bg.x = 10
        bg.y = 10
    }
}