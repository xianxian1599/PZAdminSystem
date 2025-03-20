// 菜单管理页面
<template>
  <panel-header :route="route" />
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
      > 新增 </el-button
    >
  </div>
  <!-- 列表 -->
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)"> 编辑 </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- 弹窗 -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="添加权限"
    width="500"
  >
    <!-- 弹窗内部的表单 -->
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <!-- 隐藏的表单域 -->
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <!-- 表单项 -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <!-- 树形结构，权限数据从后端获取 -->
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionsData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <!-- 提交表单按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";
import { Plus } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

// 路由用于标题栏传参
const route = useRoute();
console.log(route, "route");

// 表单数据
const form = reactive({
  id: "",
  name: "",
  permissions: "",
});

// 树形菜单权限数据
const permissionsData = ref([]);

// 获取菜单权限数据
onMounted(() => {
  userGetMenu().then(({ data }) => {
    console.log(data, "菜单数据");
    permissionsData.value = data.data;
  });
  getListData();
});

// 默认选中权限
const defaultKeys = [4, 5];

// 弹窗的显示或隐藏
const dialogFormVisible = ref(false);

// 关闭弹窗的回调
const beforeClose = () => {
  dialogFormVisible.value = false;
  // 重置表单
  formRef.value.resetFields();
  // tree选择重置
  treeRef.value.setCheckedKeys(defaultKeys);
};

const formRef = ref();
const treeRef = ref();
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入权限名称" }],
});

// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 获取到选择的checkbox数据
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetMenu({ name: form.name, permissions, id: form.id }).then(
        ({ data }) => {
          console.log(data, "提交成功");
          beforeClose();
          getListData();
        },
      );
    } else {
      console.log("error submit!", fields);
    }
  });
};

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};

const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

// 打开弹窗
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  // 弹窗打开form生成是异步的
  nextTick(() => {
    // 如果是编辑，有原数据
    if (rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};

// 列表数据
const tableData = reactive({
  list: [],
  total: 0,
});

// 请求列表数据
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};
</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
