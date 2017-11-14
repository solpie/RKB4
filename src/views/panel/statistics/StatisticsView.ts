import { Statistics } from './Statistics';
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

    reset() {
        this.statistics.setLeftScore(0)
        this.statistics.setRightScore(0)
        this.statistics.setLeftFoul(0)
        this.statistics.setRightFoul(0)
    }
}
