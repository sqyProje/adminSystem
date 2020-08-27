<template>
  <div>
    <!-- 匿名信 -->
    <div class="sousuo">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item label="主题名称">
          <el-input v-model="listQuery.title" placeholder="主题关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchList" size="mini">查询</el-button>
          <el-button type="warning" @click="handleResetSearch()" size="small">重置</el-button>
        </el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="newanonletters"
          plain
          icon="el-icon-plus"
        >发起新的匿名信</el-button>
      </el-form>
    </div>
    <div class="my-Report">
      <el-table
      border
        :row-style="{height:'40px'}"
        :header-row-style="{height:'40px'}"
        :cell-style="{padding:'1px'}"
        :header-cell-style="{ background: '#3C82FE',color:'#FFFFFF',}"
        :data="myReport"
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="createdate" label="日期"></el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick1(scope.row)" type="text" size="small">打开</el-button>
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
import {
  ToReport,
  DraftEditor,
  ReportList,
  myLetter,
} from "@/api/personalDoor";
const defaultListQuery = {
  title: "",
  createdate: "",
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
    //新的匿名信
    newanonletters(row) {
      this.$router.push({ name: "newanonletter", query: {} });
    },
    // 打开匿名信详情
    handleClick1(row) {
      this.$router.push({ name: "anonletterDetails", query: { uId: row.uId } });
    },
    onSearchList() {
      this.initTable();
    },
    initTable() {
      this.listLoading = true;
      myLetter(this.listQuery)
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

el-table {
  border-radius: 25px;
}
</style>


