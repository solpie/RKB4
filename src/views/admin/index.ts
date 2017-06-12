import Vue from 'vue'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-default/index.css';
import io from 'socket.io-client';
window['io'] = io 
console.log('socket.io',io);

Vue.use(VueResource)
//vue req same as $ jquery
Vue['http'].options.emulateJSON = true;
Vue.use(ElementUI)
import { AdminView } from './adminView';
window['admin'] = new AdminView()

import Admin from './admin.vue'
import Home from './home.vue'
Vue.component('Home', Home)

document.write(`<div id='app'></div>`)
let $vm = new Vue({
    el: '#app',
    render: h => h(Admin)
})
console.log('vue ',$vm)