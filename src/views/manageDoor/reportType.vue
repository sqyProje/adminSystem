<template>
  <div class="app-container">
    <div class="filter-container">
        <el-col style="margin-bottom: 10px">
            <el-button
              type="success"
              size="small"
              @click="handleAdd">
              添加</el-button>
        </el-col>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        size  = "small"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="背景色" prop="colour"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" alt="" width="36" height="30">
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
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
        <el-form-item label ='封面'  prop="picUrl">
          <singleUpload  v-model="AddEditInfo.picUrl" @input="picFun"></singleUpload>
        </el-form-item>
        <el-form-item label ='名称'  prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='背景色'  prop="colour">
          <el-input v-model="AddEditInfo.colour"></el-input>
        </el-form-item>
        <el-form-item label ='报表路径'  prop="reqUrl">
          <el-input v-model="AddEditInfo.reqUrl"></el-input>
        </el-form-item>
        <el-form-item label ='排序'  prop="sort">
          <el-input v-model="AddEditInfo.sort"></el-input>
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
  import {ReportList,ReportAdd,GetReport,EditReport,DeleteReport} from '@/api/news-metting'
  import singleUpload from '@/components/Upload/singleImg'

  export default {
    data(){
      return {
        tableData:[],
        total: null,
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          uId:'',
          picUrl:'',
          name:'',
          colour:'',
          reqUrl:'',
          sort:'',
        },
        rulesInfo: {
          picpath: [{ required: true,trigger: 'blur',message: '请上传图片'}],
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          colour: [{ required: true,trigger: 'blur',message: '请输入背景色'}],
          reqUrl: [{ required: true,trigger: 'blur',message: '请报表路径'}],
          sort: [{ required: true,trigger: 'blur',message: '请输入排序'}]
        }
      }
    } ,
    components:{
      singleUpload
    },
    created(){
      this.initTable();
    },
    methods: {
      picFun(data){
        this.AddEditInfo.picpath = data
      },
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        ReportList().then(response => {
          this.listLoading = false
          this.tableData = response.datas
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
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.isstick=0
        this.AddEditInfo.state=0
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetReport(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              ReportAdd(this.AddEditInfo)
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
                .catch(error => {
                  console.log(error);
                });
            } else {
              EditReport(this.AddEditInfo).then(response => {
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
          DeleteReport(row.uId)
            .then(response => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              this.initTable()
            })
            .catch(error=>{console.log(error)})
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      handleState(row){
        MessageBox.confirm('此操作将修改状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          StateNews(row.uId)
            .then(response => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              this.initTable()
            })
            .catch(error=>{console.log(error)})
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消修改状态'
          });
        });
      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      newContent(val){
        console.log(val)
        this.AddEditInfo.content= val
      }
    }
  }

</script>


