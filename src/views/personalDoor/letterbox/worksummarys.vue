<template>
  <div>
    <div class="my-Report">
      <div class="ToReport-title">汇报给我的</div>
      <el-table  :data="myReport" style="width: 100%">
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="createDate" label="日期"></el-table-column>
        <el-table-column prop="toReportRealName" label="收件人"></el-table-column>
        <el-table-column prop="reportRealName" label="发件人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick1(scope.row)" type="text" size="small">打开</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { Message, MessageBox } from "element-ui";
import {reportMe} from '@/api/personalDoor'
export default {
  data() {
    return {
      myReport: [],
    };
  },
  created(){
    reportMe().then(res=>{
      this.myReport= res.datas.list
    })
  },
  methods: {
    handleClick1(){
      this.$router.push({name:'bianjihuibao',query: {uId:row.uId}})
    }
  },
};
</script>

<style scoped>

.my-Report {
  width: 100%;
  height: 800px;
  border: 5px solid #f5f5f5;
  border-radius: 5px 5px 0px 0px;
}
.el-table .warning-row {
  background: #dde5f2;
}
.ToReport-title {
  height: 30px;
  line-height: 30px;
  color: #ffffff;
  padding-left: 20px;
  background-color: #3c82fe;
  margin-bottom: 10px;
  border-radius: 5px 5px 0px 0px;
}
</style>


