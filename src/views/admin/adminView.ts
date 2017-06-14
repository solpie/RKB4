import { $get, $post } from "../utils/WebJsFunc";

declare let $http;
declare let io;
export class AdminView {
    localName = 'hhe'
    constructor() {

    }
    init($vm) {
        // console.log('init admin view...', $vm);
        // io.connect('/ws/admin')
        // // io.connect('ws://localhost:8088/ws/admin')
        //     .on('connect', () => {
        //         console.log('io connection')
        //     })
    }
    
    _(e, param) {
        if (!this[e])
            throw 'no method name: ' + e
        else
            this[e].apply(this, param)
    }

    test(name, id) {
        console.log('test', name, id, this.localName);
        $get('/dev/admin.html', res => {
            console.log(res, '222');
        })
        $post('/proxy', { data: 122 }, res => {
            console.log(res, '222');
        })
    }
}