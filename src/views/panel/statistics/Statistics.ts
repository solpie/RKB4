import { imgLoader } from '../../utils/ImgLoader';
import { BitmapText, newBitmap, setScale } from '../../utils/PixiEx';
export class Statistics extends PIXI.Container {
    leftFoulText: BitmapText;
    rightFoulText: BitmapText;
    leftScoreText: BitmapText;
    rightScoreText: BitmapText;
    ctn: any;
    constructor(parent) {
        super();
        var bigScoreCtn = new PIXI.Container()
        parent.addChild(bigScoreCtn);
        this.ctn = bigScoreCtn;

        //////////////////
        var bg = newBitmap({ url: '/img/panel/statistics/bg.jpg' });
        bigScoreCtn.addChild(bg);

        imgLoader.loadTex('/img/panel/statistics/scoreNum.png', tex => {
            let sheet = {
                text: '0',
                animations: {
                    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
                    "5": 5, "6": 6, "7": 7, "8": 8, "9": 9
                },
                texture: tex,
                frames: [
                    [0, 0, 315, 435],
                    [316, 0, 315, 435],
                    [0, 436, 315, 435],
                    [316, 436, 315, 435],
                    [632, 0, 315, 435],
                    [632, 436, 315, 435],
                    [948, 0, 315, 435],
                    [948, 436, 315, 435],
                    [0, 872, 315, 435],
                    [316, 872, 315, 435]]
            }

            let leftScoreText = new BitmapText(sheet)
            leftScoreText.x = 260;
            leftScoreText.y = 210;
            this.leftScoreText = leftScoreText;
            bigScoreCtn.addChild(leftScoreText);

            var rightScoreText = new BitmapText(sheet);
            rightScoreText.x = 1380;
            rightScoreText.y = leftScoreText.y;
            this.rightScoreText = rightScoreText;
            bigScoreCtn.addChild(rightScoreText);


            ///
            var leftFoulText = new BitmapText(sheet);
            leftFoulText.x = 730;
            leftFoulText.y = 170;
            this.leftFoulText = leftFoulText;
            bigScoreCtn.addChild(leftFoulText);

            var rightFoulText = new BitmapText(sheet);
            rightFoulText.x = 1025;
            rightFoulText.y = leftFoulText.y;
            this.rightFoulText = rightFoulText;
            bigScoreCtn.addChild(rightFoulText);

            setScale(leftFoulText, 0.6)
            setScale(rightFoulText, 0.6)
        })


        // var foulSheet = new createjs.SpriteSheet({
        //     animations: {
        //         "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
        //         "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "x": 10
        //     },
        //     images: ["/img/panel/screen/score/foulNum.png"],
        //     frames: [
        //         [166, 0, 165, 255],
        //         [332, 256, 165, 255],
        //         [332, 0, 165, 255],
        //         [0, 256, 165, 255],
        //         [166, 256, 165, 255],
        //         [0, 0, 165, 255],
        //         [498, 0, 165, 255],
        //         [498, 256, 165, 255],
        //         [0, 512, 165, 255],
        //         [166, 512, 165, 255],
        //         [332, 512, 165, 255]
        //     ]
        // });



    }

    setLeftScore(leftScore: number) {
        this.leftScoreText.text = `${leftScore}`;
    }

    setRightScore(rightScore: number) {
        this.rightScoreText.text = `${rightScore}`;
    }

    setLeftFoul(foulNum: number) {
        if (foulNum < 0) return;
        if (foulNum > 9)
            this.leftFoulText.text = 'x';
        else
            this.leftFoulText.text = `${foulNum}`;
    }

    setRightFoul(foulNum: number) {
        if (foulNum < 0) return;
        if (foulNum > 9)
            this.rightFoulText.text = 'x';
        else
            this.rightFoulText.text = `${foulNum}`;
    }

    reset() {
        this.setLeftFoul(0);
        this.setRightFoul(0);
        this.setLeftScore(0);
        this.setRightScore(0);
    }
}
