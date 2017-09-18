import { ViewConst } from '../const';
import { imgLoader } from '../../utils/ImgLoader';
import { IPopup } from "./PopupView";

class ImgConf {
    name: string
    url: string
    x: number
    y: number
    sp: PIXI.Sprite
    group: string
    constructor(name, x, y, url) {
        this.name = name
        this.x = x
        this.y = y
        this.url = url
    }
}
export class StaticImg extends PIXI.Container implements IPopup {
    static class = 'StaticImg'
    p: any;
    create(parent) {
        this.p = parent
        this.imgConfMap['bd1'] = new ImgConf('bd1',
            0, ViewConst.STAGE_HEIGHT - 190,
            '/img/bd/bd1.png')
        this.imgConfMap['bd2'] = new ImgConf('bd2',
            0, ViewConst.STAGE_HEIGHT - 190,
            '/img/bd/bd2.png')
            
        this.imgConfMap['bd1'].group = 'bd'
        this.imgConfMap['bd2'].group = 'bd'
    };
    show(param: any) {
        for (let k in this.imgConfMap) {
            let ic: ImgConf = this.imgConfMap[k]
            if (ic.name == param.name) {
                if (!ic.sp)
                    imgLoader.loadTex(ic.url, tex => {
                        ic.sp = new PIXI.Sprite(tex)
                        ic.sp.x = ic.x
                        ic.sp.y = ic.y
                        this.p.addChild(ic.sp)
                    })
                else
                    this.p.addChild(ic.sp)
            }
        }
    };
    hide(param) {
        for (let k in this.imgConfMap) {
            let ic: ImgConf = this.imgConfMap[k]
            if (ic.name == param.name) {
                if (ic.group) {
                    for (let k2 in this.imgConfMap) {
                        let ic2: ImgConf = this.imgConfMap[k2]
                        if (ic2.group == ic.group) {
                            this.p.removeChild(ic2.sp)
                        }
                    }
                }
                this.p.removeChild(ic.sp)
            }
        }
    };
    imgConfMap = {}
}