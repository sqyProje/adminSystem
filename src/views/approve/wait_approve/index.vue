<template>
  <div class="app-container">
    <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="listQuery.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.approvestatus" placeholder="审批状态">
          <el-option value="20" label="审批中">审批中</el-option>
          <el-option value="55" label="代领任务">代领任务</el-option>
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
        <el-table-column label="当前状态" align="center">
          <!--撤销10   任务50  代领任务55  挂起40   审批中20-->
          <template slot-scope="scope">
            <el-button size="mini" round style="padding: 5px 12px;">{{scope.row.approveStepStatus | formatState}}</el-button>
          </template>
        </el-table-column>
      <el-table-column label="审批状态" align="center">
        <!--完成审批90   同意70  拒绝60  撤销10   审批中20-->
        <template slot-scope="scope">
          <el-button size="mini" round style="padding: 5px 12px;">{{scope.row.approveStatus | formatState}}</el-button>
        </template>
      </el-table-column>
        <el-table-column label="审批创建时间" prop="approveStartDate" align="center"></el-table-column>
        <el-table-column label="审批结束时间" prop="approveEndDate" align="center"></el-table-column>
        <el-table-column label="发起用户名" prop="startUserName" align="center"></el-table-column>
        <el-table-column label="审批人" prop="approveUserName" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="400" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.approveStepStatus==40"
              type="info"
              @click="handlerFun(scope.row)"
            >去除挂起</el-button>
            <el-button
              size="mini"
              v-if="scope.row.approveStepStatus==20"
              type="warning"
              @click="handlerFun(scope.row)"
            >挂起</el-button>
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
  import {InitWaitList,ToApprove,GetTask,DisTask,HangUp,DisHangUp} from '@/api/approve'
  const defaultListQuery = {
    name:'',
    approveStatus:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
      }
    },
    created(){
      this.initTable();
    },
    filters:{
      formatState(value){
        if(value===10){
          return '草稿'
        }else if(value===20){
          return '审批中'
        }else if(value===30){
          return '待批'
        }else if(value===40){
          return '挂起'
        }else if(value===50){
          return '任务'
        }else if(value===55){
          return '代领任务'
        }else if(value===60){
          return '拒绝'
        }else if(value===70){
          return '同意'
        }else if(value===80){
          return '抄送'
        }else if(value===90){
          return '完成审批'
        }
      }
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitWaitList(this.listQuery).then(response => {
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
      handleEdit(row) {
        this.$router.push({name:'my_approve_fields',query: {u_id: row.approveId,approveStepId:row.approveStepId,approve:'approve'}})
      },
      HandleWorkFlow(row){
        this.$router.push({name:'workflow',query: {u_id: row.approveId,approve:'approve',}})
      },
      handlerFun(row){
        if(row.approveStepStatus ===40){
          DisHangUp(row.approveStepId).then(res=>{
            this.initTable();
            Message({
              message: res.msg,
              type: 'success',
              duration: 3 * 1000
            })
          })
        }else{
          HangUp(row.approveStepId).then(res=>{
            this.initTable();
            Message({
              message: res.msg,
              type: 'success',
              duration: 3 * 1000
            })
          })
        }
      }
    }
  }

</script>

