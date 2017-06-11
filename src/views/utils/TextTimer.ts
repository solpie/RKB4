import { formatSecond } from './JsFunc';
const TimerState = {
    PAUSE: 0,
    RUNNING: 1
};
// declare let PIXI;
export class TextTimer extends PIXI.Text {
    timeInSec = 0
    timerId = null
    timerState
    isMin = false
    set textInSec(v) {
        this.setTimeBySec(v)
    }
    
    setTimeBySec(sec) {
        this.timeInSec = sec
        this.text = formatSecond(this.timeInSec);
    }

    toggleTimer(state?) {
        var pauseTimer = () => {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = 0;
                this.timerState = TimerState.PAUSE;
            }
        };

        var playTimer = () => {
            if (this.timerId)
                clearInterval(this.timerId);
            this.timerId = setInterval(() => {
                // this.isMin ? this.timeInSec--
                //     : this.timeInSec++;
                if (this.isMin) {
                    this.timeInSec--
                    if (this.timeInSec < 0)
                        this.timeInSec = 0
                }
                else
                    this.timeInSec++
                this.text = formatSecond(this.timeInSec);
            }, 1000);
            this.timerState = TimerState.RUNNING;
        };

        if (state != null) {
            if (state == TimerState.PAUSE)
                pauseTimer();
            else if (state == TimerState.RUNNING)
                playTimer();
        }
        else {
            this.timerId ? pauseTimer() : playTimer()
        }
    }

    resetTimer() {
        this.timeInSec = 0;
        this.timerState = TimerState.PAUSE;
        this.text = formatSecond(this.timeInSec);
    }
}