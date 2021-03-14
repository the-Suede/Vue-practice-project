<template>
  <div>
    <van-col span="8" offset="8" style="overflow: hidden">
      <h5 class="bigTit">菜谱分类</h5>
    </van-col>

    <van-col>
      <template v-for="(item, index) in classification">
        <div :key="index" class="box">
          <h2>{{ item.title }}</h2>
          <van-grid :column-num="4" class="big">
            <van-grid-item
              v-for="(items, idx) in item.mes"
              :key="idx"
              url="/list"
            >
              <div style="height: 2.3rem; width: 2.3rem">
                <van-image
                  :src="items.imgUrl"
                  style="height: 100%; width: 100%"
                />
              </div>
            </van-grid-item>
          </van-grid>
        </div>
      </template>
    </van-col>

    <div id="footer" style="height: 1.5rem; background-color: #fff">
      <Tabbar />
    </div>
  </div>
</template>
<script>
import Tabbar from "../components/Tabbar.vue";
export default {
  name: "Sort",
  components: { Tabbar },
  data() {
    return {
      classification: [
        {
          id: 1,
          title: "热门分类",
          mes: [
            {
              name: "家常菜",
              imgUrl: "/image/1.gif",
            },
            {
              name: "下饭菜",
              imgUrl: "/image/2.gif",
            },
            {
              name: "烘焙",
              imgUrl: "/image/3.gif",
            },
            {
              name: "肉类",
              imgUrl: "/image/4.gif",
            },
            {
              name: "蔬菜",
              imgUrl: "/image/5.gif",
            },
            {
              name: "汤粥主食",
              imgUrl: "/image/6.gif",
            },
            {
              name: "快手菜",
              imgUrl: "/image/7.gif",
            },
          ],
        },

        {
          id: 2,
          title: "菜式",

          mes: [
            {
              name: "素菜",
              imgUrl: "/image/8.gif",
            },
            {
              name: "甜品饮品",
              imgUrl: "/image/9.gif",
            },
            {
              name: "懒人食谱",
              imgUrl: "/image/10.gif",
            },
            {
              name: "下酒菜",
              imgUrl: "/image/11.gif",
            },
            {
              name: "沙拉凉菜",
              imgUrl: "/image/12.gif",
            },
            {
              name: "一人食",
              imgUrl: "/image/13.gif",
            },
            {
              name: "小吃",
              imgUrl: "/image/14.gif",
            },
          ],
        },
        // {
        //   id: 3,
        //   title: "场景",
        //   mes: [
        //     {
        //       name: "早餐",
        //       imgUrl: "/image/15.gif",
        //     },
        //     {
        //       name: "宴客",
        //       imgUrl: "/image/16.gif",
        //     },
        //     {
        //       name: "便当",
        //       imgUrl: "/image/17.gif",
        //     },
        //   ],
        // },
      ],
    };
  },
};
</script>
<style scoped>
span {
  font-size: 0.56rem;
}

.bigTit {
  font-size: 0.48rem;
  font-weight: 600;
  text-align: center;
}

.box h2 {
  font-size: 0.48rem;
  font-weight: 600;
  padding-left: 0.48rem;
}
.foodNa {
  position: absolute;
  bottom: 0.47rem;
  right: 9.3%;
  color: #fff;
  font-weight: 900;
  text-align: center;
  display: inline-block;
  height: 0.7rem;
  width: 2.31rem;
  background: #ff8c00;
  opacity: 0.8;
}
</style>