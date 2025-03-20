<template>
  <div class="common-layout">
    <el-container>
      <!-- 引入自己定义的侧边栏组件 -->
      <Aside />
      <el-container>
        <el-header>
          <!-- 引入自己定义的头部组件 -->
          <Header />
        </el-header>
        <el-main>
          <!-- 正文使用路由跳转到对应页面 -->
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "../components/aside.vue";
import Header from "../components/navHeader.vue";
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>
