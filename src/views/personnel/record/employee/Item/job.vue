<template>
  <div>
    <el-button
      type="success"
      size="small"
      @click="handleAdd"
      style="margin-bottom: 20px"
    >
      添加</el-button>
    <el-table
      :data="tableData"
      size  = "small"
      border
      style="width: 1100px">
      <el-table-column
        prop="company"
        label="工作公司"
        width="100">
      </el-table-column>
      <el-table-column
        prop="startdate"
        label="入职时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="enddate"
        label="离职时间">
      </el-table-column>
      <el-table-column
        prop="lowpay"
        label="最低收入">
      </el-table-column>
      <el-table-column
        prop="higpay"
        label="最高收入">
      </el-table-column>
      <el-table-column
        prop="createdate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updatedate"
        label="更新时间">
      </el-table-column>
      <el-table-column label="操作" fixed="right"  width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
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
        <el-form-item label ='工作公司' prop="company">
          <el-input v-model="AddEditInfo.company"></el-input>
        </el-form-item>
        <el-form-item label ='入职时间' prop="startdate">
          <el-date-picker type="date" v-model="AddEditInfo.startdate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label ='离职时间' prop="enddate">
          <el-date-picker type="date" v-model="AddEditInfo.enddate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label ='最低收入' prop="lowpay">
          <el-input v-model="AddEditInfo.lowpay"></el-input>
        </el-form-item>
        <el-form-item label ='最高收入' prop="higpay">
          <el-input v-model="AddEditInfo.higpay"></el-input>
        </el-form-item>
        <el-form-item label ='工作内容' prop="jobcontent">
          <el-input type="textarea" v-model="AddEditInfo.jobcontent"></el-input>
        </el-form-item>
        <el-form-item label ='工作表现' prop="jobcase">
          <el-input type="textarea" v-model="AddEditInfo.jobcase"></el-input>
        </el-form-item>

        <el-form-item label='状态' prop="state">
          <el-select v-model="AddEditInfo.state" placeholder="状态" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}</el-option>
          </el-select>
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
  import {JobList,AddJob,GetJob,EditJob,DeleteJob} from '@/api/personnel'
  export default {
    data(){
      return{
        tableData:[],
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          employeeid:'',
          company:'',
          startdate:'',
          enddate:'',
          jobcontent:'',
          lowpay:'',
          higpay:'',
          jobcase:'',
          state:''
        },
        stateData:[
          { id: 0, display_name: '启用'},
          { id: 1, display_name: '禁用'}
        ],
        rulesInfo: {
          company: [{ required: true,trigger: 'blur',message: '请输入工作公司'}],
          startdate: [{ required: true,trigger: 'blur',message: '请输入入职时间'}],
          enddate:[{ required: true,trigger: 'blur',message: '请输入离职时间'}],
          jobcontent: [{ required: true,trigger: 'blur',message: '请输入工作内容'}],
          lowpay:[{required: true, trigger: 'blur', message: '请输入最低收入'}],
          higpay:[{required: true, trigger: 'blur', message: '请输入最高收入'}],
          jobcase:[{required: true, trigger: 'blur', message: '请输入工作表现'}],
          state:[{required: true, trigger: 'blur', message: '请选择状态'}],
        }
      }
    },
    mounted(){
      this.initList(this.$route.query.uId)
    },
    methods:{
      initList(uId){
        JobList(uId).then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      },
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.state=0
        this.AddEditInfo.employeeid=this.$route.query.uId
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetJob(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddJob(this.AddEditInfo)
                .then(response => {
                  this.dialogVisible = false
                  if (response.status === 0) {
                    this.initList(this.$route.query.uId);
                    Message({
                      message: response.msg,
                      type: 'success',
                      duration: 3 * 1000
                    })
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              EditJob(this.AddEditInfo).then(response => {
                if (response.status === 0) {
                  this.dialogVisible = false
                  this.initList(this.$route.query.uId);
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                }
              })
                .catch(error => {
                  console.log(error);
                });
            }
          }else{
            Message({
              message: '参数验证不合法',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleDelete(row) {
        MessageBox.confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          DeleteJob(row.uId)
            .then(response => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              this.initList(this.$route.query.uId);
            })
            .catch(error=>{console.log(error)})
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      }
    }
  }

</script>

<style>

</style>
