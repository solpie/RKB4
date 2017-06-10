declare let io;
export class AdminView {
    constructor() {

    }
    init($vm) {
        console.log('init admin view...', $vm);
        io.connect('/ws/admin')
        // io.connect('ws://localhost:8088/ws/admin')
            .on('connect', () => {
                console.log('io connection')
            })
    }
}