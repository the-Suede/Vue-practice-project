<template>
  <van-tabbar v-model="active" active-color="#ee0a24" inactive-color="#000">
    <van-tabbar-item icon="home-o" name="/home" @click="goto('/home')"
      >下厨房</van-tabbar-item
    >
    <van-tabbar-item icon="apps-o" name="/sort" @click="goto('sort')"
      >分类</van-tabbar-item
    >
    <van-tabbar-item icon="chat-o" name="/publish" @click="goto('/publish')"
      >发布作品</van-tabbar-item
    >
    <van-tabbar-item icon="friends-o" name="/mine" @click="goto('/mine')"
      >我的</van-tabbar-item
    >
  </van-tabbar>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "tabbar",
  data() {
    return {
      active: "/home",
    };
  },
  computed: {
    //  //点击我判断是否有登录，有登录显示此页面，并且传递id值；没登录显示登录页面
    ...mapState({
      userId(state) {
        return state.user.userInfo._id;
      },
    }),
  },
  created() {
    this.active = this.$route.path;
  },
  methods: {
    goto(path) {
      //如果没登陆，先跳转登录页面
      if (path == "/publish" || path == "/mine") {
        if (!this.userId) {
          this.$router.replace("/login");
        } else {
          this.$router.replace(path);
        }
      } else {
        this.$router.replace(path);
      }
    },
  },
};
</script>