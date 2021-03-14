<template>
  <div id="demo">
    <van-sticky :offset-top="0">
      <div style="height: 2.2rem; background: #fff">
        <p class="nav">
          <span>
            <van-icon name="arrow-left" size="0.8rem" @click="$router.go(-1)"
          /></span>
          <img
            src="../../public/image/line1.gif"
            alt=""
            style="height: 0.7rem"
          />
          <span>
            <van-icon
              name="home-o"
              size="0.8rem"
              @click="$router.replace('/home')"
          /></span>
        </p>
        <h5 class="bigTit">菜谱搜索</h5>
      </div>
      <van-search
        v-model="searchVal"
        disabled
        show-action
        placeholder="请输入搜索关键词"
        class="search"
        @click="$router.push('/myPopup')"
      >
        <template #action>
          <div style="font-size: 0.48rem">搜索</div>
        </template>
      </van-search>
      <van-divider />
    </van-sticky>
    <van-row class="top">
      <van-col span="8" style="font-weight: bold; color: #000" @click="compre"
        >综合</van-col
      >
      <van-col span="8" @click="Hscore">评分最高</van-col>
      <van-col span="8" @click="cook">做过最多</van-col>
    </van-row>
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <van-cell v-for="item in datalist" :key="item.id">
          <van-card
            :num="item.username"
            :desc="item.mainingredient"
            :title="item.title"
            :thumb="item.mscover"
            @click="click(item._id)"
          >
            <template #tags>
              <van-col span="8" style="width: 1.2rem">{{
                item.score + "分"
              }}</van-col>
              <van-col span="8">{{ item.islike + "人做过" }}</van-col>
            </template>
          </van-card>
        </van-cell>
        <!-- <van-cell v-if="datalist.length == 0">
                        <span style="display:block;width:100%;text-align:center">.....我也是有底线的.....</span>
                     </van-cell> -->
      </van-list>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "List",
  data() {
    return {
      searchVal: "",
      datalist: [],
      loading: false,
      finished: false,
      path: "",
      fa: true,
    };
  },
  //映射仓库关键字
  computed: {
    ...mapState({
      keyword(state) {
        return state.keyword;
      },
    }),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //判断是否是从分类页面跳转至列表页，如果是就获取随机的数据，如果不是的话就直接从本地取出数据
      if (from.path == "/sort") {
        vm.$data.path = "/sort";
        vm.getData();
        return;
      }
      //如果是从搜索页跳转过来的那就获取关键字
      if (from.path == "/myPopup") {
        vm.$data.path = "/myPopup";
        return;
      }
      vm.$data.datalist = JSON.parse(localStorage.getItem("goods"));
    });
  },
  watch: {
    keyword() {
      if (this.keyword == "" || this.keyword == "取消") {
        // console.log(4);
        this.compre();
      }

      this.$ajax
        .get("/goods/like/search", {
          params: {
            key_word: this.keyword,
          },
        })
        .then((data) => {
          this.datalist = data.data.data;
        });
    },
  },
  beforeRouteUpdate(to, from, next) {
    next((vm) => {
      vm.getData();
    });
  },
  //离开当前路由的时候就将当前的数据存入本地
  beforeRouteLeave(to, from, next) {
    localStorage.setItem("goods", JSON.stringify(this.datalist));

    if (to.name !== "goods") {
      this.$route.meta.keepAlive = false;
    }
    next();
  },
  methods: {
    //获取数据
    getData() {
      this.$ajax.get("/goods/rm/sj").then((data) => {
        data = data.data.data;
        this.datalist = this.datalist.concat(data);
        this.loading = false;
      });
    },
    //滚动条至底部时触发的列表加载事件
    onLoad() {
      this.getData();
    },
    //跳转至详情页的点击事件
    click(id) {
      this.$route.meta.keepAlive = false;
      this.$router.push(`/goods/${id}`);
    },
    //综合点击事件
    async compre() {
      // console.log("om");
      let {
        data: { data },
      } = await this.$ajax.get("/goods/rm/sj");
      this.datalist = data;
    },
    //评分最高点击事件
    async Hscore() {
      let {
        data: { data },
      } = await this.$ajax.get("/goods", {
        params: {
          sort: "score",
        },
      });
      this.datalist = data;
    },
    //做过最多点击事件
    async cook() {
      let {
        data: { data },
      } = await this.$ajax.get("/goods", {
        params: {
          sort: "islike",
        },
      });
      this.datalist = data;
    },
  },
};
</script>
<style scoped>
.search {
  width: 100%;
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
  margin: 0.6rem 0.7rem 0 0.6rem;
  align-items: center;
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
.van-search__action {
  padding: 0 8px;
  color: #e76f58;
  font-size: 14px;
  line-height: 34px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}
.van-search__content {
  background-color: #fff;
}
.van-field__control {
  font-size: 0.52rem;
}
.van-divider {
  margin-top: 0;
}
.top {
  font-size: 0.39rem;
  text-align: center;
  color: #999999;
}
.van-card__num {
  float: left;
}
.van-tag {
  color: #5a5a55;
}
.van-card {
  background-color: #fff;
}
.van-card__title {
  font-size: 0.5rem;
  max-height: 32px;
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.van-card__content {
  padding-left: 0.5rem;
}
.van-cell__value--alone {
  margin-top: 0.8rem;
  font-size: 0.5rem;
}
</style>