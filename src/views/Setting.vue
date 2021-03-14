<template>
  <div id="setting">
    <!-- 头部 -->
    <van-nav-bar
      title="编辑个人资料"
      right-text="保存"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      color="#ccc"
    />

    <!-- 换头像 -->
    <van-uploader
      :after-read="afterRead"
      v-model="fileList"
      :max-count="1"
      image-fit="cover"
      preview-size="3.8rem"
    >
      <div class="oldHead" v-if="hiddenAvator">
        <van-image
          class="head"
          :src="userData.avator"
          fit="cover"
          width="3.8rem"
          height="3.8rem"
        />
        <p class="headText">上传头像</p>
      </div>
    </van-uploader>

    <!-- 用户名 -->
    <van-field v-model="userData.name" label="用户名" placeholder="输入昵称" />
    <!-- 生日 -->
    <van-field
      v-model="userData.birthday"
      label="生日"
      readonly
      @click="showSelect = !showSelect"
      placeholder="选择生日"
    />
    <!-- 选择日期 -->
    <van-popup
      v-model="showSelect"
      position="bottom"
      :style="{ width: '100%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="showSelect = !showSelect"
        @cancel="showSelect = !showSelect"
      />
    </van-popup>

    <!-- 个人简介 -->
    <van-field
      v-model="userData.msg"
      rows="2"
      autosize
      label="个人简介"
      type="textarea"
      maxlength="50"
      placeholder="添加个人简介，让厨友更了解你"
      show-word-limit
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "setting",
  data() {
    return {
      showSelect: false,
      hiddenAvator: true,
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      userData: {
        avator: "https://img.yzcdn.cn/vant/cat.jpeg",
        birthday: this.currentDate,
        msg: "",
        name: "",
      },
      fileData: "",
      fileList: [],
      result: {},
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
  async created() {
    // 先获取一次用户信息
    const {
      data: { data },
    } = await this.$ajax.get("/user/users/details/" + this.id);
    if (data.avator == "") {
      data.avator = "https://img.yzcdn.cn/vant/cat.jpeg";
    }
    this.userData = data;
  },
  watch: {
    currentDate: function () {
      this.userData.birthday = this.$formatTime(this.currentDate);
    },
  },
  methods: {
    async afterRead(file) {
      this.hiddenAvator = !this.hiddenAvator;
      // console.log("end");
      // console.log(file);
      let arr = [];
      if (!Array.isArray(file)) {
        file = [file];
      }
      file.forEach((item) => {
        arr.push(item.content);
      });
      // console.log(arr);
      // let data = file.content;
      this.fileData = arr;
    },
    onClickLeft() {
      this.$router.replace("/mine");
    },
    async onClickRight() {
      // 保存，更新用户数据
      let { id, fileData } = this;
      let { name, birthday, msg } = this.userData;
      let data = {
        id,
        data: { name, birthday, msg },
        fileData,
      };
      // console.log(data);
      let result = await this.$ajax.post("/user/update/message", { data });
      // console.log(result);
      this.result = result;
      this.$router.replace("/mine");
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      }
      return val;
    },
  },
};
</script>
<style scoped lang="scss">
#setting {
  //头像
  .van-uploader {
    margin: 0.8rem auto;
    display: block;
    display: flex;
    justify-content: center;
    .oldHead {
      position: relative;
      .van-image {
        margin: 0 auto;
      }
      .headText {
        position: absolute;
        bottom: 0.25rem;
        left: 0;
        right: 0;
        opacity: 0.7;
        background-color: #fff;
        font-size: 0.38rem;
        text-align: center;
        margin: 0;
        padding: 0;
      }
    }
  }
  //输入框
  .van-field {
    font-size: 0.48rem;
    margin-bottom: 0.5rem;
  }
}
</style>