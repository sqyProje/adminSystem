<template>
  <div class="app-container">
    <div class="filter-container">
      <el-col style="margin-bottom:10px;">
        <el-button
          type="success"
          size="small"
          @click="handleAdd">
          添加</el-button>
        <el-button
          type="warning"
          size="small"
          @click="prev">
          返回</el-button>
      </el-col>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        row-key="uId"
        size  = "small"  max-height="600"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="字段名" prop="fieldname"></el-table-column>
        <el-table-column label="字段类型" prop="fieldTypeName"></el-table-column>
        <el-table-column label="摘要显示">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.isshow ? 'success' : 'warning'">
              {{scope.row.isshow ? "显示" :"不显示"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "显示" :"不显示"}}
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
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="100px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='字段名'  prop="fieldname">
          <el-input v-model="AddEditInfo.fieldname"></el-input>
        </el-form-item>
        <el-form-item label='字段类型' prop="fieldtype">
          <el-select v-model="AddEditInfo.fieldtype" placeholder="字段类型" style="width: 100%;">
            <el-option
              v-for="item in dictionTypeData"
              :label="item.enumValue"
              :value="item.enumKey"
              :key="item.enumKey">
              {{item.enumValue}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='下拉框' >
          <el-select v-model="AddEditInfo.isdrop"  @change="typeChange" style="width: 100%;">
            <el-option
              v-for="item in isDropData"
              :label="item.name"
              :value="item.id"
              :key = "item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='下拉类别'  prop="listId" v-if="listIdFlag">
          <el-select v-model="AddEditInfo.listId" style="width: 100%;">
            <el-option
              v-for="item in listIdData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='摘要显示' prop="isshow">
          <el-select v-model="AddEditInfo.isshow" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.isshow_name"
              :value="item.id"
              :key = "item.id"
            >{{item.isshow_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='提示信息'>
          <el-input v-model="AddEditInfo.valimessage"></el-input>
        </el-form-item>
        <el-form-item label ='排序' prop="sort">
          <el-input v-model="AddEditInfo.sort" type="number"></el-input>
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
        <el-form-item label='是否验证' prop="isvalidate">
          <el-select v-model="AddEditInfo.isvalidate" @change= validChange style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.val_name"
              :value="item.id"
              :key = "item.id"
            >{{item.val_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='正则表达式' v-if="validFlag">
          <el-input v-model="AddEditInfo.regular"></el-input>
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
  import {dictionType,enumeration} from '@/api/basic'
  import {InitFieldList,AddFieldInfo,GetFieldInfo,EditFieldInfo,DeleteFieldInfo,findByParentId} from '@/api/tableForm'
  const defaultListQuery = {
    tableFormId: '',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total:null,
        dialogTitle:'',
        dialogVisible: false,
        listIdFlag:false,
        validFlag:false,
        AddEditInfo:{
          tableformid:"",
          fieldname:"",
          fieldtype:"",
          isdrop:'',
          listId:"",
          isshow:"",
          valimessage:"",
          sketch:"",
          sort:"",
          isvalidate:"",
          regular:"",
          state:"",
        },
        isDropData:[
          { id:0 ,name:'非下拉框'},
          { id:1, name:'下单框'},
          { id:2, name:'复选框'}
        ],
        stateData:[
          { id:0 , display_name: '不显示',isshow_name:'不显示',"val_name":'不验证',must_name:'否'},
          { id:1, display_name: '显示',isshow_name:'显示',"val_name":'验证',must_name:'是'}
        ],
        rulesInfo: {
          fieldname: [{ required: true,trigger: 'blur',message: '请输入字段名字'}],
          fieldtype:[{required: true, trigger: 'blur', message: '请选择字段类型'}],
          isshow: [{ required: true,trigger: 'blur',message: '请选择是否显示摘要'}],
          ismust: [{ required: true,trigger: 'blur',message: '请选择是否必填'}],
          isvalidate:[{ required: true,trigger: 'blur',message: '请选择是否验证'}],
          sort: [{ required: true,trigger: 'blur',message: '排序应为数字'}],
          state: [{ required: true,trigger: 'blur',message: '请选择字段状态'}],
        },
        dictionTypeData:[],
        listIdData:[]
      }
    } ,
    created(){
      this.initTable();
      enumeration('/approveEnum/getFieldTypeEnums')
        .then(res=>{
          this.dictionTypeData = res.datas
        })
      dictionType('b359f327c86a42d8a1ed08fce9242ff6')
        .then(res=>{
          this.listIdData = res.datas
        })
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listQuery.tableFormId=this.$route.query.form_id
        this.listLoading = true
        InitFieldList( this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
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
        this.dialogTitle = '添加'
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.AddEditInfo.state = 1
        this.AddEditInfo.isvalidate = 0
        this.AddEditInfo.isshow = 0
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetFieldInfo(row.uId).then(response=>{
          this.AddEditInfo = response.datas
          if(this.AddEditInfo.isdrop ===1 || this.AddEditInfo.isdrop === 2){
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
              this.AddEditInfo.tableformid = this.$route.query.form_id
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

      validChange(value){
        if(value ===1 || value ===2){
        this.validFlag = true
      }else{
        this.validFlag = false
      }},
      typeChange(value){
        if(value ===1 || value ===2){
          this.listIdFlag = true
        }else{
          this.listIdFlag = false
        }
      },
      prev(){
        this.$router.push({name:'form'})
      }
    }
  }

</script>

