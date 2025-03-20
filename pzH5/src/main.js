import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'

const app = createApp(App)

// 添加路由守卫，在每次跳转前进行判断，token表示是否已经登陆
router.beforeEach((to, form) => {
    const token = localStorage.getItem("h5_token");
    // 想跳转到非登陆页面且token不存在，跳转到登陆页面
    if (!token && to.path !== "/login") {
      return "/login";
    }
    // 想跳转到登陆页面但token存在，跳转到首页
    else if (token && to.path === "/login") {
      return "/";
    } else {
      return true;
    }
  });

// 在实例上绑定属性
app.config.globalProperties.$api = api

// 路由挂载
app.use(router)
app.mount('#app')
