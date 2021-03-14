<template>
  <div>
    <!-- ----------------------------气泡------------------------------>
    <div class="Bubble" v-show="start">
      <p class="words">{{ word[idx] }}</p>
    </div>
    <div class="triangle"></div>
    <van-col span="8" offset="8">
      <!-- ---------------------------logo----------------------------->
      <img class="logo" src="../../public/image/logo.png" />
      <p class="logoP" v-if="show">下厨房</p>
    </van-col>
    <!-- ---------------------------搜索框----------------------------->
    <van-search
      disabled
      class="searchval"
      v-model="searchval"
      input-align="center"
      @click="$router.replace('/myPopup')"
      placeholder="今天想吃什么？"
      style="border-radius: 0.1rem"
    />
    <!-- ---------------------------轮播图--------------------------- -->
    <van-swipe class="myswipe" :autoplay="1000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" style="display: block; margin: 0" />
      </van-swipe-item>
    </van-swipe>
    <!-- ---------------------------回到顶部--------------------------- -->
    <!-- <van-button
      type="default"
      class="backTop"
      @click="backTop"
      v-show="flag_scroll"
    >
      <van-icon name="arrow-up" size="20" />
    </van-button> -->
    <!-- <van-button icon="../../public/image/gotop.png" type="info">
      按钮
    </van-button> -->
    <!-- <img
      class="gotop"
      style="width: 0.9rem"
      src="../../public/image/gotop.png"
      alt=""
    /> -->
    <!-- ---------------------------瀑布流--------------------------- -->

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-row>
        <van-col
          span="12"
          v-for="(item, index) in goodslist"
          :key="index"
          @click="gotodetail(item._id)"
        >
          <img
            class="pic"
            :src="item.mpic"
            alt=""
            style="display: block; margin-top: 0.3rem; border-radius: 0.2rem"
          />
          <h4
            class="title1"
            style="
              font-size: 0.4rem;
              margin: 0.2px;
              text-align: center;
              margin-top: 0.2rem;
            "
          >
            {{ item.title }}
          </h4>

          <div class="written-words" style="">
            <p style="font-size: 0.29rem">
              评分：{{ item.score }} . 多少人做过：{{ item.collnum }}
            </p>
          </div>
        </van-col>
      </van-row>
    </van-list>

    <!-- ---------------------------footer--------------------------- -->
    <div>
      <Tabbar />
    </div>
  </div>
</template>
<script>
import Tabbar from "../components/Tabbar.vue";
export default {
  components: { Tabbar },
  name: "Home",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      show: false,
      scrollaa: 0,
      logo: "",
      searchval: "",
      myswipe: "",
      images: [
        "https://i3.meishichina.com/attachment/magic/2021/01/08/2021010816101053174018197577.jpg",
        "https://i3.meishichina.com/attachment/magic/2021/01/11/2021011116103575604178197577.jpg",
        "https://i3.meishichina.com/attachment/magic/2020/11/13/2020111316052604916248197577.jpg",
        "https://i3.meishichina.com/attachment/magic/2020/12/25/2020122516088888373848197577.jpg",
      ],
      goodslist: [],
      size: 10,
      refreshing: "",
      idx: 0,
      start: false,
      word: [
        "早上好",
        "周末大作战",
        "今日大赛",
        "中午好",
        "你好啊",
        "大家好",
        "厨师们好",
        "今天吃啥?",
      ],
      backTop: "",
    };
  },

  async created() {
    //获取数据
    this.getdata();
  },
  methods: {
    //定时事件
    get() {
      if (this.start == true) {
        this.start = false;
        return;
      }
      this.start = true;
      this.idx++;
    },

    async getdata() {
      const { data } = await this.$ajax.get("/goods/rm/sj");
      this.goodslist = this.goodslist.concat(data.data);
      this.loading = false;
    },
    onLoad() {
      this.getdata();
    },

    jiantingfn() {
      this.scrollaa =
        document.documentElement.scrollTop || document.body.scrollTop;
    },
    gotodetail(id) {
      // console.log(id);
      this.$router.push("/goods/" + id);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.jiantingfn);
    this.timer = setInterval(this.get, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  // 回到顶部
  backTop() {
    document.getElementsByClassName("equi_container")[0].scrollTop = 0;
  },
  // 解决监听抖动
  watch: {
    scrollaa: function (newData) {
      if (newData > 50) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
  },
};
</script>

<style  scoped>
/* 气泡 */
.Bubble {
  height: 0.57rem;
  background: #f4c64d;
  border: 0.02rem solid #f4c64d;
  border-radius: 20px 20px 20px 0; /*圆角弧度为7px*/
  position: absolute;
  top: 0.5rem;
  left: 6.9rem;
}
.Bubble::before {
  content: "";
  width: 0;
  height: 0;
  border-top: 0.18rem solid;
  border-right: 0.18rem solid;
  position: absolute;
  bottom: -0.19rem;
  left: -0.022rem;
  border-color: #f4c64d transparent transparent;
}
.words {
  font-size: 0.28rem;
  color: #fefefe;
  text-align: center;
  margin: 0;
  line-height: 0.57rem;
}

.logo {
  margin-bottom: 0;
  height: 0.97rem;
  margin-top: 1.13em;
  margin: 1.13em 0 auto;
  margin-bottom: 0.78rem;
}
.logoP {
  height: 2rem;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  font-size: 0.6rem;
  font-weight: 900;
  background-color: #fff;
  margin-top: 0;
  text-align: center;
  line-height: 2rem;
  z-index: 999;
}
.searchval {
  width: 93%;
  margin: auto;
}

.myswipe {
  width: 86%;
  height: 2.97rem;
  margin: 0 auto;
}
.data-v-fae5bece {
  width: 86%;
}
.myswipe img {
  width: 100%;
  display: block;
}

.gotop {
  position: absolute;
  bottom: 0;
  right: 0;
}

/************************* 瀑布流************************ */

.van-row {
  width: 88%;
  margin: 0 auto;
  flex-direction: column;
}
.pic {
  width: 4.7rem;
  /* border: 1px solid red; */
  margin: 0 auto;
}
.written-words {
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0;
}
.data-v-fae5bece {
  margin: 0;
  padding: 0;
}
</style>