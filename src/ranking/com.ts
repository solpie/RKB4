export function countMap(map) {
    return Object.keys(map).length
}

export const arrMove = (arr, from, to) => {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr
};

export const findRankIn = (player: { player_id: string }, rankInArr) => {
    for (let i = 0; i < rankInArr.length; i++) {
        let p = rankInArr[i];
        if (p.player_id == player.player_id) {
            return i;
        }
    }
    return -1
}

