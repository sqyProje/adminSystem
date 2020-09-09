<template>
    <div class="app-container">
      <div class="filter-container">
        <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="listQuery.name" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item >
            <el-select v-model="listQuery.type" placeholder="菜单类型">
              <el-option label="菜单" :value="0">菜单</el-option>
              <el-option label="按钮" :value="1">按钮</el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-select v-model="listQuery.state" placeholder="状态">
              <el-option label="启用" :value="0">启用</el-option>
              <el-option label="禁用" :value="1">禁用</el-option>
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
        size  = "small"
        max-height="600"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="菜单名称" prop="name"></el-table-column>
        <el-table-column label="路由名称" prop="enName"></el-table-column>
        <el-table-column label="权限代码" prop="percode"></el-table-column>
        <el-table-column label="类型" prop="type">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.type ? 'warning' : 'success'">
              {{scope.row.type ? "按钮" :"菜单"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="菜单状态">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'warning' : 'success'">
              {{scope.row.state ? "禁用" :"启用"}}
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
        title="添加主菜单"
        :close-on-click-modal="false"      :show-close="false"
        :visible.sync="FirstDialogVisible"
        width="33%">
        <el-form
          :inline="true"
          size="mini"
          :model="FirstMenuInfo"
          label-width="100px"
          ref="menuInfo"
          :rules ="rulesInfo"
        >
          <el-form-item label ='名称'  prop="name">
            <el-input v-model="FirstMenuInfo.name"></el-input>
          </el-form-item>
          <el-form-item label ='路由名称'  prop="enName">
            <el-input v-model="FirstMenuInfo.enName"></el-input>
          </el-form-item>
          <el-form-item label ='菜单图标' >
            <el-input v-model="FirstMenuInfo.imgicon"></el-input>
          </el-form-item>
          <el-form-item label ='排序' prop="sort">
            <el-input v-model="FirstMenuInfo.sort"></el-input>
          </el-form-item>
          <el-form-item label='菜单状态' prop="state">
            <el-select v-model="FirstMenuInfo.state" placeholder="状态" style="width: 178px;">
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
          <el-button size="small" type="" @click="FirstCanleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="FirstUpdateUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--子集添加编辑-->
      <el-dialog
        :title="dialogTitle"
        :close-on-click-modal="false"      :show-close="false"
        :visible.sync="dialogVisible"
        width="33%">
        <el-form
          :inline="true"
          size="mini"
          :model="menuInfo"
          label-width="100px"
          ref="menuInfo"
          :rules ="rulesInfo"
        >
          <el-form-item label ='菜单类型' prop="type">
            <el-select v-model="menuInfo.type" style="width: 178px;"
                       @change="typeSelect">
              <el-option
                v-for="item in stateData"
                :label="item.menu_name"
                :value="item.id"
                :key = "item.id"
              >{{item.menu_name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label ='菜单图标' v-show="parentBtn">
            <el-input v-model="menuInfo.imgicon"></el-input>
          </el-form-item>
          <el-form-item label ='名称'  prop="name">
            <el-input v-model="menuInfo.name"></el-input>
          </el-form-item>
          <el-form-item label ='英文名称'  prop="enName" v-show="parentBtn">
            <el-input v-model="menuInfo.enName"></el-input>
          </el-form-item>
          <el-form-item label ='路径' v-show="parentBtn">
            <el-input v-model="menuInfo.murl" placeholder="非最终主菜单禁止填写"></el-input>
          </el-form-item>
          <el-form-item label ='权限代码' prop="percode" v-show="!parentBtn">
            <el-input v-model="menuInfo.percode"></el-input>
          </el-form-item>
          <el-form-item label ='排序' prop="sort">
            <el-input type="number" v-model="menuInfo.sort"></el-input>
          </el-form-item>
          <el-form-item label='菜单状态' prop="state">
            <el-select v-model="menuInfo.state" placeholder="状态" style="width: 178px;">
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
  import {MenuList,AddMenu,GetMenu,EditMenu,DeleteMenu,UploadRoleMenu} from '@/api/menu-pers'
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
          listLoading:true,
          listQuery: Object.assign({}, defaultListQuery),
          tableData:[],
          total: null,
          dialogTitle:'',
          dialogVisible: false,
          FirstDialogVisible:false,
          editInfoMenu:false,
          parentBtn:true,
          FirstMenuInfo:{
            imgicon:'',
            name:'',
            enName:'',
            type:'0',
            sort:'',
            parentid:'0',
            state:0,
          },
          stateData:[
            { id: 0, display_name: '启用' ,menu_name:'菜单'},
            { id: 1, display_name: '禁用' ,menu_name:'按钮' }
          ],
          menuInfo:{
            imgicon:'',
            percode:'',
            murl:'',
            name:'',
            enName:'',
            type:'',
            sort:'',
            parentid:'',
            parentidName:'',
            state:'',
          },
          rulesInfo: {
            name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
            enName:[{ required: true,trigger: 'blur',message: '请输入英文名称'}],
            type: [{ required: true,trigger: 'blur',message: '请输入类型'}],
           // percode:[{ required: true,trigger: 'blur',message: '请输入权限代码'}],
            sort:[{required: true, trigger: 'blur', message: '请输入序号'}],
            state: [{ required: true,trigger: 'change',message: '请选择状态'}],
          },
        }
      } ,
      created(){
        this.initTable();
      },
      methods: {
        onSearchList() {
          this.initTable()
        },
        initTable() {
          this.listLoading = true
          MenuList(this.listQuery).then(response => {
            this.listLoading = false
            this.tableData = response.datas.list
            this.total = response.datas.total
          })
            .catch(error => {
              console.log(error);
            });
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
        handleDelete(row) {
          MessageBox.confirm('此操作将删除数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            DeleteMenu(row.uId)
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
        //主菜单
        addUserDialog(){
          this.FirstDialogVisible = !this.FirstDialogVisible
          Object.keys(this.FirstMenuInfo).forEach(key => this.FirstMenuInfo[key]= '');
          this.FirstMenuInfo.state=0
         },
        FirstUpdateUser(){
          this.FirstMenuInfo.parentid='0'
          this.FirstMenuInfo.type='0'
          AddMenu(this.FirstMenuInfo)
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
          this.FirstDialogVisible = false
          this.$refs.FirstMenuInfo.resetFields();
          Object.keys(this.FirstMenuInfo).forEach(key => this.FirstMenuInfo[key]= '');
          this.FirstMenuInfo.state=0
          this.FirstMenuInfo.parentid='0'
          this.FirstMenuInfo.type='0'
        },
        UpdateUser(){
          this.$refs.menuInfo.validate(valid => {
            if (valid) {
              if (this.dialogTitle === '添加') {
                AddMenu(this.menuInfo)
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
                EditMenu(this.menuInfo).then(response => {
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
        handleEdit(row) {
          this.dialogVisible = true
          this.editInfoMenu = true
          this.dialogTitle = '编辑'
          this.parentBtn = false;
          if(row.type===1){
            this.parentBtn =false
            delete this.rulesInfo.enName
            this.rulesInfo.percode=[{ required: true,trigger: 'blur',message: '请输入权限代码'}]
          }else{
            this.parentBtn = true
            delete this.rulesInfo.percode
            this.rulesInfo.enName=[{ required: true,trigger: 'blur',message: '请输入英文名称'}]
          }
          GetMenu(row.uId)
            .then(response => {
              this.menuInfo = response.datas;
              console.log(response.datas.enName)
            })
            .catch( error => {
              console.log(error);
            });


        },
        handleRoleMenu(row){
          this.dialogVisible = true
          this.dialogTitle = '添加'
          this.menuInfo.state = 0
          this.menuInfo.parentid = row.uId
          if(this.menuInfo.type === '菜单'){
            this.parentBtn = true
          }
        },
        canleDialog(){
          this.dialogVisible = false
          this.$refs.menuInfo.resetFields();
          Object.keys(this.menuInfo).forEach(key => this.menuInfo[key]= '');
        },
        typeSelect(val){
          //1按钮0菜单
          if(val===1){
            this.parentBtn =false
            delete this.rulesInfo.enName
            this.rulesInfo.percode=[{ required: true,trigger: 'blur',message: '请输入权限代码'}]
          }else{
            this.parentBtn = true
            delete this.rulesInfo.percode
            this.rulesInfo.enName=[{ required: true,trigger: 'blur',message: '请输入英文名称'}]
          }
        },
      }
    }

</script>
