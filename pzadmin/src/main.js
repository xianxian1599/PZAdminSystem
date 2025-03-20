import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import PanelHeader from "./components/panelHeader.vue";

// 添加路由守卫，在每次跳转前进行判断，token表示是否已经登陆
router.beforeEach((to, form) => {
  const token = localStorage.getItem("pz_token");
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

// 刷新后的动态路由添加
const localData = localStorage.getItem("pz_v3pz");
if (localData) {
  store.commit("dynamicMenu", JSON.parse(localData).menu.routerList);
  store.state.menu.routerList.forEach((item) => {
    router.addRoute("Layout", item);
  });
}

const app = createApp(App);

// 全局注册ElementPlusIconsVue组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component("panelHeader", PanelHeader);

// 挂载
app.use(router);
app.use(store);
app.mount("#app");
