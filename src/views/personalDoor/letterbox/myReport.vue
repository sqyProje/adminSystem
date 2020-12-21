<template>
  <div class="filter-container">
    <div class="sousuo">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item label="信件名称">
          <el-input v-model="listQuery.title" placeholder="信件关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchList" size="small">查询</el-button>
          <el-button type="warning" @click="handleResetSearch()" size="small">重置</el-button>
        </el-form-item>
        <el-button type="primary" size="small" @click="newanonletters" plain icon="el-icon-plus">去汇报</el-button>
        <el-link type="danger" size="mini" v-if="tuoqian.bool==true">已经拖欠{{tuoqian.days}}天!请及时进行工作汇报</el-link>
      </el-form>
    </div>
    <div class="my-Report">
      <el-table border :row-style="{height:'36px'}" :header-row-style="{height:'36px'}" :cell-style="{padding:'2px',}"
        :header-cell-style="{ background: '#3C82FE',color:'#FFFFFF',}" :data="myReport" style="width: 100%"  height="449">
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="createDate" label="日期"></el-table-column>
        <el-table-column prop="toReportRealName" label="收件人"></el-table-column>
        <el-table-column prop="reportRealName" label="发件人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handledetails(scope.row)" type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize" :page-sizes="[10,20,30]" :total="total"></el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
  import { Message, MessageBox, Row } from "element-ui";
  import { myReport, defaultReport } from "@/api/personalDoor";
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
        tuoqian: [],
      };
    },
    created() {
      this.initTable();
      defaultReport().then(res => {
        this.tuoqian = res.datas
      })
    },
    methods: {
      newanonletters(row) {
        this.$router.push({ name: "gohuibao", query: {} });
      },
      handledetails(row) {
        this.$router.push({ name: "detailsList", query: { uId: row.uId } });
      },
      onSearchList() {
        this.initTable();
      },
      initTable() {
        this.listLoading = true;
        myReport(this.listQuery)
          .then((response) => {
            this.myReport = response.datas.list;
            this.total = response.datas.total;
          })
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

  };
</script>

<style scoped>
  .my-Report {
    width: 90%;
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
