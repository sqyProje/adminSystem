<template>
  <div class="app-container">
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
        <el-col>
          <el-form-item>
            <el-button
              type="success"
              size="small"
              v-if="hasPerm('user:add')"
              @click="addUserDialog">
              添加</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
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
      <el-table-column label="排序" prop="sort"></el-table-column>
      <el-table-column label="创建时间" prop="createdate"></el-table-column>
      <el-table-column label="更新时间" prop="updatedate"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            v-if="hasPerm('role:permission')"
            @click="handleRoleMenu(scope.row)">权限</el-button>
          <el-button
            size="mini"
            type="success"
            v-if="hasPerm('role:edit')"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="hasPerm('role:deletes')"
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
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="33%">
      <el-form
        :inline="true"
        size="mini"
        :model="roleInfo"
        label-width="100px"
        ref="roleInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='角色名称' prop="name">
          <el-input v-model="roleInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='排序'  prop="sort">
          <el-input v-model="roleInfo.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--角色权限-->
    <el-dialog
      title="角色权限"
      :close-on-click-modal="false"
      :visible.sync="RoleDialogVisible"
      width="33%">
      <!---->
      <el-tree
        :data="roleData"
        show-checkbox
        node-key="uId"
        ref="roleData"
        :default-expanded-keys="resourceCheckedKey"
        :default-checked-keys="resourceCheckedKey"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="RoleCanleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateRoleMenu">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import {AppRoleList,AppRoleGet,AddAppRole,EditAppRole,DeleteappRole,AppRole,updateAppRole} from '@/api/appmenu'
  const defaultListQuery = {
    name: '',
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
        dialogVisible: false,
        RoleDialogVisible:false,
        roleInfo:{
          name:'',
          sort:'',
        },

        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入角色名称'}],
          sort:[{required: true, trigger: 'blur', message: '请输入序号'}],
        },
        roleId:'',
        roleData:[],
        resourceCheckedKey:[],
        defaultProps: {
          children: 'childMenu',
          label: 'name'
        }
      }
    } ,
    created(){
      this.initTable()
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        AppRoleList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        initTable()
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
      addUserDialog(){
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '添加'
        Object.keys(this.roleInfo).forEach(key => this.roleInfo[key]= '');
      },
      UpdateUser(){
        this.$refs.roleInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddAppRole(this.roleInfo)
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
              EditAppRole(this.roleInfo).then(response => {
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
          DeleteappRole(row.uId)
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
      handleEdit(row) {
        this.dialogVisible = true
        this.dialogTitle = '编辑'
        AppRoleGet(row.uId)
          .then(response => {
            this.roleInfo = response.datas
          })
          .catch( error => {
            console.log(error);
          });
      },
      handleRoleMenu(row){
        this.RoleDialogVisible = true
        this.roleId = row.uId
        AppRole(row.uId).then(response=>{
          this.roleData = response.datas;
          this.findAllChildren(this.roleData,this.resourceCheckedKey)
        })
      },
      UpdateRoleMenu(){
        let checkedKeys = this.$refs.roleData.getCheckedKeys();
        let hafCheckedKeys = this.$refs.roleData.getHalfCheckedKeys();
        this.roleData = checkedKeys.concat(hafCheckedKeys)
        updateAppRole(this.roleData,this.roleId)
          .then(response=>{
            this.RoleDialogVisible = false
            this.resourceCheckedKey=[]
            this.roleData = []
            Message({
              message: response.msg,
              type: 'success',
              duration: 3 * 1000
            })
          })
      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.roleInfo.resetFields();
        Object.keys(this.roleInfo).forEach(key => this.roleInfo[key]= '');
      },
      RoleCanleDialog(){
        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
      },
      //遍历选中子节点
      findAllChildren(data,arr){
        data.forEach((item,index)=>{
          if(item.childMenu.length!==0){
            this.findAllChildren(item.childMenu,arr)
          }else if(item.selected){
            arr.push(item.uId)
          }
        })
      }
    }
  }

</script>

<style>

</style>
