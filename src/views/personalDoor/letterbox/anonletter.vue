<template>
  <div>
    <!-- 我汇报的 -->
    <div class="sousuo">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="活动时间">
          <el-col>
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="formInline.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="审批人">
          <el-input v-model="formInline.title1" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-button type="primary" @click="newanonletters" plain icon="el-icon-plus">发起新的匿名信</el-button>
      </el-form>
    </div>
    <div class="my-Report">
      
      <el-table  :data="myReport" style="width: 100%">
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="createdate" label="日期"></el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick1(scope.row)" type="text" size="small">打开</el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small"
              style="color:red"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bom-box">河南健康奇点网络科技有限公司©All Rights Reserved.</div>
  </div>
</template>
<script>
import { Message, MessageBox, Row } from "element-ui";
import {ToReport,DraftEditor,ReportList,myLetter} from '@/api/personalDoor'
export default {
  data() {
    return {
      formInline: {
        title1: "",
        date1: "",
      },
      myReport: [
      ],
    };
  },
  methods: {
    //新的匿名信
    newanonletters(row) {
      this.$router.push({ name: "newanonletter", query: {} });
    },
    // 打开匿名信详情
    handleClick1(row){
      this.$router.push({ name: "anonletterDetails", query: {uId:row.uId} });
    },
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    
  },
  created(){
     myLetter().then(res=>{
      this.myReport = res.datas.list
    })
  }
};
</script>

<style scoped>


.my-Report {
  width: 80%;
  height: 760px;
  border: 5px solid #f5f5f5;
  border-radius: 5px 5px 0px 0px;
  margin: 0 auto;
}
.el-table .warning-row {
  background: #dde5f2;
}
.sousuo {
  width: 80%;
  margin: 0 auto;
  margin-top: 10px;
}
.bom-box {
  text-align: center;
  font-size: 12px;
  height: 50px;
  line-height: 50px;
  background-color: #f5f5f5;
}
</style>


