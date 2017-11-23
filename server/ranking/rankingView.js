const gameDb = new nedb({ filename: './db/game.db', autoload: true })
const rankDb = new nedb({ filename: './db/rank.db', autoload: true })

app.get('/ranking/', (req, res) => {
    gameDb.find({ idx: "s3" }, (err, docs) => {
        let ret = { err: err, doc: docs[0] }
        if (docs.length)
            res.send(ret)
    })
});

app.get('/ranking/game/:idx', (req, res) => {
    let idx = req.params.idx
    gameDb.find({ idx: idx }, (err, docs) => {
        let ret = { err: err, doc: docs[0] }
        if (docs.length)
            res.send(ret)
    })
});

app.get('/ranking/sync/:idx', (req, res) => {
    let idx = req.params.idx
    downLoadGameData(idx)
    res.send('ok')
});

app.get('/ranking/find/:idx', (req, res) => {
    let idx = req.params.idx
    rankDb.find({ idx: idx }, (err, docs) => {
        let ret = { err: err, doc: docs[0] }
        res.send(ret)
    })
});

app.post('/ranking/query/', (req, res) => {
    let playerIdArr = req.body.playerIdArr
    let season = req.body.season
    rankDb.find({ idx: season }, (err, docs) => {
        let ret = { err: err, doc: docs[0], playerArr: null }
        let playerArr = []
        console.log('season', docs, playerIdArr);

        if (docs.length) {
            for (let pid of playerIdArr) {
                console.log('query', pid);
                for (let p of docs[0].rankArr) {
                    if ((p.player_id + "") == (pid + "")) {
                        playerArr.push(p)
                    }
                }
            }
        }
        ret.playerArr = playerArr
        res.send(ret)
    })
})

app.post('/ranking/update/:idx', (req, res) => {
    let idx = req.params.idx
    let doc = req.body
    rankDb.update({ idx: idx }, doc, {}, (err, numReplaced) => {
        console.log(req.url, doc);
        if (numReplaced == 0) {
            rankDb.insert(doc, (err2, doc) => {
                console.log('db.insert', err2, doc);
            })
        }
        res.send({ err: err, numReplaced: numReplaced })
    })
})

app.post('/ranking/add/:idx', (req, res) => {

    let idx = req.params.idx
    let player = req.body.player
    console.log('/ranking/add', idx, player);
    rankDb.find({ idx: idx }, (err, docs) => {
        let doc = docs[0]
        let def = {
            "gameIdMap": {},
            "win": 1,
            "beatPlayerMap": {},
            "zenPlayerMap": {},
            "losePlayerMap": {},
            "meetPlayerMap": {},
            "section": 0,
            "bestRanking": 0,
            "master": 0,
            "champion": 0,
            "runnerUp": 0,
            "reward": 0,
            "gameCount": 4,
            "ranking": 1190,
            "activity": 1,
            "beatCount": 1,
            "beatRaito": 0.5,
            "player_id": "19457",
            "name": "",
            "beatRaitoStr": 0.5
        }
        def.player_id = player.player_id
        def.name = player.name
        def.ranking = player.ranking
        doc.rankArr.unshift(def)
            // res.send(def)
        rankDb.update({ idx: idx }, doc, {}, (err, numReplaced) => {
            res.send({ err: err, numReplaced: numReplaced })
        })
    })

})