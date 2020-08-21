<template>
  <div>
    <!-- 我汇报的 -->
    <div class="my-Report">
      <el-button type="primary" @click="newanonletters" v-if="tuoqian.bool==false" plain icon="el-icon-plus">去汇报</el-button>
      <el-button type="primary" @click="newanonletters" v-if="tuoqian.bool==true" plain icon="el-icon-plus">去汇报!已经拖欠{{tuoqian.days}}天</el-button>
      <div class="ToReport-title">我汇报的</div>
      <el-table :data="myReport" style="width: 100%">
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
import {myReport,defaultReport} from '@/api/personalDoor'
export default {
  data() {
    return {
      tuoqian:[],
      myReport: [],
    };
  },
  created(){
    myReport().then(res=>{
      this.myReport=res.datas.list
    }),
    defaultReport().then(res=>{
        this.tuoqian=res.datas
    })
  },
  methods: {
    // 草稿箱
    handleClick1(row) {
      this.$router.push({name:'bianjihuibao',query: {uId:row.uId}})
    },
    newanonletters(){
      this.$router.push({name:'gohuibao',query: {}})
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


