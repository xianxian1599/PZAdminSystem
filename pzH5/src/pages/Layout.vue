<template>
  <RouterView />
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="item in router.options.routes[0].children"
      :key="item.path"
      :icon="item.meta.icon"
      :url="`#/${item.path}`"
    >
      {{ item.meta.name }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const active = ref(0);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  console.log(router, "router");
  const data = router.options.routes[0];
  active.value = data.children.findIndex(
    (item) => "/" + item.path === route.path,
  );
});
</script>

<style lang="less" scoped></style>
