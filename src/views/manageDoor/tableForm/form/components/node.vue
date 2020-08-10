<template>
    <div>
      <h4>节点管理</h4>
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
          size  = "small"
          border
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="审批节点类型" prop="approveNodeName"></el-table-column>
          <el-table-column label="流程节点类型" prop="qdflownodeName"></el-table-column>
          <el-table-column label="审批角色" prop="approveroleName"></el-table-column>
          <el-table-column label="审批人" prop="userName"></el-table-column>
          <el-table-column label="状态"  width="80">
            <template slot-scope="scope">
              <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
                {{scope.row.state ? "启用" :"禁用"}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort"  width="55"></el-table-column>
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
      <!--添加编辑-->
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
          <el-form-item label ='名称'  prop="name">
            <el-input v-model="AddEditInfo.name"></el-input>
          </el-form-item>
          <el-form-item label ='简介' prop="sketch">
            <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
          </el-form-item>
          <el-form-item label='流程类型'  prop="qdflownodetype">
            <el-select v-model="AddEditInfo.qdflownodetype" placeholder="流程类型" style="width: 100%;">
              <el-option
                v-for="item in qdflownodetypeData"
                :label="item.enumValue"
                :value="item.enumKey"
                :key="item.enumKey">
                {{item.enumValue}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='审批节点'  prop="approvenodetype">
            <el-select v-model="AddEditInfo.approvenodetype" @change="approveChange" placeholder="审批节点" style="width: 100%;">
              <el-option
                v-for="item in approvenodetypeData"
                :label="item.enumValue"
                :value="item.enumKey"
                :key="item.enumKey">
                {{item.enumValue}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='审批角色'  prop="approveroleid" v-show="approveFlag">
            <el-select v-model="AddEditInfo.approveroleid" placeholder="审批角色" style="width: 100%;">
              <el-option
                v-for="item in approveRoleData"
                :label="item.name"
                :value="item.uId"
                :key="item.uId">
                {{item.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='审批人'  prop="userid" v-show="userFlag">
            <el-select v-model="AddEditInfo.userid" placeholder="审批人" style="width: 100%;">
              <el-option
                v-for="item in userDropData"
                :label="item.realname"
                :value="item.uId"
                :key="item.uId">
                {{item.realname}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label ='排序' prop="sort">
            <el-input v-model="AddEditInfo.sort" type="number"></el-input>
          </el-form-item>
          <el-form-item label='状态'>
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
          <el-button size="small" @click="canleDialog">关 闭</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import {enumeration} from '@/api/basic'
  import { InitFlowNodeList,AddFlowNodeInfo,
    GetFlowNodeInfo,EditFlowNodeInfo,DeleteFlowNodeInfo,FlowNodeDrop,FlowNodeLine,FlowLineAll} from '@/api/tableForm'
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
        AddEditInfo:{
          name:'',
          sketch:'',
          qdflowid:'',
          approveroleid:'',
          sort:'',
          userid:'',
          approvenodetype:'',
          state:'',
        },
        stateData:[
          { id:0 , display_name: '禁用'},
          { id:1, display_name: '启用'}
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          sketch:[{required: true, trigger: 'blur', message: '请输入简介'}],
          sort:[{required: true, trigger: 'blur', message: '请输入排序'}],
          approvenodetype:[{required: true, trigger: 'blur', message: '请选择审批节点类型'}],
          qdflownodetype:[{required: true, trigger: 'blur', message: '请选择流程类型'}],
        },
        approvenodetypeData:[],
        qdflownodetypeData:[],
        approveRoleData:[],
        userDropData:[],
        approveFlag:false,
        userFlag:false,
        addInfo:{
          id:'',
          name:'',
          sourceID:'',
          condition:'',
          toID:''
        },
        flowFlag:false,
        nodes:[],
        edges:[]
      }
    } ,
    created(){
      this.listQuery.qdFlowId = this.$route.query.form_id
      this.initTable()
      enumeration('/approveEnum/getApproveNodeTypeEnums')
        .then(res=>{
          this.approvenodetypeData = res.datas
        })
      enumeration('/approveEnum/getQdFlowNodeTypeEnums')
        .then(res=>{
          this.qdflownodetypeData = res.datas
        })
      approveRoleDrop().then(res=>{
        this.approveRoleData = res.datas
      })
      userDrop().then(res=>{
        this.userDropData = res.datas
      })
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitFlowNodeList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
          .catch(error => {
            console.log(error);
          });
      },
      handleResetSearch() {
        this.listQuery.qdFlowId = this.$route.query.form_id
        this.listQuery = Object.assign({}, defaultListQuery);
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
        this.AddEditInfo.state = 1
        this.AddEditInfo.qdflowid = this.$route.query.form_id

      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.AddEditInfo.qdflowid = this.$route.query.form_id
        this.dialogTitle = '编辑'
        GetFlowNodeInfo(row.uId).then(response=>{
          this.AddEditInfo = response.datas
          if(this.AddEditInfo.approvenodetype===10||this.AddEditInfo.approvenodetype===30){
            this.userFlag=false
            this.approveFlag=true
          }else if(this.AddEditInfo.approvenodetype===20){
            this.userFlag=true
            this.approveFlag=false
          }else if(this.AddEditInfo.approvenodetype===1){
            this.userFlag=false
            this.approveFlag=false
          }

        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddFlowNodeInfo(this.AddEditInfo)
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
              EditFlowNodeInfo(this.AddEditInfo).then(response => {
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
            FlowNodeDrop(this.$route.query.form_id).then(res=>{})
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
          DeleteFlowNodeInfo(row.uId)
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
      approveChange(value){
        console.log(value)
        if(value===20 ){
          this.userFlag=true
          this.approveFlag=false
          this.AddEditInfo.approveroleid=''
        }else if(value===10 ||value===30){
          this.approveFlag=true
          this.userFlag=false
          this.AddEditInfo.userid=''
        }else if(value===1){
          this.approveFlag=false
          this.userFlag=false
          this.AddEditInfo.approveroleid=''
          this.AddEditInfo.userid=''
        }
      }
    }
  }

</script>

