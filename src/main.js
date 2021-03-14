import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { request, formatTime } from './utils'
import './rem'
// import './css/common.css'

Vue.config.productionTip = false

//引入Vant-ui
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.prototype.$ajax = request;
Vue.prototype.$formatTime = formatTime;


import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
new Vue({
    //注入根实例
    router,
    store,
    render: h => h(App),
}).$mount('#app')
/* vm.$mount()手动挂载，关联DOM属性 */