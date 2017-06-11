import { TweenEx } from './TweenEx';
//delay in ms
export function delayCall(delay, callback) {
    // createjs.Tween.get(this).wait(delay).call(callback);
    // setTimeout(callback, delay/1000);
}

// export function blink(target, time = 80, loop = false) {
//     var blink = time;
//     // createjs.Tween.get(target, { loop: loop })
//     //     .to({ alpha: 1 }, blink)
//     //     .to({ alpha: 0 }, blink)
//     //     .to({ alpha: 1 }, blink)
//     //     .to({ alpha: 0 }, blink)
//     //     .to({ alpha: 1 }, blink);
// }
//time sec
export function blink2(options: { target: any, time?: number, loop?: number, callback?: any }) {
    // target, time = 0.08, loop = 0, callback = null
    let target = options.target
    let time = options.time || 80
    let callback = options.callback
    let loop = options.loop || Infinity
    function to1(a) {
        if (target.visible && loop > 0)
            new TweenEx(target)
                .to({ alpha: a }, time)
                .call(() => {
                    loop -= 1

                    to1(a ? 0 : 1);
                })
                .start()
        else {
            if (callback)
                callback()
            loop = -1
        }
    }
    to1(1);
}
//time ms
export function blink3(target, time = 80, loop = false) {
    var blink = time;
    new TweenEx(target)
        .to({ alpha: 1 }, blink)
        .to({ alpha: 0 }, blink)
        .to({ alpha: 1 }, blink)
        .to({ alpha: 0 }, blink)
        .to({ alpha: 1 }, blink)
        .start()
}

export function fadeOutCtn(ctn) {
    console.log(this, "show fade Out WinPanel");
    // createjs.Tween.get(ctn).to({ alpha: 0 }, 200)
    //     .call(function () {
    //         ctn.alpha = 1;
    //         ctn.removeAllChildren();
    //     });
}