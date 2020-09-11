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
      size  = "small"  max-height="600"
      border
      style="width: 1100px">
      <el-table-column
        prop="name"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="relation"
        label="关系"
        width="100">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="work"
        label="工作">
      </el-table-column>
      <!--<el-table-column
        prop="workPhone"
        label="单位电话">
      </el-table-column>-->
      <el-table-column
        prop="nowaddress"
        label="现住址">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序">
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
        <el-form-item label ='姓名'  prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='关系' prop="relation">
          <el-input v-model="AddEditInfo.relation"></el-input>
        </el-form-item>
        <el-form-item label ='联系方式' prop="phone">
          <el-input v-model="AddEditInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label ='工作'>
          <el-input v-model="AddEditInfo.work"></el-input>
        </el-form-item>
        <el-form-item label ='单位电话'>
          <el-input v-model="AddEditInfo.workPhone"></el-input>
        </el-form-item>
        <el-form-item label ='排序' prop="sort">
          <el-input type="number" :min="0" v-model="AddEditInfo.sort"></el-input>
        </el-form-item>
        <el-form-item label ='现住址' prop="nowaddress">
          <el-input type="textarea" v-model="AddEditInfo.nowaddress"></el-input>
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
  import {validmobile} from '@/utils/validate'
  import {FamilyList,AddFamily,GetFamily,EditFamily,DeleteFamily} from '@/api/personnel'
  export default {
    data(){
      const checkphone = (rule, value, callback) => {
        if (!validmobile(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      };
      return{
        tableData:[],
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          employeeid:'',
          name:'',
          relation:'',
          phone:'',
          work:'',
          nowaddress:'',
        },
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入姓名'}],
          relation: [{ required: true,trigger: 'blur',message: '请输入关系'}],
          phone:[{required: true, trigger: 'blur',validator:checkphone,message: '请输入合法手机号'}],
          sort: [{ required: true,trigger: 'blur',message: '请输入排序'}],
          nowaddress:[{required: true, trigger: 'blur', message: '请输入现住址'}],
        }
      }
    },
    mounted(){
      this.initList(this.$route.query.uId)
    },
    methods:{
      initList(uId){
        FamilyList(uId).then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      },
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.employeeid=this.$route.query.uId
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetFamily(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddFamily(this.AddEditInfo)
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
              EditFamily(this.AddEditInfo).then(response => {
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
          DeleteFamily(row.uId)
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
