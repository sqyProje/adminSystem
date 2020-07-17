
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.type_id" placeholder="分类名称" style="width: 100%;">
            <el-option
              v-for="item in dictionTypeData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            ></el-option>
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
        <el-col>
          <el-form-item>
            <el-button
              type="success"
              size="small"
              v-if="hasPerm('act_manage:add')"
              @click="handleAdd">
              添加</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        row-key="uId"
        :tree-props="{children:'childMenu',hasChildren:'hasChildren'}"
        size  = "small"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="分类名称" prop="typeName"></el-table-column>
        <el-table-column label="部署id" prop="deployId"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" prop="lastUpdateName"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('act_model:design')"
              @click="handleEdit(scope.row)">设计</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="hasPerm('act_model:deploy')"
              @click="handleDelete(scope.row)">部署</el-button>
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
        <el-form-item label='分类名称' prop="type_id">
          <el-select v-model="AddEditInfo.type_id" placeholder="分类名称" style="width: 100%;">
            <el-option
              v-for="item in dictionTypeData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='模板名称' prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='描述'>
          <el-input v-model="AddEditInfo.sketch"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :show-close = "false"
      fullscreen
      append-to-body
      :visible.sync="designDialogVisible"
      width="100%">
      <iframe ref="activit" v-show='designDialogVisible' width="100%" height='100%' :src="src" style="border:none"></iframe>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary"  size="small"  @click="DesignCanleDialog">关  闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {dictionType} from '@/api/basic'
  import {InitModelList,AddModelInfo,DeployModelInfo} from '@/api/activiti'
  const defaultListQuery = {
    name:'',
    type_id:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        dialogTitle:'',
        dialogVisible:false,
        dictionTypeData:[],
        AddEditInfo:{
          type_id:'',
          name:'',
          sketch:'',
        },
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          type_id:[{required: true, trigger: 'blur', message: '请选择模板类型'}],
        },
        designDialogVisible:false,
        src:''
      }
    } ,
    created(){
      this.initTable();
      dictionType('0556e14a6dbc49a1bb668421ad570560')
        .then(res=>{
          this.dictionTypeData = res.datas
        })
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitModelList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.act_model_model
          this.total = response.datas.total
        })
      },
      handleResetSearch() {
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
      handleAdd(){
        this.dialogTitle='添加'
        this.dialogVisible=true
      },
      handleEdit(row) {
        this.dialogTitle='设计'
        this.designDialogVisible=true
        this.src= "/static/modeler.html?modelId=" + row.m_id;//activiti主html路径

      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            AddModelInfo(this.AddEditInfo)
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
        MessageBox.confirm('确定需要部署吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          DeployModelInfo(row.m_id,row.type_id)
            .then(response => {
              if(response.status ===0 ){
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }else{
                Message({
                  message: response.msg,
                  type: 'error',
                  duration: 3 * 1000
                })
              }

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
        this.dialogVisible=false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      DesignCanleDialog(){
        this.designDialogVisible = false
        this.initTable();
      }
    }
  }

</script>
<style>
  .el-dialog.is-fullscreen .el-dialog__header{
    padding-bottom: 0;
    background-color: #cccccc;
  }
  .el-dialog.is-fullscreen .el-dialog__body{
    height: calc(100% - 44px - 62px);
    padding:0;
  }
</style>
