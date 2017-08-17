import { BaseGameView, syncDoc, buildPlayerData } from './BaseGame';
import LiveDataView from './livedataView';
import { WebDBCmd } from "../../panel/webDBCmd";
import { $post } from "../../utils/WebJsFunc";
import { routeBracket } from "../../panel/bracket20/Bracket20Route";
import { getAllPlayer } from "../../utils/HupuAPI";
import { PlayerInfo } from "./PlayerInfo";
let gameDate = 730
declare let io;
export default class DoubleEliminationView extends BaseGameView {
    //gameIdx from 1 - 39
    nameMapHupuId = {}
    pokerMapPlayer = {}
    gameInfoTable = []
    delayEmitGameInfo = 0
    lHupuID = ''
    rHupuID = ''
    liveDataView
    constructor(liveDataView: LiveDataView) {
        super()
        this.liveDataView = liveDataView
        liveDataView.on(LiveDataView.EVENT_INIT_DOUBLE_ELIMATION, _ => {
            this.init()
        })
        // EVENT_INIT_DOUBLE_ELIMATION
        // this.init()
    }

    init() {
        let liveDataView = this.liveDataView
        syncDoc(gameDate, doc => {
            console.log('sync doc', doc);
            // if (!doc['rec']) {
            // this.initBracket(doc)
            this.initPlayer(_ => {
                this.initView(doc)
            })
            // }
        })
        liveDataView.on(WebDBCmd.cs_init, data => {
            console.log('DoubleElimination cs_init', data);
            syncDoc(gameDate, doc => {
                this.emitGameInfo()
                $post(`/emit/${WebDBCmd.cs_bracket20Init}`, doc)
            })
        })

        liveDataView.on(WebDBCmd.cs_score, data => {
            console.log('DoubleElimination', data);
            this.lScore = data.leftScore
            this.rScore = data.rightScore
        })

        liveDataView.on(WebDBCmd.cs_commit, data => {
            console.log(this, 'cs_commit', data);
            this.commit()
        })

        liveDataView.on(liveDataView.EVENT_SET_GAME_INFO, gameIdx => {
            console.log(this, 'EVENT_SET_GAME_INFO', gameIdx);
            this.setGameInfo(gameIdx)
        })

        liveDataView.on(liveDataView.EVENT_INIT_BRACKET, _ => {
            console.log(this, 'EVENT_INIT_BRACKET');
            syncDoc(gameDate, doc => {
                console.log('sync doc', doc);
                this.initBracket(doc)
                this.initView(doc)
            }, true)
        })

        liveDataView.on(LiveDataView.EVENT_SET_SCORE, scoreStr => {
            syncDoc(gameDate, doc => {
                console.log('sync doc', doc);
                let game = doc.rec[this.gameIdx]
                if (game) {
                    let a = scoreStr.split(' ')
                    if (a.length == 2) {
                        game.score = [Number(a[0]), Number(a[1])]
                    }
                }
                // this.initBracket(doc)
                this.initView(doc)
            }, true)
        })
        liveDataView.on(LiveDataView.EVENT_SHOW_POKER_PANEL, data => {
            data._ = 'null'
            $post(`/emit/${WebDBCmd.cs_showPoker}`, data)
        })

        liveDataView.on(LiveDataView.EVENT_SHOW_POKER_PLAYER, data => {
            data._ = 'null'
            data.pokerStr = data.pokerStr.toUpperCase()
            if (data.visible) {

                let playerData = this.nameMapHupuId[data.playerName]
                this.pokerMapPlayer[data.pokerStr] = playerData
                data.playerData = playerData
                console.log('EVENT_SHOW_POKER_PLAYER', playerData.hupuID, playerData.poker);
                syncDoc(gameDate, doc => {
                    if (!doc.pokerMap)
                        doc.pokerMap = {}
                    doc.pokerMap[data.pokerStr] = { hupuID: playerData.data.name, playerName: data.playerName }
                }, true)
            }
            $post(`/emit/${WebDBCmd.cs_showPokerPlayer}`, data)
            setTimeout(_ => {
                this.reMapBracket()
            }, 3000);
        })

        liveDataView.on(LiveDataView.EVENT_SHOW_CHAMPION, data => {
            this.showChampion(data)
        })

        liveDataView.on(LiveDataView.EVENT_REMAP_BRACKET, data => {
            this.reMapBracket()
        })

        liveDataView.on(LiveDataView.EVENT_RESET_POKER_PICKER, data => {
            this.resetPokerPicker()
        })
        liveDataView.on(LiveDataView.EVENT_CUSTOM_PLAYER, playerArr => {
            this.emitGameInfo(data => {
                let lPlayer = playerArr[0]
                let rPlayer = playerArr[1]
                // let info = playerArr[2]
                data.leftPlayer.name = lPlayer.name
                data.leftPlayer.weight = lPlayer.weight
                data.leftPlayer.height = lPlayer.height
                data.leftPlayer.avatar = lPlayer.avatar

                data.rightPlayer.name = rPlayer.name
                data.rightPlayer.weight = rPlayer.weight
                data.rightPlayer.height = rPlayer.height
                data.rightPlayer.avatar = rPlayer.avatar
            })
        })

        this.initWS()
    }
    resetPokerPicker() {
        syncDoc(gameDate, doc => {
            doc.pokerMap = {}
        }, true)
    }

