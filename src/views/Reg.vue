<template>
  <div id="reg">
    <!-- 导航按钮 -->
    <p class="nav">
      <span>
        <!-- 放回按钮 -->
        <van-icon
          name="arrow-left"
          size="0.8rem"
          @click="$router.replace('/login')"
        />
      </span>
      <img src="/image/line1.gif" alt="" style="height: 0.7rem" />
      <span>
        <!-- home键 -->
        <van-icon
          name="home-o"
          size="0.8rem"
          @click="$router.replace('/home')"
        />
      </span>
    </p>

    <!-- title -->
    <h2 class="title">开始准备好好吃饭</h2>

    <!-- 注册框 -->
    <van-form @submit="onSubmit">
      <!-- 用户名 -->
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[
          { required: true, message: '请填写用户名' },
          {
            pattern: /^[a-zA-Z0-9]{4,12}$/,
            message: '请输入4到16位字母或数字',
          },
          { validator, message: '用户名已存在' },
        ]"
      />
      <!-- 密码 -->
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[
          { required: true, message: '请填写密码' },
          {
            pattern: /^[a-zA-Z0-9]{6,16}$/,
            message: '请输入6到16位字母或数字',
          },
        ]"
      />
      <!-- 复选框 -->
      <van-checkbox name="1" shape="square" v-model="isAgree"
        >同意《下厨房用户协议》和《下厨房隐私政策》</van-checkbox
      >

      <!-- 注册按钮 -->
      <div style="margin-top: 1rem">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :disabled="!isAgree"
          >注册</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
const crypto = require("crypto");
export default {
  name: "reg",
  data() {
    return {
      username: "",
      password: "",
      isAgree: true,
    };
  },
  methods: {
    //判断用户名是否存在
    async validator(value) {
      let {
        data: { code },
      } = await this.$ajax.get("/user/check", {
        params: {
          username: value,
        },
      });
      if (code == 200) {
        return true;
      } else {
        return false;
      }
    },

    //用户注册
    async onSubmit(values) {
      let username = values["用户名"];
      let password = values["密码"];
      //post请求数据库
      // 加密
      const hash = crypto.createHash("sha256");
      hash.update(password);
      const newPassword = hash.digest("hex");

      // 发起ajax请求注册
      const { data } = await this.$ajax.post("/user/reg", {
        username,
        password: newPassword,
      });
      if (data.code == 200) {
        this.$router.replace({ path: "/login", query: { path: "/home" } });
      } else {
        this.$notify("注册失败，请重新注册");
      }
    },
  },
};
</script>
<style scoped lang="scss">
#reg {
  // width: 80%;
  // margin: 0 auto;
  .nav {
    height: 1.1rem;
    width: 2.65rem;
    border: 0.02rem solid #ccc;
    margin-left: 0.2rem;
    display: flex;
    justify-content: space-between;
    border-radius: 0.96rem;
    padding: 0 0.2rem 0 0.2rem;
    overflow: hidden;
    margin: 0.6rem 0.7rem 0 0.6rem;
    align-items: center;
  }
  //标题
  h2.title {
    margin: 2rem 0 1rem 0.6rem;
    font-size: 1.2rem;
    font-weight: bolder;
    color: #383934;
  }
  //注册框
  .van-form {
    // background-color: cadetblue;
    margin: 0 auto;
    width: 90%;
    .van-field {
      font-size: 0.5rem;
      margin-bottom: 1rem;
    }
  }
  .van-checkbox {
    margin-left: 0.6rem;
    font-size: 0.3rem;
  }
  .van-button {
    font-size: 0.5rem;
    font-weight: bold;
    margin-top: 1.8rem;
  }
}
</style>