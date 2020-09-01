<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="操作的用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.postKey" placeholder="提交的数据"></el-input>
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
    </div>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      size  = "small"
      border
    >
      <el-table-column label="操作账户" prop="operUsername" width="150"></el-table-column>
      <el-table-column label="操作类型" prop="operType" width="100"></el-table-column>
      <el-table-column label="操作模块" prop="operModul"  width="100"></el-table-column>
      <el-table-column label="操作的方法" prop="operMethod"  width="400"></el-table-column>
      <el-table-column label="操作描述" prop="operDesc"></el-table-column>
      <el-table-column label="操作时间" prop="createDate"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.row)">查看详情</el-button>
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
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="查看详情"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible"
      width="33%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="100px"
      >
        <el-form-item label ='用户ID'>
          <el-input v-model="AddEditInfo.uId"></el-input>
        </el-form-item>
        <el-form-item label ='操作账户'>
          <el-input v-model="AddEditInfo.operUsername"></el-input>
        </el-form-item>
        <el-form-item label ='请求路径'>
          <el-input v-model="AddEditInfo.operUrl"></el-input>
        </el-form-item>
        <el-form-item label ='操作类型'>
          <el-input v-model="AddEditInfo.operType"></el-input>
        </el-form-item>
        <el-form-item label ='请求模块'>
          <el-input v-model="AddEditInfo.operModul"></el-input>
        </el-form-item>
        <el-form-item label ='操作的方法'>
          <el-input v-model="AddEditInfo.operMethod"></el-input>
        </el-form-item>
        <el-form-item label ='请求Ip'>
          <el-input v-model="AddEditInfo.operIp"></el-input>
        </el-form-item>
        <el-form-item label ='操作描述'>
          <el-input v-model="AddEditInfo.operDesc"></el-input>
        </el-form-item>
        <el-form-item label ='操作时间'>
          <el-input v-model="AddEditInfo.createDate"></el-input>
        </el-form-item>
        <el-form-item label ='请求参数'>
          <el-input type="textarea" v-model="AddEditInfo.operRequParam"></el-input>
        </el-form-item>
        <el-form-item label ='相应参数'>
          <el-input type="textarea" v-model="AddEditInfo.operRespParam"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">关   闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import {LogList,GetLog} from '@/api/basic'
  const defaultListQuery = {
    userName: '',
    postKey:'',
    pageNum:1,
    pageSize:10
  }
    export default {
      data(){
        return {
          listQuery: Object.assign({}, defaultListQuery),
          tableData:[],
          total: null,
          listLoading:false,
          dialogVisible: false,
          AddEditInfo:{}
        }
      },
      created(){
        this.initTable()
      },
      methods:{
        onSearchList() {
          this.initTable()
        },
        initTable() {
          this.listLoading = true
          LogList(this.listQuery).then(response => {
            this.listLoading = false
            this.tableData = response.datas.list
            this.total = response.datas.total
          })
        },
        handleResetSearch() {
          this.listQuery = Object.assign({}, defaultListQuery);
          initTable()
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
          this.dialogVisible = true
          this.dialogTitle = '编辑'
          GetLog(row.uId)
            .then(response => {
              this.AddEditInfo = response.datas
            })
            .catch( error => {
              console.log(error);
            });
        },
        canleDialog(){
          this.dialogVisible = false
          this.$refs.AddEditInfo.resetFields();
          Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        },
      }
    }

</script>
