export function getFtlogoUrl(ftName) {
    return '/img/ft/' + ftName + '.jpg'
}

export function getFtLineUrl(ftId) {
    return '/img/ft/' + ftId + 'L.png'
}

export function getFtLogoUrl2(ftId) {
    return '/img/ft/' + ftId + '.jpg'
    // 1 => 'Gambia',
    //     2 => 'TSH',
    //     3 => 'Fe3O4',
    //     4 => 'FTG',
    //     5 => '3P-Shot',
    //     6 => 'Bravo！',
    //     7 => 'XJBD',
    //     8 => 'GreenLight',
}
export function getFtLogoUrlgray(ftId) {
    return '/img/ft/' + ftId + 'g.png'
}
export function getFtLogoUrlm(ftId) {
    return '/img/ft/' + ftId + 'm.png'
}
const ftName = {
    '1': 'Gambia',
    '2': 'TSH',
    '3': 'Fe3O4',
    '4': 'FTG',
    '5': '3P-Shot',
    '6': 'Bravo!',
    '7': 'XJBD',
    '8': 'GreenLight',
}

export function getFtName(ftId) {
    return ftName[ftId] || ''
}

export function getFtId(fn) {
    for (let k in ftName) {
        if (fn == ftName[k]) {
            return k
        }
    }
}

export const MatchType = {
    PreGame: 1,
    Master: 2,
    Final: 3,
    RawDay: 4
};

export function simplifyName(n: string) {
    if (n.substring(0, 3) == '安云鹏')
        return '安云鹏'
    return n||''
}