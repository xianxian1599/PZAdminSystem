import { createStore } from 'vuex'
import menu from './menu'
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
    // 解决数据持久化问题
    plugins: [new createPersistedstate({
        key: 'pz_v3pz'
    })],
    modules: {
        menu
    }
})