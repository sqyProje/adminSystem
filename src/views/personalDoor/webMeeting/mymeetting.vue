<template>
  <div>
    <div class="tittle">
      <b>我的会议</b>
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
        <el-form-item label="会议状态:">
          <el-select v-model="formInline.region" placeholder="全部">
            <el-option label="待参加" value="ToStayIn"></el-option>
            <el-option label="进行中" value="underway"></el-option>
            <el-option label="已结束" value="finished"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 会议信息 -->
    <div class="meeting-box">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column header-align="center"  prop="title" label="会议标题"></el-table-column>
        <el-table-column header-align="center"  prop="startdate" label="会议时间"></el-table-column>
        <el-table-column header-align="center"  prop="province" label="会议类型">
          <template slot-scope="scope">
              {{scope.row.meetingState ? "线上":"线下"}}
          </template>
        </el-table-column>
        <el-table-column header-align="center"  label="会议状态">
          <template slot-scope="scope">
                    <p v-if="scope.row.meetingState=='0'">未开始</p>
                    <p v-if="scope.row.meetingState=='1'">已开始</p>
                    <p v-if="scope.row.meetingState=='2'">进行中</p>
                </template>
        </el-table-column>
        <el-table-column header-align="center" prop="meetingroomname" label="地点"></el-table-column>
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
var myDate = new Date();
var mytime = myDate.toLocaleTimeString(); //获取当前时间
console.log(mytime);
import { MylistMemories } from "@/api/personalDoor";
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
      tableData: [],
    };
  },
  created() {
    MylistMemories().then((res) => {
      // console.log(res.datas.list);
      this.tableData = res.datas.list;
    });
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleClick(row) {
      // console.log(row.uId);
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
