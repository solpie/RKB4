export const WebDBCmd = {
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
    cs_showProgress: ``,
    sc_showProgress: ``,
    cs_hideProgress: ``,
    sc_hideProgress: ``,
    cs_startTimer: ``,
    sc_startTimer: ``,
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