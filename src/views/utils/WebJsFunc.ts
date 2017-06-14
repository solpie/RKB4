export let dynamicLoading = {
    css: function(path) {
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
    js: function(path) {
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
export let proxy: (url) => any = (url) => {
    return "/proxy?url=" + url;
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
//vue-resource
declare let $http
export let $get = (url, callback) => {
    $http.get(url).then((res) => {
        callback(res.body, res)
    })
}
export let $post = (url, data, callback) => {
    $http.post(url,data).then((res) => {
        callback(res.body, res)
    })
}