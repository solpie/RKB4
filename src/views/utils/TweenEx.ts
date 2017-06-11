declare let TWEEN;
export class TweenEx {
    target
    vars
    eventArr
    updateFunc
    //duration ms
    constructor(target) {
        this.target = target
        this.eventArr = []
    }
    to(vars, duration) {
        this.eventArr.push({ event: 'to', data: { vars: vars, duration: duration } })
        return this
    }
    delay(duration) {
        this.eventArr.push({ event: 'delay', data: { duration: duration } })
        return this
    }
    update(callback) {
        this.updateFunc = callback
        return this
    }
    start() {
        let run = () => {
            let e = this.eventArr.shift()
            if (e) {
                if (e.event == 'to') {
                    // e.data.vars.onComplete = () => { run() }
                    // TweenLite.to(this.target, e.data.duration, e.data.vars)
                    //Tweenjs
                    let fromVars = {}
                    for (let k in e.data.vars) {
                        fromVars[k] = this.target[k]
                    }
                    new TWEEN.Tween(fromVars)
                        .to(e.data.vars, e.data.duration)
                        .onUpdate(() => {
                            for (let k in e.data.vars) {
                                this.target[k] = fromVars[k]
                            }
                            if (this.updateFunc)
                                this.updateFunc(this.target)
                        })
                        .onComplete(() => {
                            run()
                        })
                        .start();
                }
                else if (e.event == 'delay') {
                    // TweenLite.delayedCall(e.data.duration, () => {
                    //     run()
                    // })
                    new TWEEN.Tween({ _: 0 })
                        .to({ _: 0 }, e.data.duration)
                        .onComplete(() => {
                            run()
                        })
                        .start();
                }
                else if (e.event == 'call') {
                    e.data.callback(this)
                    run()
                }
            }
            else {
                this.target = null
                this.eventArr = null
                this.vars = null
            }
        }
        run()
        return this
    }
    call(callback) {
        if (callback)
            this.eventArr.push({ event: 'call', data: { callback: callback } })
        return this
    }
    // static to = TweenLite.to
    static to(target, duration, vars, callback?): TweenEx {
        return new TweenEx(target)
            .to(vars, duration)
            .call(callback)
            .start()
    }
    // static delayedCall = TweenLite.delayedCall
    static delayedCall(duration, callback) {
        new TweenEx({ _: 0 })
            .delay(duration)
            .call(callback)
            .start()
    }
}
