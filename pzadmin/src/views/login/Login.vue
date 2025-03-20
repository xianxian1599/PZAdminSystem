<template>
  <!-- 栅格布局 -->
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <!-- 头部的图片 -->
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" />
        </div>
      </template>
      <!-- 登录注册切换按钮 -->
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          formType ? "返回登录" : "注册账号"
        }}</el-link>
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        class="demo-ruleForm"
        style="max-width: 600px"
        :rules="rules"
      >
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            :prefix-icon="User"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item v-if="formType" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="验证码"
            :prefix-icon="Lock"
          >
            <template #append>
              <span @click="countdownChange">{{ countdown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
          >
            {{ formType ? "注册" : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { ref, reactive, computed, toRaw } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { getCode, userAuthentication, login, menuPermissions } from "../../api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;

// 表单数据
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

// 切换表单 0登录1注册
const formType = ref(0);
// 点击切换登陆和注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};

// 账号校验规则
const validateUser = (rules, value, callback) => {
  // 不能为空
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    const phoneReg = /^1[3456789]\d{9}$/;
    phoneReg.test(value)
      ? callback()
      : callback(new Error("请输入正确的手机号"));
  }
};
// 密码校验规则
const validatePass = (rules, value, callback) => {
  // 不能为空
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const passReg = /^[a-zA-Z0-9_]{4,16}$/;
    passReg.test(value) ? callback() : callback(new Error("密码格式错误"));
  }
};

// 表单校验
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

// 发送验证码
const countdown = reactive({
  validText: "获取验证码",
  time: 60,
});
let flag = false;
const countdownChange = () => {
  // 如果已发送就不处理，防止多次点击
  if (flag) return;
  // 判断手机号是否正确
  const phoneReg = /^1[3456789]\d{9}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning",
    });
  }
  const time = setInterval(() => {
    // 倒计时
    if (countdown.time > 0) {
      countdown.time--;
      countdown.validText = `${countdown.time}秒后重发`;
    } else {
      countdown.time = 60;
      countdown.validText = "获取验证码";
      flag = false;
      clearInterval(time);
    }
  }, 1000);
  flag = true;
  // 异步请求
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    console.log(data, "data");
    if (data.code === 10000) {
      ElMessage.success("发送成功");
    }
  });
};

const router = useRouter();
const loginFormRef = ref();
const store = useStore();

const routerList = computed(() => store.state.menu.routerList);
// 表单提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  // 手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginForm, "submit!");
      // 判断是注册还是登录
      // 如果是注册页面
      if (formType.value) {
        userAuthentication(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            console.log(data, "data");
            ElMessage.success("注册成功，请登录");
            formType.value = 0;
          }
        });
      }
      // 如果是登录页面
      else {
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("登录成功");
            console.log(data, "data");
            // 将token和用户信息缓存到浏览器
            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem(
              "pz_userInfo",
              JSON.stringify(data.data.userInfo),
            );
            menuPermissions().then(({ data }) => {
              store.commit("dynamicMenu", data.data);
              console.log(toRaw(routerList.value), "routerList");
              toRaw(routerList.value).forEach((item) => {
                router.addRoute("Layout", item);
              });
              router.push("/");
            });
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
:deep(.el-card__deader) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
