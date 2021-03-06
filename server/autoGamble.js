///////////////////////
var request = require('request');
request = request.defaults({ jar: true })

let gambleStart = (roomId, left, right, cb) => {
    console.log('roomId', roomId, left, right);

    var startUrl = 'http://www.liangle.com/manage/yang/pbk/event/' + roomId
        // request
    var requestify = require('requestify');
    var data1 = {
        left_nickname: left,
        right_nickname: right
    }
    requestify.request(startUrl, {
        method: 'POST',
        body: data1,
        'Content-Type': 'application/json; charset=utf-8',
        cookies: {
            'u': '18800316|54Gs6JC9Xw==|0c57|e1e1f1ab551a4f5feb9c1a94e938da7c|551a4f5feb9c1a94|54Gs6JC9Xw==',
            'us': 'e0f1a7d137d00241f782758f8d968830739a320abb4873bfe6381498b804744c16974a776635ea0de4c8d74a4906956e2228636554ca861c5c51f515d23b90e7',
            'ua': '88515621'
        },
        dataType: 'json'
    }).then(function(response) {
        // Get the response body
        var body = response.getBody();
        let topic_id = body.topic_id
        cb(body)
        console.log('res data:', body, topic_id)
    })
}

let gambleStop = (topicId, cb) => {
    let url = 'http://www.liangle.com/manage/topic/stop/' + topicId
    let requestify = require('requestify');
    requestify.request(url, {
        method: 'PUT',
        'Content-Type': 'application/json; charset=utf-8',
        cookies: {
            'u': '18800316|54Gs6JC9Xw==|0c57|e1e1f1ab551a4f5feb9c1a94e938da7c|551a4f5feb9c1a94|54Gs6JC9Xw==',
            'us': 'e0f1a7d137d00241f782758f8d968830739a320abb4873bfe6381498b804744c16974a776635ea0de4c8d74a4906956e2228636554ca861c5c51f515d23b90e7',
            'ua': '88515621'
        },
        dataType: 'json'
    }).then(function(response) {
        var body = response.getBody();
        cb(body)
    })
}

let gambleCancel = (topicId, cb) => {
    let url = 'http://www.liangle.com/manage/topic/cancel/' + topicId
    let requestify = require('requestify');
    requestify.request(url, {
        method: 'PUT',
        'Content-Type': 'application/json; charset=utf-8',
        cookies: {
            'u': '18800316|54Gs6JC9Xw==|0c57|e1e1f1ab551a4f5feb9c1a94e938da7c|551a4f5feb9c1a94|54Gs6JC9Xw==',
            'us': 'e0f1a7d137d00241f782758f8d968830739a320abb4873bfe6381498b804744c16974a776635ea0de4c8d74a4906956e2228636554ca861c5c51f515d23b90e7',
            'ua': '88515621'
        },
        dataType: 'json'
    }).then(function(response) {
        var body = response.getBody();
        cb(body)
    })
}


let gambleFin = (topicId, option, cb) => {
    let url = 'http://www.liangle.com/manage/topic/finish/' + topicId
    let requestify = require('requestify');

    requestify.request(url, {
        method: 'PUT',
        'Content-Type': 'application/json; charset=utf-8',
        body: { option: option },
        cookies: {
            'u': '18800316|54Gs6JC9Xw==|0c57|e1e1f1ab551a4f5feb9c1a94e938da7c|551a4f5feb9c1a94|54Gs6JC9Xw==',
            'us': 'e0f1a7d137d00241f782758f8d968830739a320abb4873bfe6381498b804744c16974a776635ea0de4c8d74a4906956e2228636554ca861c5c51f515d23b90e7',
            'ua': '88515621'
        },
        dataType: 'json'
    }).then(function(response) {
        var body = response.getBody();
        console.log('finish', body);
        cb(body)
    })
}


app.post('/autoGamble/stop', (req, res) => {
    let topicId = req.body.topicId
    gambleStop(topicId, response => {
        res.send(response)
    })
})
app.post('/autoGamble/fin', (req, res) => {
    let topicId = req.body.topicId
    let option = Number(req.body.option)
    console.log('/autoGamble/fin', topicId, option);
    gambleFin(topicId, option, response => {
        res.send(response)
    })
})
app.post('/autoGamble/cancel', (req, res) => {
    let topicId = req.body.topicId
    gambleCancel(topicId, response => {
        res.send(response)
    })
})
app.post('/autoGamble/start', (req, res) => {
    let roomId = req.body.roomId
    let left_nickname = req.body.leftPlayer
    let right_nickname = req.body.rightPlayer

    gambleStart(roomId, left_nickname, right_nickname, response => {
        res.send(response)
    })
});