    reMapBracket() {
        console.log('reMapBracket');
        //find LA set to p16 RA to p16   \
        syncDoc(gameDate, doc => {
            if (doc.pokerMap) {
                let rec = doc.rec
                //clear all
                for (let i = 0; i < 38; i++) {
                    rec[i + 1].score = [0, 0]
                    rec[i + 1].player = ['', '']
                }
                let findPlayerName = (gameIdx, pokerStrArr) => {
                    let pmL = doc.pokerMap[pokerStrArr[0]]
                    let pmR = doc.pokerMap[pokerStrArr[1]]
                    let player = ['', '']
                    if (pmL)
                        player[0] = pmL.playerName

                    if (pmR)
                        player[1] = pmR.playerName

                    rec[gameIdx].player = player
                }
                findPlayerName(1, ['L1', 'R1'])
                findPlayerName(2, ['L2', 'R2'])
                findPlayerName(3, ['L3', 'R3'])
                findPlayerName(4, ['L4', 'R4'])

                findPlayerName(5, ['L5', 'R5'])
                findPlayerName(6, ['L6', 'R6'])
                findPlayerName(7, ['L7', 'R7'])
                findPlayerName(8, ['L8', 'R8'])

                findPlayerName(9, ['L9', ''])
                findPlayerName(10, ['R9', ''])
                findPlayerName(11, ['L10', ''])
                findPlayerName(12, ['R10', ''])
                this.emitBracket(doc)
            }
        }, true)
    }
    clearBracketScore() {

    }
    initPlayer(callback) {
        getAllPlayer(421, (res) => {
            // res = JSON.parse(res)
            console.log('380 all player ', res);
            // this.initGameInfo(res)
            let playerIdArr = ['习惯过了头', '安云鹏别让我瞧不起你', '平常心myd', 'Li_DD'
                , '打铁不算多', '新锐宋教练', 'Gyoung15', '小丑的梦想'
                , '7号唐日辉同学', '雷雷雷雷子', 'NGFNGN', '知名球童戴一志'
                , '刘宇9号', '泡椒top13', '万宅男'
                , '大霖哥666', '带伤上阵也不怕', '认得挖方一号', '鬼手林坤8023', 'zzz勇'
            ]
            let playerOrderArr = []
            // console.log('initGameInfo ', res);
            let getData = (name) => {
                for (let p of res.data) {
                    if (p.name == name)
                    { return p }
                }
            }

            for (let p of playerIdArr) {
                playerOrderArr.push(getData(p))
            }
            console.log('player 20', playerOrderArr);
            let playerArr = []
            for (let i = 0; i < 20; i++) {
                let p = new PlayerInfo()
                p.id = i + 1
                p.hupuID = playerOrderArr[i].name
                p.name = 'p' + (i + 1)
                p['poker'] = ''
                p.data = playerOrderArr[i]
                playerArr.push(p)
                this.nameMapHupuId[p.name] = p
            }
            this.initPokerSelectView(playerArr)
            callback()
        })
    }
    initPokerSelectView(playerArr) {
        syncDoc(gameDate, doc => {
            if (doc.pokerMap) {
                for (let pokerStr in doc.pokerMap) {
                    let item = doc.pokerMap[pokerStr]
                    for (let p of playerArr) {
                        if (p.name == item.playerName) {
                            p.poker = pokerStr
                        }
                    }
                }
            }
            this['pokerPlayerArrG1'] = playerArr.slice(12, 20)
            this['pokerPlayerArrG2'] = playerArr.slice(0, 12)
        })
    }
    setGameInfo(gameIdx) {
        syncDoc(gameDate, doc => {
            let rec = doc['rec'][gameIdx]
            this.gameIdx = gameIdx
            this.lPlayer = rec.player[0]
            this.rPlayer = rec.player[1]
            this.lScore = Number(rec.score[0]) || 0
            this.rScore = Number(rec.score[1]) || 0
            this.lFoul = Number(rec.foul[0]) || 0
            this.rFoul = Number(rec.foul[1]) || 0
            this.lHupuID = this.getHupuId(this.lPlayer)
            this.rHupuID = this.getHupuId(this.rPlayer)
        })
    }

