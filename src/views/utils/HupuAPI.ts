import { $post, proxy, $get } from './WebJsFunc';
declare let $;
export let getHupuWS = (callback) => {
    callback('tcp.lb.liangle.com:3081')
}
const _proxyJSON = (url) =>
{ return proxy(url, 'json') }
//开题延时
export function setClientDelay(gameId, sec, callback) {
    let url = `http://pre.liangle.com/api/pbk/event/delay/` + gameId
    let data = { ':game_id': gameId + "", ctd: sec + '' }
    console.log(setClientDelay, data)
    $post(_proxyJSON(url), data, callback)
}

export function getClientDelay(gameId, callback) {
    let url = `http://pre.liangle.com/api/pbk/event/delay/` + gameId
    _get(_proxyJSON(url), callback)
}
export function getPreRoundPlayer(gameId, callback) {
    let url = 'http://api.liangle.com/api/passerbyking/game/wheel/ready/' + gameId
    _get(_proxyJSON(url), callback)
}

export function getAllPlayer(gameId, callback) {
    let url = 'http://api.liangle.com/api/passerbyking/game/players/' + gameId
    _get(_proxyJSON(url), callback)
}
//比赛xx站 gameid
export function getRoundList(callback) {
    let url = 'http://api.liangle.com/api/passerbyking/game/list'
    _get(_proxyJSON(url), callback)
}
export function getRtmpInfo(gameId, callback) {
    let url = 'http://api.liangle.com/api/passerbyking/game/info/' + gameId
    _get(_proxyJSON(url), callback)
}
export function getRoundRawData(gameId, callback) {
    let url = 'http://api.liangle.com/api/passerbyking/game/match/' + gameId
    _get(_proxyJSON(url), callback)
}

let _get = (url, callback) => {
    $get(url, callback)
}

export let getPlayerDoc = (callback) => {
    $get('/game/player', (res) => {
        callback(res)
    })
}

export let updatePlayerDoc = (playerDoc, callback) => {
    $post('/game/player/update', playerDoc, callback)
}

export let getGameInfo = (callback) => {
    _get('/game/', callback)
}

export let _avatar = (filename) => {
    return '/img/player/avatar/' + filename
}
