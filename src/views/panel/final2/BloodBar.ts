import { imgLoader } from "../../utils/ImgLoader";

export class BloodBar extends PIXI.Container {
    bloodArr: Array<PIXI.Sprite> = []
    isLeft: Boolean
    initNum: Number = -1
    constructor(isLeft: Boolean, isSmall = false) {
        super()
        this.isLeft = isLeft
        this.initBar(isSmall)
    }

    initBar(isSmall) {
        for (let b of this.bloodArr) {
            b.parent.removeChild(b)
        }
        this.bloodArr = []
        let bloodType = isSmall ? '1' : '2';
        let bloodMax = isSmall ? 3 : 5;
        let bloodInvert = isSmall ? 75 : 62;
        imgLoader.loadTex(`/img/panel/final2/score/blood${bloodType}.png`, tex => {
            let invert = bloodInvert
            for (let i = 0; i < bloodMax; i++) {
                let b = new PIXI.Sprite()
                b.texture = tex
                if (this.isLeft) {
                    b.x = 865 - i * invert
                    b.scale.x = -1
                }
                else
                    b.x = 1055 + i * invert
                b.y = 975
                this.addChild(b)
                this.bloodArr.push(b)
            }
            if (this.initNum > 0) {
                this.setBlood(this.initNum)
            }
        })
    }

    setBlood(num) {
        console.log('set blood', num);
        this.initNum = num
        for (let i = 0; i < this.bloodArr.length; i++) {
            let b = this.bloodArr[i];
            b.visible = i < num
        }
    }
}