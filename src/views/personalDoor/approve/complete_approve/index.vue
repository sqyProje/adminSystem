<template>
  <div class="app-container">
    <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="listQuery.startName" placeholder="发起人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.name" placeholder="表单名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.contentKey" placeholder="审批关键字"></el-input>
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
      class="basetreetable"
      :data="tableData"
      v-loading="listLoading"
      size  = "small"  max-height="600"
      default-expand-all
    >
      <el-table-column type="expand" label="摘要" align="center">
        <template slot-scope="scope">
          <div
            v-for="(item,index) in scope.row.tableFieldValueModels"
            :key="index">
            <div v-if="item.fieldType!=150 && item.fieldType!=160" style="height: 24px;line-height: 24px">
              <el-link :underline="false">{{item.fieldName}}：</el-link>
              <el-link type="info" :underline="false">{{item.fieldValues}}</el-link>
            </div>
            <div v-if="item.fieldType==150">
              <el-link :underline="false">{{item.fieldName}}：</el-link>
              <el-image v-for="(img,keys) in item.fieldValues.split(',')"
                        style="width: 100px; height: 100px"
                        :src="img"
                        :key="keys"
                        fit="cover"></el-image>
            </div>
            <div v-if="item.fieldType==160">
              <el-link :underline="false">{{item.fieldName}}：</el-link>
              <el-link type="info" :underline="false" v-for="(filetext,keys) in item.fieldValues.split(',')" :key="keys">
                {{filetext.substring(50,filetext.length)}}<span v-if="keys!= item.fieldValues.split(',').length-1">，</span></el-link>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="发起人" prop="startUserName" align="center"></el-table-column>
      <el-table-column label="表单名称" prop="approveName" align="center"></el-table-column>
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <div v-html=" $options.filters.formatState(scope.row.approveStatus)"></div>
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
            @click="handleSeek(scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="HandleWorkFlow(scope.row)">审批过程</el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.approveStatus==90"
            @click="HandlePrint(scope.row)">打印</el-button>
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
      :close-on-click-modal="false"      :show-close="false"
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
      if(this.$route.query.pageNum){
        this.listQuery.pageNum = this.$route.query.pageNum
      }
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
        InitCompleteList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
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
      handleApprove(row) {
        this.dialogVisible = !this.dialogVisible
        this.AddEditInfo.approveStepId = row.approveStepId
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
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
      handleSeek(row) {
        this.$router.push({name:'see',query: {u_id: row.approveId,pageNum:this.listQuery.pageNum, formName:'complete_approve'}})
      },
      HandleWorkFlow(row){
        this.$router.push({name:'workflow',query: {u_id: row.approveId,pageNum:this.listQuery.pageNum, formName:'complete_approve'}})
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
      },
      HandlePrint(row){
        this.$router.push({name:'print',query: {u_id: row.approveId,pageNum:this.listQuery.pageNum, formName:'complete_approve'}})
      }
    }
  }
</script>
