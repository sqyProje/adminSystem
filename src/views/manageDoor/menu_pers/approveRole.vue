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
        size  = "small"  max-height="600"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "显示" :"不显示"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              v-if="hasPerm('role:permission')"
              @click="handleRoleMenu(scope.row)">用户</el-button>
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
        :close-on-click-modal="false"      :show-close="false"
        :visible.sync="dialogVisible"
        width="33%">
        <el-form
          :inline="false"
          size="mini"
          :model="roleInfo"
          label-width="100px"
          ref="roleInfo"
          :rules ="rulesInfo"
        >
          <el-form-item label ='名称' prop="name">
            <el-input v-model="roleInfo.name"></el-input>
          </el-form-item>

          <el-form-item label ='简介'  prop="sketch">
            <el-input type="textarea" v-model="roleInfo.sketch"></el-input>
          </el-form-item>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label ='排序'  prop="sort">
                <el-input type="number" v-model="roleInfo.sort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label='状态' prop="state">
                <el-select v-model="roleInfo.state" placeholder="状态" style="width: 178px;">
                  <el-option
                    v-for="item in stateData"
                    :label="item.display_name"
                    :value="item.id"
                    :key = "item.id"
                  >{{item.display_name}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--用户-->
      <el-dialog
        title="用户"
        :close-on-click-modal="false"      :show-close="false"
        :visible.sync="RoleDialogVisible"
        width="33%">
        <!---->
        <el-tree
          :data="roleData"
          show-checkbox
          node-key="id"
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
  import {ApproveList,AddApprove,GetApprove,EditApprove,DeleteApprove,ApproveMenu,UploadApproveMenu} from '@/api/menu-pers'
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
            sketch:'',
            state:''
          },
          stateData:[
            { id: 0, display_name: '不显示'},
            { id: 1, display_name: '显示'}
          ],
          rulesInfo: {
            name: [{ required: true,trigger: 'blur',message: '请输入角色名称'}],
            sort:[{required: true, trigger: 'blur', message: '请输入序号'}],
            state: [{ required: true,trigger: 'change',message: '请选择状态'}],
          },
          roleId:'',
          roleData:[],
          userIds:[],
          resourceCheckedKey:[],
          defaultProps: {
            children: 'children',
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
          ApproveList(this.listQuery).then(response => {
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
          this.roleInfo.state=1
        },
        UpdateUser(){
          this.$refs.roleInfo.validate(valid => {
            if (valid) {
              if (this.dialogTitle === '添加') {
                AddApprove(this.roleInfo)
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
                EditApprove(this.roleInfo).then(response => {
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
            DeleteApprove(row.uId)
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
          GetApprove(row.uId)
            .then(response => {
              this.roleInfo = response.datas
            })
            .catch( error => {
              console.log(error);
            });
        },
        //选择用户
        handleRoleMenu(row){
          this.RoleDialogVisible = true
          this.roleId = row.uId
          ApproveMenu(row.uId).then(response=>{
            response.datas.forEach((res,key)=>{
              this.roleData.push({id:key,name:res.name,children:[]})
              res.children.forEach((child)=>{
                this.roleData[key].children.push({id:child.userId,name:child.realName,selected:child.selected})
              })
            })
            this.findAllChildren(this.roleData,this.resourceCheckedKey)
            this.$nextTick(()=>{
              this.$refs.roleData.setCheckedKeys(this.resourceCheckedKey)
            })

          })
        },
        UpdateRoleMenu(){
          let checkedKeys = this.$refs.roleData.getCheckedKeys();
          checkedKeys =  checkedKeys.filter((value)=>{
            return value.length >= 3
          })
          this.userIds = checkedKeys
          UploadApproveMenu(this.roleId,this.userIds)
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
            if(item.children.length!==0){
              item.children.forEach((child)=>{
                if(child.selected){
                  arr.push(child.id)
                }
              })
            }
          })
        },
      }
    }

</script>

<style>

</style>
