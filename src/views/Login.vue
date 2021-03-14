<template>
  <div id="login">
    <!-- 导航按钮 -->
    <p class="nav">
      <span>
        <!-- 放回按钮 -->
        <van-icon
          name="arrow-left"
          size="0.8rem"
          @click="$router.replace('/home')"
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
    <!--  -->
    <!-- 初始样式 -->
    <div class="text">
      <h2 class="title">开始准备好好吃饭</h2>
      <p class="agreement">
        登录即表明你同意《<span>下厨房用户协议</span>》和《<span>下厨房隐私协议</span>》
      </p>
    </div>
    <!-- 登录按钮 -->
    <van-button
      type="primary"
      size="large"
      block
      style="color: #fff"
      @click="show = true"
      >用户登录</van-button
    >
    <!-- 注册按钮 -->
    <van-button
      size="large"
      block
      style="background: #eee"
      @click="goto('/reg')"
      >免费注册</van-button
    >

    <!-- 显示登录框 -->
    <van-overlay :show="show">
      <!-- 遮罩层 -->
      <div class="wrapper" @click="show = false">
        <!-- 登录模块 -->
        <div class="block" @click.stop>
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

            <!-- 登录按钮 -->
            <div style="margin: 16px">
              <van-button round block type="info" native-type="submit"
                >登录</van-button
              >
            </div>
          </van-form>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
const crypto = require("crypto");
export default {
  name: "Login",
  data() {
    return {
      show: false,
      username: "",
      password: "",
    };
  },
  created() {
    // console.log(this.$route.query);
  },
  methods: {
    //跳转注册
    goto(path) {
      this.$router.push(path);
    },

    //用户登录
    async onSubmit(values) {
      let username = values["用户名"];
      let password = values["密码"];
      //post请求数据库
      // 加密
      const hash = crypto.createHash("sha256");
      hash.update(password);
      const newPassword = hash.digest("hex");

      //发起ajax请求登录;
      const { data } = await this.$ajax.get("/user/login", {
        params: {
          username,
          password: newPassword,
        },
      });
      if (data.code == 200) {
        let path = this.$route.query.path;
        if (!path) {
          this.$router.replace("/mine");
        } else {
          this.$router.replace(path);
        }

        //储存登录状态，分享用户id
        this.$store.commit("login", data.data);
      } else {
        this.$notify("用户名或密码错误");
      }
    },
  },
};
</script>
<style scoped lang="scss">
#login {
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
    margin: 2rem 0 0 0.6rem;
    font-size: 1.2rem;
    font-weight: bolder;
    color: #383934;
  }
  p.agreement {
    margin-left: 0.6rem;
    color: #999;
    font-size: 0.36rem;
    white-space: nowrap;
    margin-top: 0;
    margin-bottom: 1.8rem;
    span {
      text-decoration: underline;
    }
  }
  .van-button {
    width: 90%;
    margin: 0.5rem auto;
    border-radius: 0.15rem;
    font-size: 0.5rem;
    font-weight: 600;
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .block {
    background-color: #fff;
    .van-field {
      font-size: 0.5rem;
      margin: 0.5rem 0 0.5rem 0;
    }
  }
}
</style>