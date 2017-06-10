import Vue from 'vue'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-default/index.css'

Vue.use(VueResource)
//     //vue req same as $ jquery
Vue['http'].options.emulateJSON = true;
Vue.use(ElementUI)
import App from './app.vue'
document.write(`<div id='app'></div>`)
let $vm = new Vue({
    el: '#app',
    render: h => h(App)
})
// console.log(Vue['$route'], $vm['$route'])

