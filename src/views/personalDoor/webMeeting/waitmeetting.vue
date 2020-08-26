<template>
  <div class="app-container">
    
    <!-- 查询 -->
    <div class="filter-container">
      <el-form size="mini" :inline="true" :model="formInline" class="demo-form-inline">
         <el-form-item label="主题名称">
          <el-input v-model="listQuery.title" placeholder="主题关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 会议信息 -->
    <div class="meeting-box">
      <el-table
        :data="tableData1"
        v-loading="listLoading"
        row-key="uId"
        :tree-props="{children:'childMenu',hasChildren:'hasChildren'}"
        size="small"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="会议标题"></el-table-column>
        <el-table-column prop="publishdate" label="会议时间"></el-table-column>
        <el-table-column prop="tableData1" label="会议类型">
          <template slot-scope="scope">{{scope.row.meetingState ? "线上会议":"线下会议"}}</template>
        </el-table-column>
        <el-table-column prop="sponsor" label="发起人"></el-table-column>
        <el-table-column prop="meetingroomname" label="地点"></el-table-column>
        <el-table-column label="操作" width="260">
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
<script>
import { Message, MessageBox } from "element-ui";
import { ToAttendMeeting } from "@/api/personalDoor";
const defaultListQuery = {
  title: "",
  sketch: "",
  pageNum: 1,
  pageSize: 10,
};
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
      tableData1: [],
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      dialogTitle: "",
      dialogVisible: false,
      AddEditInfo: {
        uId: "",
        name: "",
        sketch: "",
        state: "",
      },
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
      ToAttendMeeting(this.listQuery)
        .then((response) => {
          this.listLoading = false;
          this.tableData1 = response.datas.list;
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
    handleClick(row){
 this.$router.push({ name: "AboutICCCAS", query: { uId: row.uId } });
    }
  },
  
};
</script>
<style scoped>
.tittle {
  padding: 5px;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
}
</style>

