//config
var fs = require('fs'),
    ini = require('ini');
var conf = ini.parse(fs.readFileSync('./.cfg', 'utf-8'));
console.log('config', conf);
//webserver
var express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// const path = require('path')
var static_path = '../dist/static';
app.use(express.static(static_path));
// app.get('/', function(req, res, next) {
//     res.redirect('/dev/admin.html')
// });
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true
}));
app.use(bodyParser.json({ limit: '500mb' }));
console.log('json', { visible: false });

//proxy
var XMLHttpRequest = require('xhr2');
app.get('/proxy', function(req, res) {
    var url = req.query.url;
    var type = req.query.type
    console.log('proxy url', url);
    var reqProxy = new XMLHttpRequest();
    reqProxy.open('GET', url, true);
    if (type == 'image')
        reqProxy.responseType = 'arraybuffer';
    reqProxy.onload = function(e) {
        if (type == 'image') {
            var buf = new Buffer(new Uint8Array(reqProxy.response));
            var data = "data:image/png;base64," + buf.toString('base64');
            res.set('content-type', 'text/html; charset=utf-8');
            res.send(data);
        } else {
            res.send(reqProxy.response);
        }
    };
    reqProxy.send();
});
app.post('/proxy', (req, res) => {
    let body = req.body;
    console.log('proxy body ', body);
    res.send('ok')
});
app.post('/emit/:cmd', (req, res) => {
    let cmd = req.params.cmd;
    let toEvent = cmd;
    if ('_' in req.body) {
        if ('prefix' in req.body)
            toEvent = cmd.replace("cs_", req.body['prefix'])
        else
            toEvent = cmd.replace("cs_", "sc_")
        delete req.body['_']
        rkbIO.emit(toEvent, req.body)
    }
    console.log('emit ', cmd, req.body, 'to ', toEvent);

    res.send('ok')
});
var rkbIO = io.of('/rkb')
    .on('connect', function() {
        console.log('rkb');
    });

//nedb
const nedb = require('nedb')
const db = new nedb({
    filename: './db/web.db',
    autoload: true
});
app.get('/db/find/:idx', (req, res) => {
    let idx = req.params.idx
    db.find({ idx: idx }, (err, docs) => {
        let ret = { err: err, docs: docs }
        console.log('/db/find/', idx, docs);
        if (!docs.length) {
            let newDoc = { idx: idx }
            db.insert(newDoc, (err2, doc) => {
                console.log('db.insert', err2, doc);
                ret.docs.push(newDoc)
                res.send(ret)
            })
        } else
            res.send(ret)
    })
});
app.post('/db/update/:idx', (req, res) => {
    let idx = req.params.idx
    let doc = req.body
    db.update({ idx: idx }, doc, {}, (err, numReplaced) => {
        console.log(req.url, doc);
        res.send({ err: err, numReplaced: numReplaced })
    })
});

///////////////////////
// let downLoadGameData = require('./ranking/ranking.js')
//auto game
var request = require('request');
request = request.defaults({ jar: true })
    // request.cookie('u=18800316|54Gs6JC9Xw==|0c57|e1e1f1ab551a4f5feb9c1a94e938da7c|551a4f5feb9c1a94|54Gs6JC9Xw==')
    // request.cookie('us=e0f1a7d137d00241f782758f8d968830739a320abb4873bfe6381498b804744c16974a776635ea0de4c8d74a4906956e2228636554ca861c5c51f515d23b90e7')
    // request.cookie('ua=88515621')
var roomId = 11006
var startUrl = 'http://pre.liangle.com/manage/yang/pbk/event/' + roomId
    // request
var requestify = require('requestify');
var data1 = {
        left_nickname: '67号选手',
        right_nickname: 'sako001'
    }
    // requestify.setEncoding('utf8')
requestify.request(startUrl, {
        method: 'POST',
        body: data1,
        'Content-Type': 'application/json; charset=utf-8',
        // headers: {
        //     'X-Forwarded-By': 'me'
        // },
        cookies: {
            'u': '18800316|54Gs6JC9Xw==|0c57|e1e1f1ab551a4f5feb9c1a94e938da7c|551a4f5feb9c1a94|54Gs6JC9Xw==',
            'us': 'e0f1a7d137d00241f782758f8d968830739a320abb4873bfe6381498b804744c16974a776635ea0de4c8d74a4906956e2228636554ca861c5c51f515d23b90e7',
            'ua': '88515621'
        },
        dataType: 'json'
    }).then(function(response) {
        // Get the response body
        var body = response.getBody();
        console.log('res body 放', body)
    })
    // requestify.post(startUrl, { left_nickname: '方良超', right_nickname: '军哥' }, {
    //         cookies: {
    //             'u': '18800316|54Gs6JC9Xw==|0c57|e1e1f1ab551a4f5feb9c1a94e938da7c|551a4f5feb9c1a94|54Gs6JC9Xw==',
    //             'us': 'e0f1a7d137d00241f782758f8d968830739a320abb4873bfe6381498b804744c16974a776635ea0de4c8d74a4906956e2228636554ca861c5c51f515d23b90e7',
    //             'ua': '88515621'
    //         }
    //     })
    //     .then(function(response) {
    //         // Get the response body
    //         var body = response.getBody();
    //         console.log('res body', body)
    //     });
server.listen(Number(conf.server.port), function(_) {
    console.log('server running...');
    // downLoadGameData()
});