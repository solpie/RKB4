
declare let $http;
declare let io;
export class AdminView {
    localName = 'hhe'
    constructor() {
    }
    init($vm) {

    }

    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }

    test(name, id) {
        // console.log('test', name, id, this.localName);
        // $get('/dev/admin.html', res => {
        //     console.log(res, '222');
        // })
        // $post('/proxy', { data: 122 }, res => {
        //     console.log(res, '222');
        // })
    }
}