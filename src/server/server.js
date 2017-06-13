var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// const path = require('path')
let static_path = '../../dist/static'
app.use(express.static('../../dist/static'));
app.get('/', function(req, res, next) {
    res.sendFile(static_path + '/dev/admin.html');
});

var XMLHttpRequest = require('xhr2');
app.get('/proxy', (req, res) => {
    let url = req.query.url;
    console.log('proxy url', url)
    let reqProxy = new XMLHttpRequest();
    reqProxy.open('GET', url, true);
    reqProxy.responseType = 'arraybuffer';
    reqProxy.onload = function(e) {
        // let t = typeof reqProxy.response
        // console.log('res type:', t)
        let buf = new Buffer(new Uint8Array(reqProxy.response));
        let data = "data:image/png;base64," + buf.toString('base64');
        res.set('content-type', 'text/html; charset=utf-8');
        res.send(data);
    };
    reqProxy.send();
});

let rkbIO = io.of('/rkb')
    .on('connect', () => {
        console.log('rkb')
    })

app.post('/')

server.listen(4200, () => {
    console.log('running...')
});