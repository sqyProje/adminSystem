<template>
  <div class="app-container">
    <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="listQuery.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearchList"  size="small">查询</el-button>
        <el-button
          type="warning"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      size  = "small"
      border
    >
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="expand" label="摘要" align="center">
        <template slot-scope="scope">
          <div
            v-for="(item,index) in scope.row.tableFieldValueModels"
            :key="index">
            <div style="height: 24px;line-height: 24px">
              <el-link :underline="false">{{item.fieldName}}：</el-link>
              <el-link type="info" :underline="false">{{item.fieldValues}}</el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="表单名称" prop="approveName" align="center"></el-table-column>
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <el-button size="mini" round class='label-btn' :type="scope.row.approveStatus==20 ? 'warning' : 'success'">
            {{scope.row.approveStatus ? "审批中" :"带领任务"}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="审批创建时间" prop="approveCreateDate" align="center"></el-table-column>
      <el-table-column label="审批结束时间" prop="approveEndDate" align="center"></el-table-column>
      <el-table-column label="发起用户名" prop="startUserName" align="center"></el-table-column>
      <el-table-column label="审批人" prop="approveUserName" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right"  width="400" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="HandleWorkFlow(scope.row)">审批过程</el-button>

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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {InitCopyList} from '@/api/approve'
  const defaultListQuery = {
    name:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        rulesInfo: {
          approveStatus: [{required: true, trigger: 'blur', message: '请选择审批'}]
        }
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
        InitCopyList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
          .catch(error => {
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
      handleEdit(row) {
        this.$router.push({name:'my_approve_fields',query: {u_id: row.approveId}})
      },
      HandleWorkFlow(row){
        this.$router.push({name:'workflow',query: {u_id: row.approveId}})
      },
    }
  }

</script>

