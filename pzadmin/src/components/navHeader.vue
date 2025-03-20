// 头部组件
<template>
  <div class="header-container">
    <!-- 左边显示收起图标和菜单栏 -->
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"
        ><Fold
      /></el-icon>
      <ul class="flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          :class="{ selected: route.path === item.path }"
          class="tab flex-box"
        >
          <!-- 显示的图标和菜单名称和路由跳转 -->
          <el-icon size="12"> <component :is="item.icon" /></el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <!-- 关闭按钮 -->
          <el-icon size="12" class="close" @click="closeTab(item, index)"
            ><Close
          /></el-icon>
        </li>
      </ul>
    </div>
    <!-- 右边显示用户头像和下拉菜单 -->
    <div class="header-right">
      <el-dropdown @command="handelClick">
        <!-- 头像 -->
        <div class="el-dropdown-link flex-box">
          <el-avatar :src="userInfo.avatar" />
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <!-- 下拉菜单 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

// 拿到store实例
const store = useStore();
// 拿到当前路由对象
const route = useRoute();
const router = useRouter();
const selectMenu = computed(() => store.state.menu.selectMenu);

const userInfo = JSON.parse(localStorage.getItem("pz_userInfo"));

// 点击关闭标签页
const closeTab = (item, index) => {
  // 在数组中删除点击的标签
  store.commit("closeMenu", item);
  // 如果删除的是非当前页标签，不做处理
  if (route.path !== item.path) {
    return;
  }
  // 如果删除的是当前标签页
  const selectMenuData = selectMenu.value;
  // 删除的是当前标签页也是最后一项
  if (index === selectMenuData.length) {
    // 如果只有一项，删除完标签页就空了，跳转到首页
    if (!selectMenuData.length) {
      router.push("/");
    }
    // 如果有多项，跳转到上一项
    else {
      router.push({
        path: selectMenuData[index - 1].path,
      });
    }
  }
  // 删除的当前标签页是中间位置，跳转到下一页
  else {
    router.push({
      path: selectMenuData[index].path,
    });
  }
};

const handelClick = (command) => {
  if (command === "cancel") {
    localStorage.removeItem("pz_token");
    localStorage.removeItem("pz_userInfo");
    localStorage.removeItem("pz_v3pz");
    window.location.href = window.location.origin;
  }
};
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      cursor: pointer;
      background-color: #f5f5f5;
    }
    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }
  .header-right {
    .user-name {
      margin-left: 10px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>
