import { getRoundList, getRtmpInfo } from "../utils/HupuAPI";
import { ascendingProp } from "../utils/JsFunc";

export class HomeView {
    gameDataArr = []
    gameArr = []
    selGameId: any = null
    selTitle: any = null
    links = []
    rtmpUrl = ''
    playUrl = ''
    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }
    init($vm) {
        getRoundList(res => {
            var gameDataArr = res.data;
            this.gameDataArr = [];
            for (var i = 0; i < gameDataArr.length; i++) {
                var gameData = gameDataArr[gameDataArr.length - 1 - i];
                if (Number(gameData.id) > 370) {
                    gameData.text = "[" + gameData.id + "]:" + gameData.title;
                    gameData.value = gameData.id;
                    this.gameDataArr.push(gameData);
                }
            }
            this.gameDataArr.sort(ascendingProp('id'))
            console.log(res, this.gameDataArr);
            this.gameArr = this.gameDataArr
        })
        this.onSelGameId(79)

    }

    onSelGameId(gameId) {
        console.log('onselgameId', gameId);
        this.links = [
            { title: "比分面板（蓝色）", url: `/panel.html?panel=score&m=0&gameId=${gameId}` },
            { title: "比分面板（绿色）", url: `/panel.html?panel=score&m=0&gameId=${gameId}` },
            { title: "八强面板", url: `/panel.html?panel=bracket&m=0&gameId=${gameId}` },
            // { title: "DmkLeecher", url: `/dmk` },
        ];

        getRtmpInfo(gameId, res1 => {
            console.log(res1);
            let p = res1.data.stream.publish
            this.rtmpUrl = p.url + "/" + p.stream
            this.playUrl = res1.data.stream.play
            this.selTitle = res1.title
        })


    }
}