<template>
  <div>
    <van-overlay :show="show" style="background-color: #fff">
      <div class="wrapper">
        <van-loading size="24px" vertical>加载中...</van-loading>
      </div>
    </van-overlay>
    <van-sticky>
      <div style="height: 2.2rem; background: #fff">
        <p class="nav">
          <span>
            <van-icon
              name="arrow-left"
              size="0.8rem"
              @click="$router.replace('/list')"
          /></span>
          <img src="/image/line1.gif" alt="" style="height: 0.7rem" />
          <span>
            <van-icon
              name="home-o"
              size="0.8rem"
              @click="$router.replace('/home')"
          /></span>
        </p>
        <span class="title">{{ goods.title }}</span>
      </div>
    </van-sticky>

    <div class="box">
      <van-image width="100%" height="9rem" fit="cover" :src="goods.mpic" />
      <div class="contents">
        <div class="fTitl">
          <p style="margin-bottom: 0">
            {{ goods.subject }}
          </p>
          <p class="mes">
            <span v-html="goods.score + message + '综合评分'"></span>
            <span style="display: inline-block; margin: 0 0.32rem 0 0.32rem"
              >·</span
            >

            <span>{{ goods.islike + "人最近做过" }}</span>
          </p>
          <van-divider />
        </div>
        <img :src="goods.avatar" class="avatar" />
        <span>{{ goods.username }}</span>
        <van-button
          type="danger"
          :plain="is"
          class="follow"
          @click="shows"
          ref="btn"
        >
          {{ mes }}
        </van-button>
        <div>
          <span>{{ goods.message }}</span>
        </div>
        <span
          style="
            display: block;
            font-size: 0.6rem;
            margin: 0.7rem 0 0.7rem 0;
            font-weight: 900;
          "
          >用料</span
        >
        <van-list>
          <van-cell v-for="item in material" :key="item" :title="item">
            <span style="color: #555">1份</span>
          </van-cell>
        </van-list>
      </div>
    </div>
    <van-tabbar active-color="#e76f58">
      <van-tabbar-item :icon="likelogo" @click="collection">{{
        mesSC
      }}</van-tabbar-item>
      <van-tabbar-item icon="more-o" @click="Bullet = !Bullet"
        >评论</van-tabbar-item
      >
    </van-tabbar>
    <!-- 底部评论 -->
    <van-action-sheet v-model="Bullet" title="评论区" :actions="actions">
      <!-- <span>评论区</span> -->
      <div class="content">
        <van-field
          center
          clearable
          v-model="word"
          type="text"
          placeholder="请大声评论"
        >
          <template #button>
            <van-button size="small" plain type="default" @click="send"
              >发送评论</van-button
            >
          </template>
        </van-field>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Goods",
  data() {
    return {
      mes: "关注",
      zId: "",
      show: true,
      goods: {},
      message: "&nbsp;",
      material: [],
      is: false,
      loading: false,
      finished: false,
      Bullet: false,
      actions: [],
      word: "",
      res: false,
      isSC: false,
      likelogo: "",
      mesSC: "",
    };
  },
  computed: {
    ...mapState({
      userId(state) {
        return state.user.userInfo._id;
      },
      username(state) {
        return state.user.userInfo.username;
      },
    }),
  },

  async created() {
    let id = this.$route.params.id;
    this.zId = id;
    let { data } = await this.$ajax.get("/goods/" + id);
    this.goods = data.data;
    this.show = false;
    let mater = this.goods.mainingredient;
    let arr = mater.substr(0, mater.length - 1).split("、");
    this.material = arr;
    this.isCare();
    //评论区渲染
    this.goods.comments.forEach((item) => {
      this.actions.push({
        name: item.comments,
      });
    });
    //判断是否关注
    if (this.goods.care.length > 0) {
      this.is = true;
      this.mes = "已关注";
    } else {
      this.is = false;
      this.mes = "关注";
    }
    //判断是否收藏
    if (this.goods.collect.length > 0) {
      this.isSC = true;
      this.mesSC = "已收藏";
      this.likelogo = "like";
    } else {
      this.isSC = false;
      this.mesSC = "收藏";
      this.likelogo = "like-o";
    }
  },
  methods: {
    //点击关注
    async shows() {
      if (!this.userId) {
        this.$dialog
          .alert({
            message: "您还没有登录哦！",
            theme: "round-button",
          })
          .then(() => {
            // on close
            this.$router.replace("/login");
          });

        return;
      }
      let flags = "";
      this.is = !this.is;
      if (this.is) {
        flags = "true";
        this.mes = "已关注";
      } else {
        flags = "false";
        this.mes = "+关注";
      }
      let _id = this.zId;
      let userId = this.userId;
      const {
        data: { data },
      } = await this.$ajax.get("/goods/updateCircle/guanzhu", {
        params: {
          _id,
          userId,
          flags,
        },
      });
      this.goods = data;
      // console.log("Result.data", data);
    },
    async isCare() {
      let id = this.userId;
      await this.$ajax.get("/goods/zuopin/geren", {
        params: {
          id,
        },
      });
      // console.log("isCare", result);
    },
    //点击收藏
    async collection() {
      if (!this.userId) {
        this.$dialog
          .alert({
            message: "您还没有登录哦！",
            theme: "round-button",
          })
          .then(() => {
            // on close
            this.$router.replace("/login");
          });

        return;
      }
      let flags = "";
      this.isSC = !this.isSC;
      if (this.isSC) {
        flags = "true";
        this.mesSC = "已收藏";
        this.likelogo = "like";
      } else {
        flags = "false";
        this.mesSC = "收藏";
        this.likelogo = "like-o";
      }
      let _id = this.zId;
      let userId = this.userId;
      const {
        data: { data },
      } = await this.$ajax.get("/goods/updateCircle/shoucang", {
        params: {
          _id,
          userId,
          flags,
        },
      });
      this.goods = data;
      // console.log("Result.data", data);
    },
    onLoad() {
      console.log(9);
    },
    //点击发送
    async send() {
      if (!this.userId) {
        this.$dialog
          .alert({
            message: "您还没有登录哦！",
            theme: "round-button",
          })
          .then(() => {
            // on close
            this.$router.replace("/login");
          });

        return;
      }
      let obj = {
        name: this.username + ":" + this.word,
      };
      this.actions.push(obj);
      // console.log("action", this.actions);
      let _id = this.zId;
      let userId = this.userId;
      let comments = obj.name;
      let data = {
        _id,
        userId,
        comments,
      };
      await this.$ajax.post("/goods/dianzan/updateCircle", {
        data,
      });
      // console.log(result);
    },
  },
};
</script>

