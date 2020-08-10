<template>
    <div class="app-container">
      <search-tree
        :toChildId="listQuery.parentId"
        :toChildTree="leftTreeData"
        @childFnToParent="childFnInfo"
      ></search-tree>
      <el-col :span="21">
        <div class="filter-container">
        <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="listQuery.realname" placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.phoneno" placeholder="手机号"></el-input>
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
          <el-table-column label="真是姓名" prop="realname"></el-table-column>
          <el-table-column label="手机号" prop="phoneno"></el-table-column>
          <el-table-column label="部门" prop="departName"></el-table-column>
          <el-table-column label="身份证号" prop="idcard"></el-table-column>
          <el-table-column label="用户状态">
            <template slot-scope="scope">
              <el-button size="mini" round class="label-btn" :type="scope.row.state ? 'warning' : 'success'">
                {{scope.row.state ? "禁用" :"启用"}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                v-if="hasPerm('user:role')"
                @click="UserAppRole(scope.row)">App角色</el-button>
              <el-button
                size="mini"
                type="info"
                v-if="hasPerm('user:role')"
                @click="userRole(scope.row)">角色</el-button>
              <el-button
                size="mini"
                type="success"
                v-if="hasPerm('user:edit')"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="hasPerm('user:deletes')"
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
      </div>
      </el-col>
      <!--添加编辑-->
      <el-dialog
        :title="dialogTitle"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="33%">
        <el-form
          :inline="true"
          size="mini"
          :model="userInfo"
          label-width="100px"
          ref="userInfo"
          :rules ="rulesInfo"
        >
          <el-col>
            <el-form-item label ='头像'>
              <singleUpload  v-model="userInfo.picpath" @input="picFun"></singleUpload>
            </el-form-item>
          </el-col>
          <el-form-item label ='真实姓名' prop="realname">
            <el-input v-model="userInfo.realname"></el-input>
          </el-form-item>
          <el-form-item label ='身份证号'  prop="idcard">
            <el-input v-model="userInfo.idcard"></el-input>
          </el-form-item>
          <el-form-item label ='手机号' prop="phoneno">
            <el-input v-model="userInfo.phoneno"></el-input>
          </el-form-item>
          <el-form-item label ='邮箱'>
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label ='部门' prop="departId">
            <el-select v-model="mineStatus" placeholder="请选择" style="width: 178px;">
              <el-option :value="mineStatusValue" style="height: auto">
                <el-tree
                  :data="menuInfoArray"
                  node-key="uId"
                  ref="roleData"
                  @node-click="handleNodeClick"
                  :props="defaultProps">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='用户状态' prop="state">
            <el-select v-model="userInfo.state" placeholder="用户状态" style="width: 178px;">
              <el-option
                v-for="item in stateData"
                :label="item.display_name"
                :value="item.id"
                :key = "item.id"
              >{{item.display_name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label ='签名'>
            <singleUpload
              v-model="userInfo.picSignatureUrl"
              urlSign="file/getSignaturePath"
              @input="SignpicFun"></singleUpload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--角色-->
      <el-dialog
        :title="roleTitle"
        :close-on-click-modal="false"
        :visible.sync="roleDialogVisible"
        width="20%">
        <el-select
          v-model="updateRoleQuery.roleIds"
          multiple
          size="mini"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in roleList"
            :key="item.uId"
            :label="item.name"
            :value="item.uId">
          </el-option>
        </el-select>
          <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialogUserRole">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUserRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
  import store from '../../../store'
  import { Message, MessageBox } from 'element-ui'
  import singleUpload from '@/components/Upload/singleImg'
  import SearchTree from '@/components/LeftSearchTree/searchtree'
  import {validmobile,validcard} from '@/utils/validate'
  import {UserAppRoleGet,UserAppRoleUpdate} from '@/api/appmenu'
  import {UserList, AddUser, GetUser, EditUser,departDrop,UserRole,updateRole,DeleteUser}
    from '@/api/menu-pers'
  import {GetDepartInfoArray} from '@/api/personnel'


  const defaultListQuery = {
      realname: '',
      phoneno: '',
      departid:'',
      pageNum:1,
      pageSize:10
    }
  export default {
    data() {
      const validmobile = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      };
      const validcard = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入正确的身份证号'))
        } else {
          callback()
        }
      };
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        leftTreeData:[],
        dialogTitle:'',
        roleTitle:'',
        dialogVisible: false,
        roleDialogVisible:false,
        timer:'',
        departDrop:[],
        userInfo:{
          realname:'',
          idcard:'',
          phoneno:'',
          email:'',
          departid:'',
          picpath:'',
          picSignatureUrl:'',
          state:''
        },
        stateData:[
          { id: 0, display_name: '启用' },
          { id: 1, display_name: '禁用' }
        ],
        updateRoleQuery:{
          userId:'',
          roleIds:[]
        },
        roleList:[],
        deleteListArray:[],
        rulesInfo: {
          realname: [{ required: true,trigger: 'blur',message: '请输入真实姓名'}],
          idcard:[{required: true, trigger: 'blur', validator:validcard}],
          phoneno:[{required:true,trigger:'blur',validator:validmobile}],
          departid: [{ required: true,trigger: 'change',message: '请选择部门'}],
          state: [{ required: true,trigger: 'change',message: '请选择状态'}],
        },
        filterText:'',
        mineStatus:'',
        mineStatusValue:'',
        menuInfoArray:[{
          'name':'全部',
          'uId':'',
          'childMenu':[]
        }],
        defaultProps: {
          children: 'childMenu',
          label: 'name'
        },
      }
    },
    components:{
      singleUpload,SearchTree
    },
    created () {
      this.initTable();
      GetDepartInfoArray().then(response=>{
        response.datas.forEach(item=>{
          this.menuInfoArray[0].childMenu.push(item)
          this.leftTreeData.push(item)
        })
      })
    },

    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading =true
        UserList(this.listQuery).then( response =>{
            this.listLoading =false
            this.tableData =response.datas.list
            this.total = response.datas.total
          })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.initTable();
      },
      picFun(data){
        this.userInfo.picpath = data
      },
      SignpicFun(data){
        this.userInfo.picSignatureUrl = data

      },
      addUserDialog(){
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '添加'
        Object.keys(this.userInfo).forEach(key => this.userInfo[key]= '');
        this.userInfo.state=0
        this.timer = new Date().getTime()
      },
      UpdateUser(){
        this.$refs.userInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddUser(this.userInfo)
                .then(response => {
                  this.dialogVisible = false
                  this.mineStatus=''
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
              EditUser(this.userInfo).then(response => {
                if (response.status === 0) {
                  this.dialogVisible = false
                  this.initTable();
                  this.mineStatus=''
                 /*if(this.userInfo.uId ==)*/
                //  this.$store.commit('SET_AVATAR',this.userInfo.picpath)
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
      handleEdit(row) {
        this.dialogVisible = true
        this.dialogTitle = '编辑'
        this.timer = new Date().getTime()
        GetUser(row.uId)
          .then(response => {
            this.userInfo = response.datas
            this.userInfo.departid = response.datas.departId
            this.mineStatus = row.departName
          })
          .catch( error => {
          console.log(error);
        });

      },
      userRole(row){
        this.roleTitle = '角色'
        this.roleDialogVisible = true
        this.updateRoleQuery.userId = row.uId
          UserRole(row.uId).then(response=>{
          this.roleList =response.datas;
          this.roleList.forEach(selected=>{
            if(selected['selected']){
              this.updateRoleQuery.roleIds.push(selected.uId);
            }
          })
        })
      },
      UserAppRole(row){
        this.roleTitle = 'APP角色'
        this.roleDialogVisible = true
        this.updateRoleQuery.userId = row.uId
        console.log(this.roleList)
        UserAppRoleGet(row.uId).then(response=>{
          this.roleList =response.datas;
          console.log(this.roleList)
          this.roleList.forEach(selected=>{
            console.log(selected['selected'])
            if(selected['selected']){
              this.updateRoleQuery.roleIds.push(selected.uId);
            }
          })
        })
      },
      UpdateUserRole(){
        if(this.roleTitle==='角色'){
          updateRole(this.updateRoleQuery.userId,this.updateRoleQuery.roleIds).
          then(response=>{
            this.roleDialogVisible = false
            this.updateRoleQuery.roleIds=[]
            Message({
              message: response.msg,
              type: 'success',
              duration: 3 * 1000
            })
          })
        }else{
          UserAppRoleUpdate(this.updateRoleQuery.userId,this.updateRoleQuery.roleIds).
          then(response=>{
            if(response.status ===0 ){
              this.roleDialogVisible = false
              this.updateRoleQuery.roleIds=[]
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }else{
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }
          })
        }

      },
      canleDialogUserRole(){
        this.roleDialogVisible = false
        this.updateRoleQuery.roleIds =[]
        this.roleList = []
      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.userInfo.resetFields();
        Object.keys(this.userInfo).forEach(key => this.userInfo[key]= '');
        this.mineStatus=''
      },
      handleDelete(row) {
        MessageBox.confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          DeleteUser(row.uId)
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
      handleSearchList() {
        this.listQuery.pageNum = 1;
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
      handleNodeClick(val){
        this.mineStatus = val.name
        this.userInfo.departid = val.uId
      },
      childFnInfo(payload){
        this.listQuery.departid = payload.uId
        this.initTable(this.listQuery);
      }
    }
  }

</script>

<style>

</style>
