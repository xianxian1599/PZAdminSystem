import { createRouter, createWebHashHistory } from "vue-router";

import Layout from "../views/Layout.vue";
import Dashboard from "../views/dashboard/index.vue";
import Admin from "../views/auth/admin/index.vue";
import Group from "../views/auth/group/index.vue";
import Order from "../views/vppz/order/index.vue";
import Staff from "../views/vppz/staff/index.vue";
import Login from "../views/login/Login.vue";

// 创建路由实例
const router = createRouter({
  // 路由匹配模式，使用哈希模式
  history: createWebHashHistory(),
  // 路由数组
  routes: [
    {
      path: "/",
      name: "Layout",
      component: Layout,
      redirect: to => {
        const localData = localStorage.getItem('pz_v3pz')
      // 如果有缓存说明是登录态，跳转到第一个有操作权限的页面
        if(localData) {
          const child = JSON.parse(localData).menu.routerList[0].children
          // 有子菜单的情况
          if(child) {
            return child[0].meta.path
          } else {
            return JSON.parse(localData).menu.routerList[0].meta.path
          }
        } else {
          return "/login"
        }
      },
      // 嵌套子路由
      children: [
        // {
        //   path: "dashboard",
        //   component: Dashboard,
        //   meta: {
        //     id: "1",
        //     name: "控制台",
        //     icon: "Platform",
        //     path: "/dashboard",
        //     describe: "用于展示当前系统中的统计数据、统计报表及重要实时数据",
        //   },
        // },
        // {
        //   path: "auth",
        //   meta: { id: "2", name: "权限管理", icon: "Grid" },
        //   children: [
        //     {
        //       path: "",
        //       component: Admin,
        //       alias: ["admin"],
        //       meta: {
        //         id: "1",
        //         name: "账号管理",
        //         icon: "Avatar",
        //         path: "/auth/admin",
        //         describe: "管理员可以进行编辑，权限修改后需要登出才会生效",
        //       },
        //     },
        //     {
        //       path: "group",
        //       component: Group,
        //       meta: {
        //         id: "2",
        //         name: "菜单管理",
        //         icon: "Menu",
        //         path: "/auth/group",
        //         describe:
        //           "菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取",
        //       },
        //     },
        //   ],
        // },
        // {
        //   path: "vppz",
        //   meta: { id: "3", name: "DIDI陪诊", icon: "BellFilled" },
        //   children: [
        //     {
        //       path: "",
        //       component: Staff,
        //       alias: ["staff"],
        //       meta: {
        //         id: "1",
        //         name: "陪护管理",
        //         icon: "Checked",
        //         path: "/vppz/staff",
        //         describe:
        //           "陪护师可以进行创建和修改，设置对应生效状态控制C端选择",
        //       },
        //     },
        //     {
        //       path: "order",
        //       component: Order,
        //       meta: {
        //         id: "2",
        //         name: "订单管理",
        //         icon: "List",
        //         path: "/vppz/order",
        //         describe:
        //           "C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改",
        //       },
        //     },
        //   ],
        // },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    }
  ],
});

// 导出路由实例
export default router;
