<template>
  <div>
    <div class="tittle">
      <b>会议详情</b>&nbsp;&nbsp;&nbsp;<el-button @click="backtrack" type="warning" plain size="mini">返回</el-button>
    </div>
    <div class="content-box" :model="tableData" ref="tableData">
      <div class="font-color">
        会议标题：
        <span>{{tableData.title}}</span>
      </div>
      <div class="font-color">
        会议室名称：
        <span>{{tableData.meetingroomname}}</span>
      </div>
      <div class="font-color">
        开始时间：
        <span>{{tableData.startdate}}</span>
      </div>
      <div class="font-color">
        结束时间：
        <span>{{tableData.enddate}}</span>
      </div>
      <div class="font-color">
        发布时间：
        <span>{{tableData.publishdate}}</span>
      </div>
      <div>
        <div class="font-color">参会人员：</div>
        <div class="renyuan-yangshi">
          <div class="name-size" v-for="(item,i) in name" :key="i">{{item.userRealName}}</div>
        </div>
      </div>
      <div class="font-color">会议介绍：</div>
          <div v-html="tableData.content"></div>

    </div>
  </div>
</template>
<script>
import { MylistMemoriesList } from "@/api/personalDoor";

export default {

  data() {
    return {
      tableData: {},
      name: [],
    };
  },
  created() {},
  mounted() {
    this.MyList(this.$route.query.uId);
  },
  methods: {

    backtrack(){
       this.$router.back(-1)
    },
    MyList(uId) {
      MylistMemoriesList(uId).then((res) => {
        this.tableData = res.datas.meeting;
        this.name = res.datas.meeting_user;
      });
    },
  },
};
</script>
<style scoped>
.tittle {
  padding: 10px;
  border-bottom: 1px solid #cccccc;
}
.content-box {
  margin: 30px 0 100px 100px;
}
.font-color {
  color: #00a0e9;
  font-size: 15px;
  margin: 18px 0 0px 0;
}
.renyuan-yangshi {
  display: flex;
  flex-wrap: wrap;
  /* width: 800px; */
}
.name-size {
  color: aliceblue;
  background: #4287c7;
  border-radius: 3px;
  padding: 3px;
  margin: 10px 5px 0;
}
span {
  color: rgba(77, 77, 77, 1);
  font-size: 18px;
}
.huiyi-content {
  display: inline-block;
  width: 500px;
  height: 200px;
  line-height: 30px;
}
.fuwenbenbianji {
  margin-right: 100px;
  width: 700px;
  height: 200px;
}


</style>

