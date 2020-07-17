<template>
  <div class="app-container">
    <div class="filter-container">
      <el-col style="margin-bottom:10px;">
          <el-button
            type="success"
            size="small"
            @click="handleAdd">
            添加</el-button>
      </el-col>
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
        <el-table-column label="字段名" prop="name"></el-table-column>
        <el-table-column label="字段类型" prop="datatype"></el-table-column>
        <el-table-column label="审批显示">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.isshow ? 'warning' : 'success'">
              {{scope.row.isshow ? "隐藏" :"显示"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否必填">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.ismust ? 'warning' : 'success'">
              {{scope.row.ismust ? "选填" :"必填"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="操作" fixed="right" width="270px">
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
      :visible.sync="dialogVisible"
      width="25%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="80px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='字段名'  prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label='字段类型' prop="datatype">
          <el-select v-model="AddEditInfo.datatype" placeholder="字段类型" @change="typeChange" style="width: 100%;">
            <el-option
              v-for="item in dictionTypeData"
              :label="item.name"
              :value="item.name"
              :key="item.uId">
              {{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='下拉显示' v-show="listIdFlag">
          <el-select v-model="AddEditInfo.listid" style="width: 100%;">
            <el-option
              v-for="item in listIdData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='默认值'>
          <el-input v-model="AddEditInfo.datadefault"></el-input>
        </el-form-item>
        <el-form-item label ='宽'>
          <el-input  v-model="AddEditInfo.textWide"></el-input>
        </el-form-item>
        <el-form-item label ='高'>
          <el-input  v-model="AddEditInfo.textHigh"></el-input>
        </el-form-item>
        <el-form-item label='审批显示' prop="isshow">
          <el-select v-model="AddEditInfo.isshow" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.isshow_name"
              :value="item.id"
              :key = "item.id"
            >{{item.isshow_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='是否必填' prop="ismust">
          <el-select v-model="AddEditInfo.ismust" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.must_name"
              :value="item.id"
              :key = "item.id"
            >{{item.must_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='填写提示'>
          <el-input v-model="AddEditInfo.advise"></el-input>
        </el-form-item>
        <el-form-item label ='填写文本'>
          <el-input v-model="AddEditInfo.content"></el-input>
        </el-form-item>
        <el-form-item label ='排序' prop="sort">
          <el-input v-model="AddEditInfo.sort"></el-input>
        </el-form-item>
        <el-form-item label='状态' prop="state">
          <el-select v-model="AddEditInfo.state" style="width: 100%;">
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
  import { Message, MessageBox } from 'element-ui'
  import {dictionType} from '@/api/basic'
  import {InitFieldList,AddFieldInfo,GetFieldInfo,EditFieldInfo,DeleteFieldInfo,findByParentId} from '@/api/activiti'
  export default {
    data(){
      return {
        tableData:[],
        dialogTitle:'',
        dialogVisible: false,
        listIdFlag:false,
        AddEditInfo:{
          name:'',
          formid:'',
          datatype:'',
          datadefault:'',
          textWide:'',
          textHigh:'',
          isshow:'',
          ismust:'',
          advise:'',
          content:'',
          sort:'',
          state:0,
        },
        stateData:[
          { id:0 , display_name: '启用',isshow_name:'显示',must_name:'必填' },
          { id:1, display_name: '禁用',isshow_name:'隐藏',must_name:'选填' }
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入字段名字'}],
          datatype:[{required: true, trigger: 'blur', message: '请选择字段类型'}],
          isshow: [{ required: true,trigger: 'blur',message: '请选择是否显示'}],
          ismust: [{ required: true,trigger: 'blur',message: '请选择是否必填'}],
          sort: [{ required: true,trigger: 'blur',message: '请输入排序'}],
          state: [{ required: true,trigger: 'blur',message: '请选择字段状态'}],
        },
        dictionTypeData:[],
        listIdData:[]
      }
    } ,
    created(){
      this.initTable();
      dictionType('d0b2c3b7295e4c9ba72a20036867c35f')
        .then(res=>{
          this.dictionTypeData = res.datas
        })
      findByParentId().then(response=>{
        this.listIdData = response.datas
      })
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitFieldList(this.$route.query.form_id).then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      },
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '添加'
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.AddEditInfo.state = 0
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetFieldInfo(row.uId).then(response=>{
          this.AddEditInfo = response.datas
          if(this.AddEditInfo.datatype =='复选框' || this.AddEditInfo.datatype == '单选框'){
            this.listIdFlag = true
          }else{
            this.listIdFlag = false
          }
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              this.AddEditInfo.formid = this.$route.query.form_id
              AddFieldInfo(this.AddEditInfo)
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
              EditFieldInfo(this.AddEditInfo).then(response => {
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
          DeleteFieldInfo(row.uId)
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
      canleDialog(){
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      typeChange(value){
        if(value =='复选框' || value == '单选框'){
          this.listIdFlag = true
        }else{
          this.listIdFlag = false
        }
      }
    }
  }

</script>

