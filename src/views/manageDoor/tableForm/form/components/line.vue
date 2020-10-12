<template>
  <div>
    <h4>连线管理</h4>
    <div class="filter-container">
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
            <el-col  v-show="tableFieldFlag">
              <el-form-item>
                <el-button
                  type="success"
                  size="small"
                  @click="handleAdd">
                  添加</el-button>
              </el-form-item>
            </el-col>
          </el-form>
          <el-table
            :data="tableData"
            v-loading="listLoading"
            size  = "small"  max-height="600"
            border
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="上一步" prop="lastName"></el-table-column>
            <el-table-column label="下一步" prop="nextName"></el-table-column>
            <el-table-column label="字段" prop="fieldName"></el-table-column>
            <el-table-column label="排序" prop="sort"   width="55"></el-table-column>
            <el-table-column label="条件"  width="80">
              <template slot-scope="scope">
                <el-button size="mini" round class='label-btn' :type="scope.row.iscondition ? 'success' : 'warning'">
                  {{scope.row.iscondition ? "存在" :"不存在"}}
                </el-button>
              </template>
            </el-table-column>
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
      width="25%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="110px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='名称'  prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label='上一步节点'  prop="lastid">
          <el-select v-model="AddEditInfo.lastid" placeholder="上一步节点" style="width: 100%;">
            <el-option
              v-for="item in AllNodeData"
              :label="item.name"
              :value="item.uId"
              :key="item.uId">
              {{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='下一步节点' prop="nextid">
          <el-select v-model="AddEditInfo.nextid" placeholder="下一步节点" style="width: 100%;">
            <el-option
              v-for="item in AllNodeData"
              :label="item.name"
              :value="item.uId"
              :key="item.uId">
              {{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='条件状态' prop="iscondition">
          <el-select v-model="AddEditInfo.iscondition" @change="conditionChange" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='字段' v-show="conditionFlag">
          <el-select v-model="AddEditInfo.ifField"
                     :clearable = true
                     style="width: 100%;">
            <el-option
              v-for="item in IfElseData"
              :label="item.fieldName"
              :value="item.uId"
              :key = "item.uId"
            >{{item.fieldName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='条件'v-show="conditionFlag">
            <el-input v-model="AddEditInfo.ifElse"></el-input>
        </el-form-item>
        <el-form-item label ='排序' prop="sort">
          <el-input v-model="AddEditInfo.sort" type="number"></el-input>
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
  import singleUpload from '@/components/Upload/singleImg'
  import {FlowElseDrop,FlowNodeDrop,InitFlowLineList,AddFlowLineInfo,
    GetFlowLineInfo,EditFlowLineInfo,DeleteFlowLineInfo} from '@/api/tableForm'
  import {approveRoleDrop,userDrop} from '@/api/menu-pers'
  const defaultListQuery = {
    name: '',
    qdFlowId:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    props:{
      tableFieldFlag:{
        type:Boolean,
      }
    },
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        listLoading:false,
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo: {
          name: '',
          qdflowid: '',
          lastid: "",
          nextid: "",
          iscondition: "",
          ifField: "",
          ifElse: "",
          sort: "",
        },
        stateData:[
          { id:0 , display_name: '不存在' },
          { id:1, display_name: '存在' }
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          lastid:[{required: true, trigger: 'blur', message: '请选择上一部节点'}],
          nextid:[{required: true, trigger: 'blur', message: '请选择下一部节点'}],
          iscondition:[{required: true, trigger: 'blur', message: '请选择条件状态'}],
          sort:[{required: true, trigger: 'blur', message: '排序应为数字'}],
        },
        AllNodeData:[],
        IfElseData:[],
        conditionFlag:false,
      }
    } ,
    created(){
      this.listQuery.qdFlowId = this.$route.query.form_id
      this.initTable()

      FlowElseDrop(this.$route.query.form_id).then(res=>{
        this.IfElseData = res.datas
      })
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitFlowLineList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.listQuery.qdFlowId=this.$route.query.form_id
        this.initTable()
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
        this.AddEditInfo.iscondition = 0
        this.AddEditInfo.qdflowid = this.$route.query.form_id
        FlowNodeDrop(this.$route.query.form_id).then(res=>{
          this.AllNodeData = res.datas
        })
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.AddEditInfo.qdflowid = this.$route.query.form_id
        this.dialogTitle = '编辑'

        FlowNodeDrop(this.$route.query.form_id).then(res=>{
          this.AllNodeData = res.datas
        })
        GetFlowLineInfo(row.uId).then(response=>{
          this.AddEditInfo = response.datas
          if(this.AddEditInfo.iscondition===1){
            this.conditionFlag = true
          }else{
            this.conditionFlag = false
          }
        })
      },
      UpdateUser(){

        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddFlowLineInfo(this.AddEditInfo)
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
              EditFlowLineInfo(this.AddEditInfo).then(response => {
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
         DeleteFlowLineInfo(row.uId)
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
      conditionChange(value){
        if(value===1){
          this.conditionFlag=true
        }else{
          this.conditionFlag=false
        }
      }
    }
  }

</script>

