import { BaseGameView } from "./BaseGame";
import LiveDataView from "./livedataView";
import { syncPlayerData } from "./Final2TeamConst";

let LVE = LiveDataView
let gameIdx = '1.20'
let playerDoc = '1.20.player'

export default class Final2TeamView extends BaseGameView {
    isLoadedCfg = false
    playerMap = {}
    gameInfoTable = []
    lHupuID = ''
    rHupuID = ''
    panelVersion = 'M4'
    liveDataView
    constructor(liveDataView: LiveDataView) {
        super()
        this.liveDataView = liveDataView
        this.initView()
    }

    onSyncPlayer() {
        syncPlayerData(playerDoc)
    }

    initView() {
        let lv = this.liveDataView

        lv.on(LVE.EVENT_SYNC_PLAYER, _ => {
            console.log('sync player info');
            this.onSyncPlayer()
        })
    }
}