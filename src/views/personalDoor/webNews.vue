<template >
  <!-- 整个盒子 -->
  <div class="root-box">
    <!-- 上半部分 -->
    <div class="top-root">
      <!-- 轮播图 -->
      <div class="block left-box">
        <el-carousel height="310px">
          <el-carousel-item v-for="(item,i) in list" :key="i">
            <img style="max-width: 100%;height:310px" :src="item.picpath" alt />
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--公告  -->
      <div class="right-box">
        <div style="height:38px;line-height:38px;padding-left:15px">公告</div>
        <div class="hint-box">
          <span>标题</span>
          <span class="headline">发布人</span>
          <span>发布时间</span>
        </div>
        <div class="block">
          <span class="demonstration" @click="xiangqing" v-for="(item,i) in AnnounceList" :key="i">
            <span class="matter">{{item.title}}</span>
            <span class="matter">{{item.title}}</span>
            <span class="matter">{{item.publishDate}}</span>
          </span>
          <el-pagination background layout="prev, pager, next" :total="50"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 下半部分 -->
    <div class="top-root">
      <div class="left-box1">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,i) in newsType" :key="i" :label="item.sketch" :name="item.name">
              <div v-for="(item,i) in newsList" :key="i" :type="item.type"> {{item.type}}</div>
            <el-pagination background layout="prev, pager, next" :total="50"></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 天气模块 -->
      <div class="bum-right-box">
        <div class="top-root">
          <div class="tianqi-topleft-box">
            <div class="data-box">今日:2020/08/06 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 星期三</div>
            <div class="tianqi-root">
              <span>
                <img src="../../assets/images/tianqi_wps.png" alt />
              </span>
              <span class="tianqi-box">小雨转阴</span>
              <div class="wendu">25℃-30℃</div>
            </div>
          </div>
          <!-- 天气图 -->
          <div class="tianqi-topright-box"></div>
        </div>
        <!-- 下半部分 -->
        <div class="youqing-tishi">今日最高温度31℃ 最低温度25℃ 伴有小雨，出门请记得带伞哟~</div>
        <div class="top-root">
          <span>位置:{郑州}</span>
          <div>
            <el-button-group>
              <el-button type="info" plain>今</el-button>
              <el-button type="primary">明</el-button>
              <el-button type="warning" plain>后</el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </div>
    <div class="bom-box">河南健康奇点网络科技有限公司©All Rights Reserved.</div>
  </div>
</template>
      
<script>
import {
  NewsDetails,
  slideshow,
  newsType,
  AnnounceList,
  newsList,
} from "@/api/personalDoor";
export default {
  data() {
    return {
      list: [],
      newsType: [],
      activeName: "行业",
      AnnounceList: [],
      newsList: [],
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    xiangqing() {},
  },
  created() {
    slideshow().then((res) => {
      // console.log(res.datas);
      this.list = res.datas;
    }),
      newsType().then((res) => {
        // console.log(res.datas);
        this.newsType = res.datas;
      }),
      // 公告
      AnnounceList().then((res) => {
        console.log(res.datas.list);
        this.AnnounceList = res.datas.list;
      });
    // 新闻列表
    newsList().then((res) => {
      console.log(res.datas.list);
      this.newsList = res.datas.list;
    });
  },
};
</script>

<style scoped>
.root-box {
  background-color: #f1f1f1;
}
.top-root {
  display: flex;
  justify-content: space-between;
}
.left-box {
  width: 863px;
  height: 350px;
  padding: 20px 10px 20px 15px;
  margin-top: 10px;
  margin-left: 10px;
  background: rgba(255, 255, 255, 1);
}
.left-box1 {
  width: 1070px;
  height: 588px;
  padding: 0px 10px 20px 15px;
  margin-top: 10px;
  margin-left: 10px;
  background: rgba(255, 255, 255, 1);
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.right-box {
  width: 863px;
  height: 350px;
  margin: 10px 15px 0px 10px;
  background: rgba(255, 255, 255, 1);
}
.hint-box {
  width: 863px;
  height: 43px;
  background: rgba(91, 163, 221, 1);
  line-height: 43px;
  font-size: 14px;
  padding-left: 20px;
}
.headline {
  padding: 0px 240px 0px 414px;
}
.demonstration {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  font-size: 14px;
}
.bom-box {
  text-align: center;
  font-size: 12px;
  height: 60px;
  line-height: 60px;
}
.bum-right-box {
  width: 610px;
  height: 588px;
  background: rgba(255, 255, 255, 1);
  margin: 10px 15px 0px 10px;
}
.biaoti {
  width: 516px;
  height: 23px;
  font-size: 22px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  margin: 40px 0px 40px 0;
}
.neirong {
  width: 608px;
  height: 62px;
  font-size: 14px;
  color: rgba(76, 76, 76, 1);
  margin-bottom: 20px;
  padding-right: 22px;
}
.btn-box {
  width: 100px;
  height: 30px;
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 2px;
  margin-left: 239px;
  display: inline-block;
  text-align: center;
}
.btn-size {
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
  line-height: 30px;
}
.new-box {
  margin-bottom: 40px;
}
.tianqi-topright-box {
  width: 323px;
  height: 322px;
  border: 1px solid black;
}
.tianqi-topleft-box {
  width: 287px;
}
.data-box {
  width: 158px;
  height: 48px;
  font-size: 18px;
  color: rgba(153, 153, 153, 1);
  margin: 29px 53px 140px 63px;
}
.tianqi-box {
  display: inline-block;
  height: 32px;
  font-size: 18px;
  color: rgba(0, 0, 0, 1);
  line-height: 32px;
}
.tianqi-root {
  margin: 29px 53px 80px 63px;
}
.wendu {
  width: 152px;
  height: 25px;
  font-size: 30px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
}
.youqing-tishi {
  width: 462px;
  height: 16px;
  font-size: 16px;
  color: rgba(0, 0, 0, 1);
  margin: 29px 53px 139px 63px;
}
.matter {
  margin: 5px;
  font-size: 14px;
}
</style>


    // <div class="top-root new-box">
    //           <div>
    //             <img src="../../assets/images/图层8.png" alt />
    //           </div>
    //           <div>
    //             <div class="biaoti">国家卫健委：昨日新增确诊36例，其中本土病例30例</div>
    //             <div
    //               class="neirong"
    //             >8月4日，据国家卫健委官网消息：8月3日0—24时，31个省（自治区、直辖市）和新疆生产建设兵团报告新增确诊病例36例，其中境外输入病例6例（广东4例，上海1例，四川1例），本土病例30例（新疆28例，辽宁2例）；无新增死亡病例；新增疑似病例1例，为境外输入病例......</div>
    //             <div style="height:30px">
    //               <span class="btn-size">来源：国家卫生健康委 2020.08.04 14:06</span>
    //               <span class="btn-box btn-size">查看详情 >></span>
    //             </div>
    //           </div>
    //         </div>
    //         <div class="top-root">
    //           <div>
    //             <span style="margin-right:10px; ">
    //               <img src="../../assets/images/lingwps.png" alt />
    //             </span>
    //             <span>国家卫健委：昨日新增确诊36例，其中本土病例30例</span>
    //           </div>
    //           <div class="el-icon-arrow-right"></div>
    //         </div>