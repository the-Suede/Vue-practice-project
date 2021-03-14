<template>
  <div id="guanzhu">
    <!-- 头部 -->
    <van-nav-bar :border="false">
      <template #left>
        <!-- 跳转发布页面 -->
        <van-icon
          name="arrow-left"
          size="0.8rem"
          @click="$router.replace('/mine')"
          color="#ccc"
        />
      </template>
      <!-- 关注 -->
      <template #title>
        <span>关注</span>
      </template>
    </van-nav-bar>
    <!-- 未有关注的人 -->
    <p class="noGuanzhu" v-if="haveGuanzhu">还没有关注的人喔~</p>
    <!-- 关注列表 -->
    <van-cell v-for="item in guanzhuArr" :key="item.username">
      <van-card :title="item.username" :thumb="item.avatar"> </van-card>
    </van-cell>
    <!--------------->
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "guanzhu",
  data() {
    return {
      guanzhuData: [],
      haveGuanzhu: false,
    };
  },
  computed: {
    //具有缓存功能
    //映射State
    //点击我判断是否有登录，有登录显示此页面，并且传递id值；没登录显示登录页面
    ...mapState({
      userId(state) {
        return state.user.userInfo._id;
      },
      guanzhuArr(state) {
        return state.user.arr;
      },
    }),
  },
  beforeRouteEnter: function (to, from, next) {
    next((vm) => {
      if (!vm.userId) {
        vm.$router.push("/login");
      }
    });
  },
  async created() {
    // let id = this.id;
    //所有数据
    // let {
    //   data: { data },
    // } = await this.$ajax.get("/goods");
    //循环所有数组
    // data.forEach((item) => {
    //   // console.log(item.care);
    //   let a = item.care.some((Iitem) => Iitem == this.userId);
    //   if (a) {
    //     this.arr.push({ username: item.username, avatar: item.avatar });
    //   }
    // });
    //打印一下arr
    // console.log(this.arr);
    if (this.guanzhuArr.length < 1) {
      this.haveGuanzhu = true;
    }
  },
};
</script>
<style scoped lang="scss">
#guanzhu {
  .van-nav-bar {
    height: 1rem;
    margin-top: 0.2rem;
    span {
      font-size: 0.68rem;
    }
  }
  .noGuanzhu {
    color: #333;
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.4rem;
  }
}
</style>