    initView(doc) {
        //  this.recMap = doc['recMap']
        let recMap = doc['rec']
        routeBracket(recMap)

        let gameIdx = doc.gameIdx
        this.setGameInfo(gameIdx)
        //gameInfoTable
        let rowArr: any = []
        for (let idx in recMap) {
            // console.log('idx', idx, recMap);
            let rec = recMap[idx]
            let row = { idx: 0, gameIdx: 0, vs: '', score: '', rPlayer: '', lPlayer: '' }
            row.gameIdx = Number(idx)
            row.idx = row.gameIdx
            row.vs = `[${rec.player[0]} : ${rec.player[1]}]`
            row.lPlayer = this.getHupuId(rec.player[0])
            row.rPlayer = this.getHupuId(rec.player[1])
            row.score = rec.score[0] + " : " + rec.score[1]
            // console.log('row', row);
            rowArr.push(row)
        }
        // console.log('init GameInfo Table', rowArr, this.nameMapHupuId);

        this.gameInfoTable = rowArr
    }

    getHupuId(groupName) {
        for (let k in this.nameMapHupuId) {
            let o = this.nameMapHupuId[k]
            if (o.name == groupName)
                return o.hupuID
        }
        return ''
    }

    initWS() {
        io.connect('/rkb')
            .on('connect', () => {
                console.log('connect DoubleEliminationView initWS')
            })
            .on(`${WebDBCmd.sc_bracket20Created}`, () => {
                console.log('sc_bracketCreated');
                this.emitBracket()
            })
            .on(`${WebDBCmd.sc_panelCreated}`, () => {
                console.log('sc_panelCreated');
                this.emitGameInfo()
            })
    }

    getPlayerInfo(groupName) {
        if (this.nameMapHupuId[groupName])
            return this.nameMapHupuId[groupName]
        return {}
    }


    emitGameInfo(insertPlayerInfoCall?) {
        let data: any = { _: null }
        data.winScore = 3
        if (this.gameIdx == 38) {//决赛
            data.winScore = 5
            data.matchType = 3
        }
        else  //大师赛
            data.matchType = 2
        // else
        //     data.matchType = 1
        data.gameIdx = this.gameIdx
        let lPlayerData = this.getPlayerInfo(this.lPlayer).data
        let rPlayerData = this.getPlayerInfo(this.rPlayer).data
        lPlayerData.rankingData = { ranking: 12, color: 0xffff00 }
        rPlayerData.rankingData = { ranking: 12, color: 0xffff00 }
        data.leftScore = this.lScore
        data.rightScore = this.rScore
        data.leftFoul = this.lFoul
        data.rightFoul = this.rFoul
        data.leftPlayer = lPlayerData
        data.rightPlayer = rPlayerData
        if (insertPlayerInfoCall) {
            insertPlayerInfoCall(data)
        }
        //test
        // data.leftPlayer.name += this.lHupuID
        // data.rightPlayer.name += this.rHupuID
        console.log('setGameInfo', data);

        if (this.delayEmitGameInfo > 0) {
            setTimeout(_ => {
                this.delayEmitGameInfo = 0
                $post(`/emit/${WebDBCmd.cs_init}`, data)
            }, this.delayEmitGameInfo);
        }
        else
            $post(`/emit/${WebDBCmd.cs_init}`, data)
    }

