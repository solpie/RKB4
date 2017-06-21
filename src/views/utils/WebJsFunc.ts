export let dynamicLoading = {
    css: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
};
export let proxy: (url, type?) => any = (url, type = 'image') => {
    return "/proxy?url=" + url + "&type=" + type
};

export class OpReq {
    cmdMap = {}
    reqFunc
    io
    constructor(io, reqFunc) {
        this.reqFunc = reqFunc
        this.io = io
    }
    send(cmd, data) {
        this.reqFunc(cmd, data)
        if (!this.cmdMap[cmd]) {
            this.cmdMap[cmd] = true
            return {
                on: (resCmd, callback) => {
                    this.io.on(resCmd, (data) => {
                        callback(data)
                    })
                }
            }
        }
        return { on: (resCmd, callback) => { } }
    }
}
declare let $;
// export let $post = (url, data, callback) => {
//     $.ajax({
//         url: url,
//         type: 'post',
//         data: JSON.stringify(data),
//         headers: { "Content-Type": "application/json" },
//         dataType: 'json',
//         success: callback
//     });
// }

export const getUrlQuerys = (sParam) => {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
//
let xhr = (url, method, data, callback) => {
    var http = new XMLHttpRequest();
    http.open(method, url, true);
    //Send the proper header information along with the request
    let d = ''
    if (method == 'POST') {
        if (data) {

            // if (typeof data == 'string')
            // data = JSON.parse(data)
            // console.log('Post data', data);
            for (let k in data) {
                d += (k + "=" + data[k] + "&")
            }
        }
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    http.onreadystatechange = () => {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            let ct = http.getResponseHeader('content-type')
            console.log('http.response', ct, http.response);
            let res = http.response
            if (ct.search('json') > -1)
                res = JSON.parse(http.response)
            if (callback)
                callback(res);
        }
    }
    http.send(d);
}

//vue-resource
export let $get = (url, callback) => {
    let $http = window['$http']
    if (!$http) {
        xhr(url, 'GET', null, (res) => {
            if (callback)
                callback(res)
        })
    }
    else
        $http.get(url).then((res) => {
            if (callback)
                callback(res.body, res)
        })
}
export let $post = (url, data?, callback?) => {
    let $http = window['$http']
    if (!$http) {
        xhr(url, 'POST', data, (res) => {
            if (callback)
                callback(res)
        })
    }
    else
        $http.post(url, data).then((res) => {
            if (callback)
                callback(res.body, res)
        })
}