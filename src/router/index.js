import Vue from 'vue'
//1.引入
import VueRouter from 'vue-router'
import MyPopup from '../views/myPopup.vue'
import Home from '../views/Home.vue'
import Sort from '../views/Sort.vue'
import Publish from '../views/Publish.vue'
import Mine from '../views/Mine.vue'
import Setting from '../views/Setting.vue'
import Guanzhu from '../views/Guanzhu.vue'

import Login from '../views/Login.vue'
import Reg from '../views/Reg.vue'
import Goods from '../views/Goods.vue'
import List from '../views/List.vue'
import NotFound from '../views/NotFound.vue'
// 2. 使用
Vue.use(VueRouter);

// 3. 配置
const router = new VueRouter({
    mode: "history",
    // 路由配置
    routes: [{
        // 当浏览器地址为/home时，渲染Home组件的内容
        path: '/home',
        component: Home,
    }, {
        path: '/',
        redirect: '/home'
    }, {
        name: 'sort',
        path: '/sort',
        component: Sort
    }, {
        name: 'mine',
        path: '/mine',
        component: Mine
    }, {
        name: 'publish',
        path: '/publish',
        component: Publish
    }, {
        path: '/reg',
        component: Reg
    }, {
        path: '/login',
        component: Login
    },
    {
        name: 'myPopup',
        path: '/myPopup',
        meta: {
            keepAlive: true
        },
        component: MyPopup
    },
    {
        name: 'list',
        path: '/list',
        meta: {
            keepAlive: true
        },
        component: List
    },
    {
        name: 'goods',
        path: '/goods/:id', // 路径匹配/goods/xxx这个格式
        component: Goods
    }, {
        path: '/notfound',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/setting',
        name: 'setting',
        component: Setting
    }, {
        path: '/guanzhu',
        name: 'guanzhu',
        component: Guanzhu
    }

    ],
});

const routerPush = VueRouter.prototype.replace

VueRouter.prototype.replace = function replace(location) {
    return routerPush.call(this, location).catch(error => error)
}
export default router;