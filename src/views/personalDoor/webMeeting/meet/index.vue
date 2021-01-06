<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchList" size="small">查询</el-button>
          <el-button
            type="warning"
            @click="handleResetSearch()"
            size="small">
            重置
          </el-button>
          <el-button
            type="success"
            @click="handleback()"
            size="small">
            返回
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="basetreetable"
        :data="tableData"
        v-loading="listLoading"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="发起人" prop="compereName"></el-table-column>
        <el-table-column label="审核人" prop="approveManName"></el-table-column>
        <el-table-column label="复核人" prop="approveEndManName"></el-table-column>
        <el-table-column label="创建时间" prop="meeting_CreateDate"></el-table-column>
        <el-table-column label="更新时间" prop="meeting_EndDate"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              v-if="!scope.row.submit"
              @click="handleAdd(scope.row)">添加</el-button>
              <el-button
              size="mini"
              type="warning"
               v-if="scope.row.submit"
              @click="handleEdit(scope.row)">详情</el-button>
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
      :title="dialogTitle"
      :close-on-click-modal="false"   
      :show-close="false"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="80px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-row  v-if="dialogTitle!=='添加'">
          <el-form-item label ='会议标题'>
           <el-input v-model="AddEditInfo.title"></el-input>
          </el-form-item>
          <el-form-item label ='会议类型'>
            <el-input v-model="AddEditInfo.typeName"></el-input>
          </el-form-item> 
          <el-form-item label ='创建时间'>
            <el-input v-model="AddEditInfo.createDate"></el-input>
          </el-form-item>
          <el-form-item label ='审批流程'>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in AddEditInfo.meetingApproveModels"
                :key="index"
                :timestamp="activity.createDate">
                {{activity.realName}} {{activity.idea}}
                <template>
                  <span style="display:inline-block;margin-left:10px">
                    <el-button type="warning" class='label-btn' size="mini" v-if="activity.submit==0">未审批</el-button>
                    <el-button type="success" class='label-btn' size="mini" v-else-if="activity.submit==1">同意</el-button>
                    <el-button type="danger" class='label-btn' size="mini" v-else-if="activity.submit==2">拒绝</el-button>
                    <el-button type="primary" class='label-btn' size="mini" v-else-if="activity.submit==3">待审批</el-button>
                  </span>
                </template>
              </el-timeline-item>
            </el-timeline>
          </el-form-item>
        </el-row>
        <el-form-item label ='会议纪要' prop="summary">
          <Editor :curValue="AddEditInfo.summary" v-if="dialogVisible" @input="newContent"></Editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">{{dialogTitle=='添加'?'取 消':'关 闭'}}</el-button>
          <el-button size="small" type="primary" @click="UpdateUser" v-if="dialogTitle=='添加'">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {HostList,HostAdd,HostEdit} from '@/api/personalDoor'
  import Editor from '@/components/Tinymce/Editor'
  const defaultListQuery = {
    title: '',
    startDate:'',
    endDate:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listLoading:true,
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          uId:'',
          summary:'',
        },
        rulesInfo: {
          summary: [{ required: true,trigger: 'blur',message: '请输入会议纪要'}],
        },
        selectedData:[]
      }
    } ,
    created(){
      this.initTable();
    },
    components:{Editor},
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        HostList(this.listQuery).then(response => {
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
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.AddEditInfo.uId=row.uId
        this.dialogTitle = '添加'
	  },
	  handleEdit(row){
       this.dialogTitle = '详情'
      this.dialogVisible = !this.dialogVisible
      HostEdit(row.uId).then(res=>{
        this.AddEditInfo= res.datas
      })  
	  },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
			HostAdd(this.AddEditInfo)
				.then(response => {
				this.dialogVisible = false
				if (response.status === 0) {
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
      },
      handleback(){
          this.$router.push({ name: "webMyMeeting"});
      },
       newContent(val){
        this.AddEditInfo.summary= val
      }
     
    }
  }

</script>
<style scoped lang="scss">

</style>


