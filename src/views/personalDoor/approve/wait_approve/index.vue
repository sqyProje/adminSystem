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
          <!--撤销10   任务50  待领任务55  挂起40   审批中20-->
          <template slot-scope="scope">
            <div v-html=" $options.filters.formatState(scope.row.approveStepStatus)"></div>
          <!--  <el-button size="mini" round style="padding: 5px 12px;">{{scope.row.approveStepStatus | formatState}}</el-button>-->
          </template>
        </el-table-column>
      <el-table-column label="审批状态" align="center">
        <!--完成审批90   同意70  拒绝60  撤销10   审批中20-->
        <template slot-scope="scope">
          <div v-html=" $options.filters.formatState(scope.row.approveStatus)"></div>
          <!--<el-button size="mini" round style="padding: 5px 12px;">{{scope.row.approveStatus | formatState}}</el-button>-->
        </template>
      </el-table-column>
        <el-table-column label="审批创建时间" prop="approveCreateDate" align="center"></el-table-column>
        <el-table-column label="审批结束时间" prop="approveEndDate" align="center"></el-table-column>
        <el-table-column label="发起用户名" prop="startUserName" align="center"></el-table-column>
        <el-table-column label="审批人" prop="approveUserName" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="460" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.approveStepStatus==40"
              type="info"
              @click="handlerFun(scope.row)"
            >去除挂起</el-button>
            <el-button
              size="mini"
              v-if="scope.row.approveStepStatus == 20 || scope.row.approveStepStatus == 25"
              type="warning"
              @click="handlerFun(scope.row)"
            >挂起</el-button>
            <el-button
              size="mini"
              v-if="scope.row.approveStepStatus==55"
              type="info"
              @click="handleraaFun(scope.row)"
            >拿取任务</el-button>
            <el-button
              size="mini"
              v-if="scope.row.approveStepStatus == 20 || scope.row.approveStepStatus == 25"
              type="warning"
              @click="handleraaFun(scope.row)"
            >释放任务</el-button>
            <el-button
              size="mini"
              type="success"
              v-if="scope.row.approveStepStatus == 20 || scope.row.approveStepStatus == 25"
              @click="handleEdit(scope.row)">审批</el-button>
            <el-button
              size="mini"
              type="success"
              @click="handleSeek(scope.row)">查看</el-button>
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
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #c53535; padding: 5px 12px;'>撤销</el-button>"
        }else if(value===20){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #FF9900; padding: 5px 12px;'>审批中</el-button>"
        }else if(value===25){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #909399; padding: 5px 12px;'>任务审批中</el-button>"
        }else if(value===30){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #32f50a; padding: 5px 12px;'>待批</el-button>"
        }else if(value===40){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #193dc2; padding: 5px 12px;'>挂起</el-button>"
        }else if(value===50){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #8156c2; padding: 5px 12px;'>任务</el-button>"
        }else if(value===55){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #8156c2; padding: 5px 12px;'>待领任务</el-button>"
        }else if(value===60){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #c199c2; padding: 5px 12px;'>拒绝</el-button>"
        }else if(value===70){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #c2077a; padding: 5px 12px;'>同意</el-button>"
        }else if(value===80){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #193dc2; padding: 5px 12px;'>抄送</el-button>"
        }else if(value===90){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: rgba(194,75,77,0.67); padding: 5px 12px;'>完成审批</el-button>"
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
        this.$router.push({name:'my_approve_fields',query: {u_id: row.approveId,approveStepId:row.approveStepId}})
      },
      handleSeek(row){
        this.$router.push({name:'see',query: {u_id: row.approveId}})

      },
      HandleWorkFlow(row){
        this.$router.push({name:'workflow',query: {u_id: row.approveId}})
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
        }else if(row.approveStepStatus ===20){
          HangUp(row.approveStepId).then(res=>{
            this.initTable();
            Message({
              message: res.msg,
              type: 'success',
              duration: 3 * 1000
            })
          })
        }
      },
      handleraaFun(row){
        if(row.approveStepStatus ===55){
          GetTask(row.approveStepId).then(res=>{
            this.initTable();
            Message({
              message: res.msg,
              type: 'success',
              duration: 3 * 1000
            })
          })
        }else if(row.approveStepStatus ===25){
          DisTask(row.approveStepId).then(res=>{
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

