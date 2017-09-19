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
        console.log('season', docs);

        if (docs.length) {
            for (let p of docs[0].rankArr) {
                for (let pid of playerIdArr) {
                    if (p.player_id == pid) {
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