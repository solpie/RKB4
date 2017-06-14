//config
var fs = require('fs'),
    ini = require('ini');
var conf = ini.parse(fs.readFileSync('./.cfg', 'utf-8'));
console.log('config', conf);
//webserver
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// const path = require('path')
var static_path = '../../dist/static';
app.use(express.static('../../dist/static'));
app.get('/', function(req, res, next) {
    res.sendFile(static_path + '/dev/admin.html');
});
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//proxy
var XMLHttpRequest = require('xhr2');
app.get('/proxy', function(req, res) {
    var url = req.query.url;
    console.log('proxy url', url);
    var reqProxy = new XMLHttpRequest();
    reqProxy.open('GET', url, true);
    reqProxy.responseType = 'arraybuffer';
    reqProxy.onload = function(e) {
        // let t = typeof reqProxy.response
        // console.log('res type:', t)
        var buf = new Buffer(new Uint8Array(reqProxy.response));
        var data = "data:image/png;base64," + buf.toString('base64');
        res.set('content-type', 'text/html; charset=utf-8');
        res.send(data);
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
db.insert({ idx: 519 })
app.post('/db/update/:idx', (req, res) => {

});
app.get('/db/find/:idx', (req, res) => {

});
///////////////////////
server.listen(Number(conf.server.port), function(_) {
    console.log('server running...');
});