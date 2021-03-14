<template>
  <div id="mine">
    <!-- 头部 -->
    <van-nav-bar :border="false">
      <template #left>
        <!-- 跳转发布页面 -->
        <van-icon
          name="plus"
          size="0.8rem"
          @click="goto('/publish')"
          color="#ccc"
        />
      </template>
      <!-- 我 -->
      <template #title>
        <span>我</span>
      </template>
      <template #right>
        <!-- 跳转设置页面 -->
        <van-icon
          name="setting-o"
          size="0.8rem"
          @click="show = !show"
          color="#ccc"
        />
      </template>
    </van-nav-bar>

    <!-- 退出账号弹框 -->
    <van-popup v-model="show" :close-on-click-overlay="false">
      <van-button type="primary" @click="logout" size="large"
        >退出账号</van-button
      >
      <van-divider />
      <van-button type="primary" @click="show = !show" size="large" plain
        >取消</van-button
      >
    </van-popup>

    <!-- 用户信息 -->
    <van-row class="userInfo">
      <van-col span="12">
        <!-- 用户名 -->
        <p class="username">{{ userData.name }}</p>
        <!-- 加入时间 -->
        <span class="joinTime">
          {{ userData.regtime.substr(0, 4) }}&nbsp;加入
        </span>
      </van-col>
      <van-col span="12" align="center">
        <!-- 头像 -->
        <van-image class="head" fit="cover" round :src="userData.avator" />
      </van-col>
    </van-row>

    <div class="van-hairline--bottom">
      <van-row class="userAction">
        <!-- 关注与粉丝 -->
        <van-col span="11" class="userAction_text">
          <van-row>
            <van-col span="12" class="following text" @click="goto('/guanzhu')">
              <p class="num">{{ arr.length }}</p>
              <p>关注</p>
            </van-col>
            <van-col span="12" class="followers text">
              <p class="num">{{ userData.fans }}</p>
              <p>粉丝</p>
            </van-col>
          </van-row>
        </van-col>

        <!-- 按钮 -->
        <van-col span="13" class="btn">
          <van-button type="primary" @click="goto('publish')"
            >发布作品</van-button
          >
          <van-button type="primary" @click="goto('setting')"
            >编辑信息</van-button
          >
        </van-col>
      </van-row>
    </div>

    <!-- 收藏与作品 -->
    <van-tabs v-model="activeName">
      <van-tab title="作品" name="b">
        <!-- 作品 -->

        <!-- 未审核 -->
        <van-cell v-for="item in productData0" :key="item.id">
          <van-card
            :desc="item.mainingredient"
            :title="item.title"
            :thumb="item.mpic"
            tag="未审核"
            style="opacity: 0.6"
          >
          </van-card>
        </van-cell>
        <!-- 已审核 -->
        <van-cell v-for="item in productData1" :key="item.id">
          <van-card
            :desc="item.mainingredient"
            :title="item.title"
            :thumb="item.mpic"
            @click="click(item._id)"
          >
            <template>
              <van-tag plain type="danger">{{ item.copyright }}</van-tag>
              <van-tag plain type="danger">{{}}</van-tag>
            </template>
          </van-card>
        </van-cell>
        <!-- 作品 -->
      </van-tab>
      <van-tab title="收藏" name="a">
        <!-- 收藏 -->
        <van-cell v-for="item in collectArr" :key="item.id">
          <van-card
            :num="item.username"
            :desc="item.mainingredient"
            :title="item.title"
            :thumb="item.mpic"
            @click="click(item._id)"
          >
          </van-card>
        </van-cell>
        <!-- 收藏 -->
      </van-tab>
    </van-tabs>

    <!-- footer----------------------------- -->
    <div id="footer" style="height: 1.5rem; background-color: #fff">
      <Tabbar />
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import Tabbar from "../components/Tabbar.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Mine",
  components: { Tabbar },
  data() {
    return {
      show: false,
      userData: {
        name: "厨房仔",
        username: "",
        regtime: "2021",
        avator: "https://img.yzcdn.cn/vant/cat.jpeg",
        guanzhu: 111,
        fans: 222,
        collects: [],
        product: [],
      },
      productData0: [],
      productData1: [],
      activeName: "",
      arr: [],
      collectArr: [],
    };
  },
  computed: {
    //具有缓存功能
    //映射State
    //点击我判断是否有登录，有登录显示此页面，并且传递id值；没登录显示登录页面
    ...mapState({
      id(state) {
        return state.user.userInfo._id;
      },
    }),
  },
  beforeRouteEnter: function (to, from, next) {
    next((vm) => {
      if (!vm.id) {
        vm.$router.push("/login");
      }
    });
  },
  created() {
    // 获取用户信息
    // console.log(this.id);
    this.getUserData(this.id);
    this.collectsRender(this.collectsData);
    this.productRender(this.productData);
    this.getGuanzhu();
  },
  methods: {
    //隐射logout方法
    ...mapMutations({
      logout: function (commit) {
        commit("logout");
        this.goto("/login");
      },
      guanzhu: function (commit) {
        commit("guanzhu", this.arr);
      },
    }),
    //根据id---获取用户基本信息
    async getUserData(id) {
      const {
        data: { data },
      } = await this.$ajax.get("/user/users/details/" + id);
      if (data.avator == "" || !data.avator) {
        data.avator = "https://img.yzcdn.cn/vant/cat.jpeg";
      }
      // console.log(data.name);
      if (!data.name) {
        data.name = "厨房喵";
      }
      if (!data.guanzhu) {
        data.guanzhu = 0;
      }
      if (!data.fans) {
        data.fans = 0;
      }
      // console.log(data);
      this.userData = data;
    },
    //跳转
    goto(path) {
      this.$router.replace(path);
    },
    //利用this.collects---渲染我的收藏
    async collectsRender() {
      let id = this.id;
      let {
        data: { data },
      } = await this.$ajax.get("/goods");
      // console.log("收藏", id, data);
      //循环所有数组
      data.forEach((item) => {
        let c = item.collect.some((Iitem) => Iitem == id);
        if (c) {
          this.collectArr.push(item);
        }
      });
      // console.log("collect", this.collectArr);
    },

    //利用this.production---渲染我的作品
    async productRender() {
      let id = this.id;
      //未审核
      let result = await this.$ajax.get("/goods/zuopin/geren", {
        params: { id: id, status: 0 },
      });
      let data0 = result.data.data;
      this.productData0 = data0;
      //已审核
      let {
        data: { data },
      } = await this.$ajax.get("/goods/zuopin/geren", {
        params: { id: id, status: 1 },
      });
      this.productData1 = data;
    },
    //获取关注用户数组
    async getGuanzhu() {
      let {
        data: { data },
      } = await this.$ajax.get("/goods");

      //循环所有数组
      data.forEach((item) => {
        // console.log(item.care);
        let a = item.care.some((Iitem) => Iitem == this.id);
        if (a) {
          this.arr.push({ username: item.username, avatar: item.avatar });
        }
      });
      // console.log(this.arr);
      this.guanzhu();
    },
    click(id) {
      this.$route.meta.keepAlive = true;
      window.addEventListener("scroll", function () {
        this.scrolls = $(window).scrollTop();
      });
      this.$router.push(`/goods/${id}`);
    },
  },
};
</script>
<style scoped lang="scss">
#mine {
  width: 90%;
  margin: 0 auto;
  .van-nav-bar {
    height: 1rem;
    margin-top: 0.2rem;
    span {
      font-size: 0.68rem;
    }
  }
  //退出登录框
  .van-popup {
    width: 8rem;
  }
  //用户信息
  .userInfo {
    margin-top: 0.68rem;
    color: #383832;
    .username {
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .joinTime {
      font-size: 0.3rem;
    }
  }
  .userAction {
    margin-top: 0.3rem;
    padding-bottom: 0.2rem;
    border-bottom: solid 1px #e5e5e3;
    .btn {
      display: flex;
      justify-content: space-around;
      button {
        border-radius: 0.15rem;
      }
    }
    .userAction_text {
      margin-top: 0.1rem;
      .num {
        font-weight: 550;
      }
    }
  }
  .head {
    width: 3rem;
    height: 3rem;
  }
  .text {
    font-size: 0.28rem;
  }
}
</style>