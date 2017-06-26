import { newModal, newWhiteMask } from '../../utils/PixiEx';
import { IPopup } from "./PopupView";

export class Victory extends PIXI.Container implements IPopup {
    ctn: any
    create(parent: any) {
        this.ctn = parent
        this.ctn.addChild(this)

        this.addChild(newModal())
    }

    show(param: any) {
        this.ctn.addChild(this)
        console.log('show victory',param)
    }

    hide() {
        if (this.parent)
            this.parent.removeChild(this)
    }
}