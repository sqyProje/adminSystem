<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item label="会议标题">
          <el-input v-model="listQuery.title" placeholder="会议关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
          <el-button type="warning" @click="handleResetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 会议信息 -->
      <el-table
        :data="tableData"
        v-loading="listLoading"
        row-key="uId"
        :tree-props="{children:'childMenu',hasChildren:'hasChildren'}"
        size="small"
       
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="会议标题" prop="title"></el-table-column>
        <el-table-column label="会议时间" prop="startdate"></el-table-column>
        <el-table-column prop="meetingroomname" label="会议室"></el-table-column>
        <el-table-column label="会议状态">
          <template slot-scope="scope">
            <div class="focus-two" v-if="scope.row.meetingState=='2'">进行中</div>
            <div class="focus-zero" v-if="scope.row.meetingState=='0'">已参加</div>
            <div class="focus-one" v-if="scope.row.meetingState=='1'">待参加</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="260">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[10,20,30]"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { Message, MessageBox } from "element-ui";

import { MylistMemories } from "@/api/personalDoor";
const defaultListQuery = {
  title: "",
  pageNum: 1,
  pageSize: 10,
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
    };
  },
  created() {
    this.initTable();
  },
  methods: {
    onSubmit() {
      this.initTable();
    },
    initTable() {
      this.listLoading = true;

      MylistMemories(this.listQuery)
        .then((response) => {
          this.listLoading = false;
          this.tableData = response.datas.list;
          this.total = response.datas.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.initTable();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.initTable();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.initTable();
    },
    handleClick(row) {
      this.$router.push({ name: "AboutICCCAS", query: { uId: row.uId } });
    },
  },
};
</script>
  <style  scoped>
.tittle {
  padding: 5px;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
}
.focus-two {
  width: 60px;
  text-align: center;
  background: rgba(50, 177, 109, 1);
  border-radius: 5px;
   color: #ffffff;
}
.focus-zero {
  width: 60px;
  background: rgba(204, 204, 204, 1);
  border-radius: 5px;
  text-align: center;
   color: #ffffff;
}
.focus-one {
  width: 60px;
  background:rgba(253,150,2,1);
  border-radius: 5px;
  text-align: center;
  color: #ffffff;
}
</style>