<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      v-loading="listLoading"
      size  = "small"
      border
    >
      <el-table-column type="expand" label="摘要" align="center">
        <template slot-scope="scope">
          <div
            v-for="(item,index) in scope.row.defaultReportUserModels"
            :key="index" v-if="item.bool">
            <div style="height: 24px;line-height: 24px">
              <el-link :underline="false">拖欠人：</el-link>
              <el-link type="info" :underline="false">{{item.realName}}</el-link>&nbsp;&nbsp;&nbsp;&nbsp;
              <el-link :underline="false">拖欠天数：</el-link>
              <el-link type="info" :underline="false">{{item.days}}</el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="汇报周期名称" prop="name" align="center"></el-table-column>
      <el-table-column label="汇报周期（天）" prop="reportdays" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script type="text/ecmascript-6">
  import {OweReportList} from '@/api/address'
  export default {
    data(){
      return {
        listLoading:false,
        tableData:[],
      }
    },
    created(){
      this.initTable();
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        OweReportList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      }

    }
  }

</script>

