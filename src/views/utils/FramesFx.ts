import { paddy } from '../utils/JsFunc';
export class FramesFx extends PIXI.Container {
    mc: any
    constructor(imgUrlBase, from, to, numPad = 2) {
        super()
        let imgArr = [];
        for (var i = from; i < to + 1; i++) {
            imgArr.push(imgUrlBase + paddy(i, numPad) + '.png')
        }
        let textureArray = [];

        for (let i = 0; i < imgArr.length; i++) {
            let texture = PIXI.Texture.fromImage(imgArr[i]);
            textureArray.push(texture);
        };

        let mc = new PIXI.extras['AnimatedSprite'](textureArray);
        mc.animationSpeed = .3
        mc.loop = false;
        this.addChild(mc)
        this.mc = mc
        mc.onComplete = () => {
            this.emit('complete')
        }
        // console.log('mc', mc)
    }
    onComplete(callback) {

    }
    show() {
        this.mc.play()
    }
    gotoAndStop(frame) {
        this.mc.gotoAndStop(frame)
    }
    playOnce() {
        this.mc.gotoAndStop(0)
        this.mc.play()
    }
}