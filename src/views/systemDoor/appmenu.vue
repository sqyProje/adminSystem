<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select v-model="listQuery.state" placeholder="默认">
            <el-option label="否" :value="0">否</el-option>
            <el-option label="是" :value="1">是</el-option>
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
              v-if="hasPerm('menu:add')"
              @click="addUserDialog">
              添加</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <el-table
      class="basetreetable"
      :data="tableData"
      v-loading="listLoading"
      row-key="uId"
      :tree-props="{children:'childMenu',hasChildren:'hasChildren'}"
      size  = "small"  max-height="600"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="菜单名称" prop="name"></el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
         <img :src="scope.row.imgicon" alt="" width="30" height="30">
        </template>
      </el-table-column>
      <el-table-column label="权限代码" prop="percode"></el-table-column>
      <el-table-column label="是否默认">
        <template slot-scope="scope">
          <el-button size="mini" round class='label-btn' :type="scope.row.isdefault ? 'success' : 'warning'">
            {{scope.row.isdefault ? "是" :"否"}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"></el-table-column>
      <el-table-column label="创建时间" prop="createdate"></el-table-column>
      <el-table-column label="更新时间" prop="updatedate"></el-table-column>
      <el-table-column label="操作" fixed="right"  width="260">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            v-if="hasPerm('menu:add')"
            @click="handleRoleMenu(scope.row)">新增</el-button>
          <el-button
            size="mini"
            type="success"
            v-if="hasPerm('menu:edit')"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="hasPerm('menu:deletes')"
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
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="FirstDialogVisible"
      width="33%">
      <el-form
        :inline="false"
        size="mini"
        :model="FirstMenuInfo"
        label-width="100px"
        ref="FirstMenuInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='图标' ><!-- :hideUpload="false"-->
          <singleUpload  :value="FirstMenuInfo.imgicon" :urlSign = urlSign @input="picFun"></singleUpload><!--:urlSign = urlSign-->
        </el-form-item>
        <el-form-item label ='名称'  prop="name">
          <el-input v-model="FirstMenuInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='图标颜色' >
          <el-input v-model="FirstMenuInfo.imgIconColour"></el-input>
        </el-form-item>
        <el-form-item label ='权限代码'  prop="percode">
          <el-input v-model="FirstMenuInfo.percode"></el-input>
        </el-form-item>
        <el-form-item label ='排序' prop="sort">
          <el-input v-model="FirstMenuInfo.sort"></el-input>
        </el-form-item>
        <el-form-item label='是否默认' prop="isdefault">
          <el-select v-model="FirstMenuInfo.isdefault" placeholder="是否默认" style="width: 178px;">
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
          <el-button size="small" @click="FirstCanleDialog">取 消</el-button>
          <el-button size="small" v-show="btnFlag" type="primary" @click="FirstUpdateUser">确 定</el-button>
          <el-button size="small"  v-show="!btnFlag" type="primary" @click="UpdateUser">保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import singleUpload from '@/components/Upload/singleImg'
  import {AppMenuList,AppMenuGet,AddAppMenu,EditAppMenu,DeleteAppMenu} from '@/api/appmenu'
  const defaultListQuery = {
    name: '',
    type:'',
    state:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading:false,
        tableData:[],
        total: null,
        dialogTitle:'',
        FirstDialogVisible:false,
        btnFlag:false,
        urlSign:'/file/getIconPicPath',
        FirstMenuInfo:{
          imgicon:'',
          imgIconColour:'',
          name:'',
          sort:'',
          parentid:'0',
          isdefault:'',
        },
        stateData:[
          { id: 0, display_name: '否'},
          { id: 1, display_name: '是'}
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          sort:[{required: true, trigger: 'blur', message: '请输入序号'}],
          isdefault: [{ required: true,trigger: 'change',message: '请选择是否默认'}],
        },
      }
    } ,
    components:{
      singleUpload
    },
    mounted(){
      this.initTable();
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        AppMenuList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
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
      handleEdit(row) {
        this.dialogTitle = '编辑'
        this.btnFlag=false
        AppMenuGet(row.uId)
          .then(response => {
            if(response.status == 0){
              this.FirstDialogVisible = true
              this.FirstMenuInfo = response.datas;
            }else{
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }

          })
      },
      handleRoleMenu(row){
        this.FirstDialogVisible = true
        this.dialogTitle = '添加子菜单'
        Object.keys(this.FirstMenuInfo).forEach(key => this.FirstMenuInfo[key]= '');
        this.FirstMenuInfo.isdefault = 1
        this.FirstMenuInfo.parentid = row.uId

      },

      //子主菜单
      addUserDialog(){
        this.FirstDialogVisible = !this.FirstDialogVisible
        Object.keys(this.FirstMenuInfo).forEach(key => this.FirstMenuInfo[key]= '');
        this.FirstMenuInfo.isdefault = 1
        this.FirstMenuInfo.parentid=0
        this.btnFlag=true
      },
      FirstUpdateUser(){
        AddAppMenu(this.FirstMenuInfo)
          .then(response => {
            this.FirstDialogVisible = false
            if (response.status === 0) {
              this.initTable();
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }
          })
      },
      FirstCanleDialog(){
        this.dialogTitle = '添加主菜单'
        this.FirstDialogVisible = false
        this.$refs.FirstMenuInfo.resetFields();
        Object.keys(this.FirstMenuInfo).forEach(key => this.FirstMenuInfo[key]= '');
      },
      UpdateUser(){
        this.$refs.FirstMenuInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加子菜单') {
              AddAppMenu(this.FirstMenuInfo)
                .then(response => {
                  this.FirstDialogVisible = false
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
              EditAppMenu(this.FirstMenuInfo).then(response => {
                if (response.status === 0) {
                  this.FirstDialogVisible = false
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
          DeleteAppMenu(row.uId)
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
      picFun(data){
        this.FirstMenuInfo.imgicon = data
      },
    }
  }

</script>