    emitBracket(doc?) {
        let setHupuId = (doc) => {
            let cloneDoc = JSON.parse(JSON.stringify(doc))
            for (let i = 0; i < 38; i++) {
                let r = cloneDoc.rec[i + 1]
                r.poker = r.player
                let a = [this.getHupuId(r.player[0]), this.getHupuId(r.player[1])]
                r.player = a
            }
            $post(`/emit/${WebDBCmd.cs_bracket20Init}`, { _: null, rec: cloneDoc.rec })
        }
        if (doc)
            setHupuId(doc)
        else
            syncDoc(gameDate, doc => {
                setHupuId(doc)
            })
    }

    commit() {
        syncDoc(gameDate, doc => {
            console.log('commit', doc, 'gameIdx:', this.gameIdx);
            let rec = doc['rec'][this.gameIdx]
            rec.score = [this.lScore, this.rScore]
            rec.foul = [this.lFoul, this.rFoul]
            rec.player = [this.lPlayer, this.rPlayer]
            this.gameIdx++
            doc.gameIdx = this.gameIdx
            this.emitVictory(doc)
            this.emitBracket(doc)
            this.initView(doc)
            if (this.gameIdx < 13)
                this.delayEmitGameInfo = 5000
            else
                this.delayEmitGameInfo = 2000

            setTimeout(_ => {
                console.log('delay show player info');
                this.emitGameInfo()
                this.emitBracket()
                this.setGameInfo(this.gameIdx)
                if (this.gameIdx < 13)
                    this.showGamePlayerInfo(true)
            }, this.delayEmitGameInfo)
        }, true)
    }

    emitVictory(doc) {
        if (this.lScore != 0 || this.rScore != 0) {
            let winPlayer: PlayerInfo;
            if (this.lScore > this.rScore)
                winPlayer = this.getPlayerInfo(this.lPlayer)
            else
                winPlayer = this.getPlayerInfo(this.rPlayer)
            let sumMap = buildPlayerData(doc, true)
            let rec = sumMap[winPlayer.name]
            let data = { _: null, visible: true, winner: winPlayer.data, rec: rec }
            $post(`/emit/${WebDBCmd.cs_showVictory}`, data)
        }
    }

    showGamePlayerInfo(visible) {
        let data = {
            _: null,
            visible: visible,
            leftPlayer: this.getPlayerInfo(this.lPlayer),
            rightPlayer: this.getPlayerInfo(this.rPlayer)
        }
        $post(`/emit/${WebDBCmd.cs_showGamePlayerInfo}`, data)
    }

    //clear data
    initBracket(doc) {
        let rec = doc['rec'] = {}
        for (let i = 0; i < 39; i++) {
            rec[i + 1] = { gameIdx: i + 1, player: ['', ''], score: [0, 0], foul: [0, 0] }
        }
        doc['gameIdx'] = 1
        // rec[1].player = ['p16', 'p17']
        // rec[2].player = ['p13', 'p20']
        // rec[3].player = ['p15', 'p18']
        // rec[4].player = ['p14', 'p19']

        // rec[5].player = ['p8', 'p9']
        // rec[6].player = ['p5', 'p12']
        // rec[7].player = ['p7', 'p10']
        // rec[8].player = ['p6', 'p11']

        // rec[9].player = ['p1', '']
        // rec[10].player = ['p4', '']
        // rec[11].player = ['p2', '']
        // rec[12].player = ['p3', '']
    }

    showChampion(data1) {
        let visible = data1.visible
            , groupName = data1.visible
            , title = data1.title
        let p = this.getPlayerInfo(groupName)
        let data: any = { _: null, visible: visible }
        data.title = title
        data.visible = true
        data.ftId = p.data.groupId
        data.name = p.data.name
        data.location = p.data.school
        data.avatar = p.data.avatar
        data.info = p.data.height + ' cm/ ' + p.data.weight + " kg/ " + p.data.age + ' 岁'
        $post(`/emit/${WebDBCmd.cs_showChampion}`, data)
        $post(`/emit/${WebDBCmd.cs_showScore}`, { _: null, visible: false })
    }
}