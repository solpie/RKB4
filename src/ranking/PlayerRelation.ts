import { RKPlayer } from "./RankingPlayer";

export function findWinPath(start, end, playerMap, nodeNum, path = []) {
    if (!path.length)
        path.push(start)
    if (nodeNum > 0) {
        // console.log('start', start, 'end', end, path, num);
        for (let pid in playerMap[start].beatPlayerMap) {
            if (path.indexOf(pid) > -1) {
                // console.log('back', playerMap[pid].name);
            } else {
                let p = playerMap[pid]
                return findWinPath(pid, end, playerMap, nodeNum - 1, path.concat([pid]))
            }
        }
    } else {
        // console.log('out start', start, 'end', end, path, num);
        for (let pid in playerMap[start].beatPlayerMap) {
            if (pid == end) {
                path.push(pid)
                // logPath(path, playerMap)
                return path
            }
        }
    }
}
export function logPath(path, playerMap) {
    let pathStr = ""
    let lastPid = ""
    for (let p2 of path) {
        if (lastPid)
            pathStr += ' ' + Math.floor(playerMap[lastPid].beatPlayerMap[p2] * 100) + '%'
        lastPid = p2
        pathStr += "->" + playerMap[p2].name
        //+ '[' + p2 + ']'
    }
    console.log('path', pathStr);
}
export function isAwinB(playerA: RKPlayer, playerB: RKPlayer, playerMap) {
    let nodeNum = 0
    while (nodeNum < 2) {
        if (findWinPath(playerA.player_id, playerB.player_id, playerMap, 0))
            return true
        nodeNum++
    }
    return false
}