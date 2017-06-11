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