export const WebDBCmd = {
    //popup
    //rawday client
    init: '',
    pull: ``,
    cs_pull: ``,
    //game month
    cs_init: ``,
    sc_init: ``,
    cs_bracketInit: ``,
    sc_bracketInit: ``,
    cs_startGame: ``,
    sc_startGame: ``,
    cs_showGroupRank: ``,//小组排名
    sc_showGroupRank: ``,
    cs_hideGroupRank: ``,
    sc_hideGroupRank: ``,
    cs_startTimer: ``,
    sc_startTimer: ``,
    cs_setTimer: ``,
    sc_setTimer: ``,
    cs_commit: ``,
    sc_commit: ``,
    cs_score: ``,
    sc_score: ``,
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