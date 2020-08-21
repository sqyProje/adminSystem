<template>
  <div>
    <div class="tittle">
      <b>待参加的会议</b>
    </div>
    <!-- 查询 -->
    <div class="chaxun-box">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="会议类型:">
          <el-select v-model="formInline.user" placeholder="全部">
            <el-option label="线上会议" value="xianshang"></el-option>
            <el-option label="线下会议" value="xianxia"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 会议信息 -->
    <div class="meeting-box">
      <el-table :data="tableData1" border style="width: 100%">
        <el-table-column header-align="center" fixed prop="title" label="会议标题"></el-table-column>
        <el-table-column header-align="center"  prop="publishdate" label="会议时间"></el-table-column>
        <el-table-column header-align="center"  prop="tableData" label="会议类型"></el-table-column>
         <el-table-column header-align="center"  prop="sponsor" label="发起人"></el-table-column>
        <el-table-column header-align="center"  prop="meetingroomname" label="地点"></el-table-column>
        <el-table-column width="200"  label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="mini" round>查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { ToAttendMeeting } from "@/api/personalDoor";
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
      tableData1: [],
    };
  },
  created() {
    ToAttendMeeting().then((res) => {
      // console.log(res.datas.list);
      this.tableData1 = res.datas.list;
    });
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleClick(row) {
      this.$router.push({name:'AboutICCCAS',query: {uId:row.uId}})
    },
  },
};
</script>
<style>
.meeting-box {
  width: 94%;
  margin-left: 3%;
}
.tittle {
  padding: 10px;
  border-bottom: 1px solid #cccccc;
}
.chaxun-box {
  padding-left: 50px;
  padding-top: 20px;
}
</style>

