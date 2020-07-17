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
          <!--<el-button
            size="mini"
            :type="scope.row.approveStatus==20 ? 'info' : 'warning'"
            @click="handlerFun(scope.row)"
          >
            {{scope.row.approveStatus ? "挂起" :"任务"}}
          </el-button>-->
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="HandleWorkFlow(scope.row)">审批过程</el-button>
          <!--<el-button
            size="mini"
            type="warning"
            @click="handleApprove(scope.row)"
          >去审批</el-button>-->
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
    <el-dialog
      title="审批"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="23%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="80px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label='审批' prop="approveStatus">
          <el-select v-model="AddEditInfo.approveStatus" placeholder="审批" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='批注'>
          <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button size="small" type="" @click="canleDialog">取 消</el-button>
            <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {InitCompleteList,ToApprove,GetTask,DisTask,HangUp,DisHangUp} from '@/api/approve'
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
        dialogVisible: false,
        stateData:[
          { id: 60, display_name: '拒绝'},
          { id: 70, display_name: '同意'}
        ],
        AddEditInfo:{
          approveStepId:'',
          approveStatus:'',
          sketch:''
        },
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
        InitCompleteList(this.listQuery).then(response => {
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
      handleApprove(row) {
        this.dialogVisible = !this.dialogVisible
        this.AddEditInfo.approveStepId = row.approveStepId
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          console.log( this.AddEditInfo)
          if (valid) {
            ToApprove(this.AddEditInfo).then(response => {
              if (response.status === 0) {
                this.dialogVisible = false
                this.initTable();
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }
            })
          }else{
            Message({
              message: '参数验证不合法',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      handleEdit(row) {
        this.$router.push({name:'my_approve_fields',query: {u_id: row.approveId}})
      },
      HandleWorkFlow(row){
        this.$router.push({name:'workflow',query: {u_id: row.approveId}})
      },
      handlerFun(row){
        if(row.approveStatus ===20){
          HangUp(row.approveStepId).then(res=>{
            Message({
              message: res.msg,
              type: 'error',
              duration: 3 * 1000
            })
          })
        }
      }
    }
  }

</script>