<style scoped>
span {
  font-size: 0.56rem;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90%;
}

.van-loading {
  background: #555;
  opacity: 0.8;
  height: 2.3rem;
  width: 2.3rem;
  line-height: 2rem;
  text-align: center;
  border-radius: 0.1rem;
  padding: 0.5rem;
}

.van-loading__text {
  font-size: 0.5rem;
  color: #fff;
}

.nav {
  height: 1.1rem;
  width: 2.65rem;
  border: 0.02rem solid #ccc;
  margin-left: 0.2rem;
  display: flex;
  justify-content: space-between;
  border-radius: 0.96rem;
  padding: 0 0.2rem 0 0.2rem;
  float: left;
  overflow: hidden;
  margin: 0.6rem 0.7rem 0 0.2rem;
  align-items: center;
}

.box {
  height: 100%;
}

.box:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.title {
  float: left;
  margin: 0.6rem 0 0.6rem 0;
  width: 5rem;
  font-size: 0.7rem;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.contents {
  padding: 0 0.67rem 0 0.67rem;
}

.fTitl {
  text-align: center;
  overflow: hidden;
}

.mes {
  margin-top: 0;
}

.van-divider--hairline::before {
  -webkit-transform: scaleY(1);
  transform: scaleY(1);
}

.avatar {
  vertical-align: top;
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 1.8rem;
  margin-right: 0.64rem;
  margin-bottom: 0.6rem;
}

.van-sticky {
  height: 72px;
  background: #fff;
}

.van-cell::after {
  transform: scaleY(2);
}
.van-cell {
  height: 1.5rem;
}
.follow {
  height: 1.2rem;
  width: 2.8rem;
  /* color: #e86f58; */
  float: right;
  margin-top: 0.3rem;
  /* color: #fff; */
}

.van-popup {
  height: 11rem;
}

.content {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.van-field__control {
  background-color: #555;
  opacity: 0.6;
}

.van-action-sheet__item {
  text-align: left;
  border-bottom: 0.02rem solid #ccc;
}

.van-action-sheet__name {
  color: #ffb6c1;
}
</style>