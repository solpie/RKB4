import { IPopup } from './PopupView';
import { newBitmap } from '../../utils/PixiEx';
export class GameProcess extends PIXI.Container implements IPopup {
    static class = 'GameProcess'
    p: PIXI.Container
    create(parent: any) {
        this.p = parent
        let bg = newBitmap({ url: '/img/panel/process/bg.png' })
        this.addChild(bg)
    };

    show(param) {
        this.p.addChild(this)
    }
    hide() {
        this.p.removeChild(this)
    }

}