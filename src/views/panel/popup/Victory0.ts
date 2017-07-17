import { newModal } from '../../utils/PixiEx';
import { IPopup } from './PopupView';

export class Victory0 extends PIXI.Container implements IPopup {
    static class = 'Victory0'

    create(parent: any) {
        this.addChild(newModal(0.7))
        
    }
    show: (param: any) => void;
    hide: () => void;

}