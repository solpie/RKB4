export const WebDBCmd = {
    //popup
    //rawday client
    init: '',
    pull: ``,
    cs_pull: ``,
    //common
    cs_showNotice: ``,//公告
    sc_showNotice: ``,
    //game month
    cs_init: ``,
    sc_init: ``,
    cs_bracketInit: ``,
    sc_bracketInit: ``,
    cs_startGame: ``,
    sc_startGame: ``,
    cs_showGroupRank: ``,//小组排名
    sc_showGroupRank: ``,
    cs_showChampion: ``,//冠军title
    sc_showChampion: ``,
    cs_showGamePlayerInfo: ``,//球员intro信息
    sc_showGamePlayerInfo: ``,
    cs_showVictory: ``,//本场获胜
    sc_showVictory: ``,
    cs_startTimer: ``,
    sc_startTimer: ``,
    cs_setTimer: ``,
    sc_setTimer: ``,
    cs_commit: ``,
    sc_commit: ``,
    cs_score: ``,
    sc_score: ``,
    cs_showScore: ``,//显示隐藏比分面板
    sc_showScore: ``,
    cs_panelCreated: ``,
    sc_panelCreated: ``,
    cs_bracketCreated: ``,
    sc_bracketCreated: ``,
    //base cmd
    cs_srvCreated: ``,
    sc_srvCreated: ``
}
for (var k in WebDBCmd) {
    WebDBCmd[k] = k;
}