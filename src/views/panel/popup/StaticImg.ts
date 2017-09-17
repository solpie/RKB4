import { IPopup } from "./PopupView";

class ImgConf {
    name: string
    url: string
    x: number
    y: number
}
export class StaticImg extends PIXI.Container implements IPopup {
    static class = 'StaticImg'
    create: (parent: any) => void;
    show: (param: any) => void;
    hide: () => void;
    imgConfMap = {}
}