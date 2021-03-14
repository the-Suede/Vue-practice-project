<template>
  <div id="publish">
    <!-- 头部 -->
    <van-nav-bar>
      <template #left>
        <!-- 跳转发布页面 -->
        <van-icon
          name="home-o"
          size="0.9rem"
          @click="$router.replace('/home')"
          color="#333"
          style="font-weight: bold"
        />
      </template>
      <template #right>
        <!-- 跳转设置页面 -->
        <span
          style="color: #f8664f"
          class="publishBtn"
          @click="publishBtn"
          color="rgb(234,51,38)"
          :disabled="isPublish"
          >发布</span
        >
      </template>
    </van-nav-bar>

    <!-- 发布图片 -->
    <van-uploader
      :after-read="afterRead"
      v-model="fileList"
      :max-count="1"
      preview-size="5rem"
    />

    <!-- 标题输入框 -->
    <van-cell-group>
      <van-field
        v-model="title"
        placeholder="填写标题，会获得更多赞哦"
        required
      />
    </van-cell-group>

    <!-- 输入内容 -->
    <van-field
      v-model="message"
      rows="4"
      autosize
      type="textarea"
      placeholder="分享一下你的下厨心得、生活点滴"
      show-word-limit
      required
    />

    <!-- 用料 -->
    <van-field
      v-model="mrItem"
      center
      label="用料"
      placeholder="告诉大家你的用料吧！"
      required
    >
      <template #button>
        <van-button
          size="small"
          type="default"
          icon="plus"
          @click="pushMaterial(mrItem)"
          >添加</van-button
        >
      </template>
    </van-field>

    <!-- 渲染用料表格 -->
    <van-list style="font-size: 0.2rem">
      <van-cell title="XXX" style="color: #ccc" v-if="templateItem">
        <span style="color: #ccc">1份</span>
      </van-cell>
      <van-cell v-for="item in material" :key="item" :title="item">
        <span style="color: #555">1份</span>
      </van-cell>
    </van-list>

    <!-- 发布按钮 -->
    <!-- <van-button
      round
      type="info"
      size="large"
      @click="publishBtn"
      color="rgb(234,51,38)"
      :disabled="isPublish"
      class="publishBtn"
      >发布</van-button
    > -->

    <!-- footer----------------------------- -->
    <div id="footer">
      <Tabbar />
    </div>
  </div>
</template>

<script>
import Tabbar from "../components/Tabbar.vue";
import { mapState } from "vuex";
export default {
  name: "App",
  components: { Tabbar },
  data() {
    return {
      title: "",
      message: "",
      userData: {},
      mrItem: "",
      mainingredient: "",
      fileData: "",
      material: [],
      fileList: [],
      templateItem: true,
    };
  },
  async created() {
    //用id请求用户数据，补全作品发布者的username和头像
    // const { data } = await this.$ajax.get("/user/" + this.userId);
    // this.userData = data;
    // console.log(this.userData);
    // console.log(this.isPublish);
  },
  computed: {
    //  //点击我判断是否有登录，有登录显示此页面，并且传递id值；没登录显示登录页面
    ...mapState({
      userId(state) {
        return state.user.userInfo._id;
      },
      username(state) {
        return state.user.userInfo.username;
      },
    }),
    isPublish: {
      get() {
        let judge = false;
        if (
          this.fileData == "" ||
          this.title == "" ||
          this.message == "" ||
          this.mainingredient == ""
        ) {
          judge = true;
        }
        // console.log(this.fileData);
        return judge;
      },
    },
  },
  watch: {
    "material.length": function () {
      if (this.material.length > 0) {
        this.templateItem = false;
      }
    },
  },
  beforeRouteEnter: function (to, from, next) {
    next((vm) => {
      if (!vm.userId) {
        vm.$router.push("/login");
      }
    });
  },
  methods: {
    //添加用料
    pushMaterial(mr) {
      if (!this.mrItem == "") {
        this.material.push(mr);
        this.mrItem = "";
      }
      // console.log(this.material);
      this.mainingredient = this.material.toString();
      console.log(this.mainingredient);
    },
    //读取图片
    async afterRead(file) {
      // console.log("end");
      // console.log(file);
      let arr = [];
      if (!Array.isArray(file)) {
        file = [file];
      }
      file.forEach((item) => {
        arr.push(item.content);
      });
      console.log(arr);
      this.fileData = arr;
    },
    //发布
    async publishBtn() {
      if (this.isPublish) {
        this.$notify({ type: "warning", message: "请完善发布内容哦！" });
        return;
      }
      let { title, message, username, mainingredient, fileData, userId } = this;
      let datas = {
        title,
        message,
        username,
        mainingredient,
        fileData,
        id: userId,
      };
      console.log(datas);
      let { data } = await this.$ajax.post("/goods/publishs", { datas });
      if (data.code == 200) {
        this.$dialog
          .alert({
            message: "上传作品成功！等待审核中...",
          })
          .then(() => {
            // on close
            this.$router.replace("/mine");
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
#publish {
  .van-uploader {
    margin: 0.5rem auto;
    display: block;
    display: flex;
    justify-content: center;
  }
  .publishBtn {
    font-size: 0.6rem;
    font-weight: bold;
  }
}
</style>