import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'


Vue.use(Vuex);

const store = new Vuex.Store({
    // 全局数据
    state: {
        a: 10,
        b: 20,
        keyword:'',
    },
    getters: {
        total(state) {
            return state.a + state.b;
        }
    },
    mutations: {
        setData(state,value){
            state.keyword = value;
            
        }
    },
    actions: {},

    // 模块
    modules: {
        user
    }
})


export default store;