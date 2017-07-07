console.log('admin view')
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue['http'].options.emulateJSON = false;
window['$http'] = Vue['http'] 

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css';

import io from 'socket.io-client';
window['io'] = io 

console.log('socket.io',io);

//vue req same as $ jquery
Vue.use(ElementUI)

import Admin from './admin.vue'
import Home from './home.vue'
Vue.component('Home', Home)

import Dashboard from './dashboard/dashboard.vue'
Vue.component('Dashboard', Dashboard)

import LiveData from './livedata/livedata.vue'
Vue.component('LiveData', LiveData)

document.write(`<div id='app'></div>`)
let $vm = new Vue({
    el: '#app',
    render: h => h(Admin)
})
