<template>
  <div>
    <div class="sousuo">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="listQuery.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchList" size="mini">查询</el-button>
          <el-button type="warning" @click="handleResetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="my-Report">
      <el-table
      border
        :row-style="{height:'36px'}"
        :header-row-style="{height:'36px'}"
        :cell-style="{padding:'2px',}"
        :header-cell-style="{ background: '#3C82FE',color:'#FFFFFF',}"
        :data="myReport"
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="createDate" label="日期"></el-table-column>
        <el-table-column prop="toReportRealName" label="收件人"></el-table-column>
        <el-table-column prop="reportRealName" label="发件人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick1(scope.row)" type="text" size="small">编辑</el-button>
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
import { Message, MessageBox, Row } from "element-ui";
import { myReportDraft } from "@/api/personalDoor";
const defaultListQuery = {
  title: "",
  createDate: "",
  pageNum: 1,
  pageSize: 10,
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      myReport: [],
      total: null,
    };
  },
  methods: {

    newanonletters(row) {
      this.$router.push({ name: "newanonletter", query: {} });
    },

    handleClick1(row) {
      this.$router.push({ name: "bianjihuibao", query: { uId: row.uId } });
    },
    onSearchList() {
      this.initTable();
    },
    initTable() {
      this.listLoading = true;
      myReportDraft(this.listQuery)
        .then((response) => {
          this.myReport = response.datas.list;
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
  },
  created() {
    this.initTable();
  },
};
</script>

<style scoped>
.my-Report {
  width: 90%;
  height: 760px;
  border-radius: 10px 10px 0 0;
  margin: 0 auto;
  overflow: hidden;
}

.sousuo {
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
}
</style>


