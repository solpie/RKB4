import { Statistics } from './Statistics';
import { WebDBCmd } from '../webDBCmd';
import { $post } from '../../utils/WebJsFunc';
declare let io;
export class StatisticsView {
    statistics: Statistics
    constructor(parent) {
        this.statistics = new Statistics(parent)
    }

    setScore(data) {
        if ('leftScore' in data)
            this.statistics.setLeftScore(data.leftScore)
        if ('rightScore' in data)
            this.statistics.setRightScore(data.rightScore)

        if ('leftFoul' in data)
            this.statistics.setLeftFoul(data.leftFoul)
        if ('rightFoul' in data)
            this.statistics.setRightFoul(data.rightFoul)
    }
    initLocal() {
        let localWs = io.connect(`/rkb`)
        localWs.on('connect', (msg) => {
            // if (!this.isInit) {
            // this.isInit = true
            setTimeout(_ => {
                $post(`/emit/${WebDBCmd.cs_bracket24Created}`, { _: null })
            }, 3000)
            console.log('connect', window.location.host)
        })
            .on(`${WebDBCmd.sc_init}`, (data) => {
                
            })
    }
    reset() {
        this.statistics.setLeftScore(0)
        this.statistics.setRightScore(0)
        this.statistics.setLeftFoul(0)
        this.statistics.setRightFoul(0)
    }
}
