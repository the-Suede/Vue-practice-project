<template>
  <div>
    <van-sticky :offset-top="0">
      <p class="nav">
        <span>
          <van-icon
            name="arrow-left"
            size="0.8rem"
            @click="$router.push('/home')"
        /></span>
        <img src="/image/line1.gif" alt="" style="height: 0.7rem" />
        <span>
          <van-icon name="home-o" size="0.8rem" @click="$router.push('/home')"
        /></span>
      </p>
      <h5 class="bigTit">菜谱搜索</h5>

      <div class="saction" @click="onSearch" v-if="len">搜索</div>
      <van-search
        autofocus
        v-model="searchVal"
        show-action
        placeholder="你今天想吃什么？"
        class="search"
        ref="input"
        @cancel="onCancel"
        @input="onInput"
        :clearable="false"
      >
      </van-search>

      <van-divider style="margin-bottom: 0.8rem" />
    </van-sticky>

    <div class="history" v-if="historyList.length > 0">
      <div class="top">
        <h6 style="font-size: 0.466667rem; color: 3a3a3a; margin: 0">
          搜索历史
        </h6>
        <van-icon
          name="delete-o"
          @click="clearData"
          size="20px"
          style="display: block"
        />
      </div>
      <div class="down">
        <van-tag
          v-for="(item, index) in historyList"
          :key="index"
          type="default"
          size="large"
          color="#f9f9f7"
          text-color="#3a3a3a"
          style="padding: 0.3rem 0.45rem 0.3rem 0.45rem"
          >{{ item }}</van-tag
        >
      </div>
    </div>

    <div class="history">
      <div class="top">
        <h6 style="font-size: 0.466667rem; color: 3a3a3a; margin: 0">
          热门搜索
        </h6>
      </div>
      <div class="down">
        <van-tag
          v-for="(food, idx) in hot"
          :key="idx"
          type="default"
          size="medium"
          color="#f9f9f7"
          text-color="#3a3a3a"
          style="padding: 0.3rem 0.45rem 0.3rem 0.45rem"
          @click="hotter(food)"
          >{{ food }}
        </van-tag>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "myPopup",
  data() {
    return {
      searchVal: "",
      iptPlaceholder: "",
      // 1代表历史记录与热门搜索区块
      blockShow: 1,
      historyList: [],
      hot: ["粉", "花生", "番茄", "牛骨汤", "猪蹄", "黑米粥", "南瓜汤"],
      route: "",
      len: false,
      path: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm._data.route = from.path;
      if (from.path == "/list") {
        vm.len = true;
      } else if (from.path == "/home") {
        vm.len = false;
      }
    });
    next();
  },
  created() {
    //将本地搜索的数据取出来存进historyList
    this.historyList == null
      ? []
      : JSON.parse(localStorage.getItem("historyList"));
  },

  methods: {
    //点击搜索事件 + 历史记录的实现
    ...mapMutations(["setData"]),
    async onSearch() {
      //将用户输入的关键字存入store仓库
      this.setData(this.searchVal);
      //跳转至详情页
      this.$router.push("/list");
      this.$route.meta.keepAlive = true;
      //判断如果历史记录本地存储中是否已经存在
      if (!this.historyList.includes(this.searchVal)) {
        this.historyList.unshift(this.searchVal);
        localStorage.setItem(history, JSON.stringify(this.historyList));
      } else {
        let idx = this.historyList.indexOf(this.searchVal);
        this.historyList.splice(idx, 1);
        this.historyList.unshift(this.searchVal);
        localStorage.setItem("historyList", JSON.stringify(this.historyList));
      }
    },
    //输入框输入事件
    onInput() {
      this.len = true;
    },
    //清空搜索记录
    clearData() {
      //清空本地存储
      localStorage.removeItem("historyList");
      this.historyList = [];
    },
    //点击热门搜索的事件
    hotter(food) {
      this.searchVal = food;
      //自动触发点击事件
      this.onSearch();
    },
    //点击取消按钮
    onCancel() {
      this.setData("取消");
      this.$router.push(this.route);
    },
    //返回上一级事件
    // up() {
    //   if (window.history.length <= 1) {
    //     this.$router.push({
    //       path: "/home",
    //     });
    //     return false;
    //   } else {
    //     this.$router.go(-1);
    //   }
    //   console.log(this);
    //   console.log(this.route);

    //   this.$router.replace(this.route);
    // },
  },
};
</script>

<style scoped>
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
  margin: 0.6rem 0.7rem 0 0.6rem;
  align-items: center;
}

.search {
  width: 100%;
}

.saction {
  font-size: 0.48rem;
  margin-right: 0.8rem;
  position: absolute;
  right: 0.8rem;
  top: 2.18rem;
  color: #e76f58;
  z-index: 5;
}

.bigTit {
  font-size: 0.48rem;
  font-weight: 600;
  text-align: center;
  background-color: #fff;
  padding-top: 0.3rem;
  float: left;
  margin: 0.6rem 0 0 0.8rem;
}

.van-search__content {
  background-color: #fff;
}

/* .van-field__control {
        font-size: 0.52rem;
        width:0.8rem;
    } */

.van-divider {
  margin-top: 0;
}

.history {
  padding: 0 2%;
  margin-bottom: 1rem;
}

/**************************top************************* */
.top {
  width: 100%;
  height: 30px;
  /* background: #000; */

  display: flex;
  justify-content: space-between;
}

h6 {
  font-weight: normal;
}

.van-divider {
  margin: 0;
}

/**************************down************************* */
.down .van-tag {
  font-size: 0.4rem;
  margin-right: 0.3rem;
}
</style>