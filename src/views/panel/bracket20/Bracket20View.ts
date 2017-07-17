import { Bracket20 } from './Bracket20';
declare let $;
declare let io;
export class Bracket20View {
    bracket: Bracket20
    isMonth: boolean
    constructor(stage) {
        this.bracket = new Bracket20(stage)
     }
}