
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.is_new" placeholder="是否最新流程" style="width: 100%;">
            <el-option
              v-for="item in isNewData"
              :label="item.name"
              :value="item.id"
              :key = "item.id"
            ></el-option>
          </el-select>
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
        row-key="uId"
        size  = "small"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="描述" prop="sketch"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('act_deploy:view')"
              @click="handleEdit(scope.row)">查看</el-button>
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
    <el-dialog
      title="查看"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="40%">
      <img :src="srcImg" style="width: 100%;">
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {dictionType} from '@/api/basic'
  import {InitDeployList,GetDeployInfo} from '@/api/activiti'
  const defaultListQuery = {
    name:'',
    is_new:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        dialogTitle:'',
        dialogVisible:false,
        isNewData:[
          { id: true, name:'是' },
          { id: false, name:'否'}
          ],
        srcImg:""
      }
    } ,
    created(){
      this.initTable();
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitDeployList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.processDefinitionModels
          this.total = response.datas.total
        })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.initTable()
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
        this.dialogTitle='设计'
        this.dialogVisible=true
        GetDeployInfo(row.deployId)
          .then(response=>{
            this.srcImg = 'http://192.168.1.7:8088/'+ response.datas
          })
      },
      canleDialog(){
        this.dialogVisible=false
        this.AddEditInfo = {}
        this.srcImg=''
      }

    }
  }

</script>
<style>
  .el-dialog.is-fullscreen .el-dialog__header{
    padding-bottom: 0;
    background-color: #cccccc;
  }
  .el-dialog.is-fullscreen .el-dialog__body{
    height: calc(100% - 44px - 62px);
    padding:0;
  }
</style>
