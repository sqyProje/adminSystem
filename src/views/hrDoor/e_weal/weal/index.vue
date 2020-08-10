<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-form-item label ='名称'>
            <el-select v-model="listQuery.wealNameId" placeholder="名称">
              <el-option
                v-for="item in wealNameData"
                :key="item.uId"
                :value="item.uId"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
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
              @click="handleAdd">
              添加</el-button>
            <el-button
              type="warning"
              size="small"
              @click="ExportFun">
              导出</el-button>
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
        <el-table-column label="序号" prop="number"></el-table-column>
        <el-table-column label="表单名称" prop="name"></el-table-column>
        <el-table-column label="部门" prop="departName"></el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="发放标准" prop="grantstandard"></el-table-column>
        <el-table-column label="人员性质" prop="property">
          <template slot-scope="scope">
            {{ scope.row.property | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
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
          <el-form-item label ='选择员工'>
            <el-button size="small" v-on:click.native="userRole" type="primary">选择员工</el-button>
          </el-form-item>
        <el-form-item label ='表单名称'  prop="wealNameId">
          <el-select v-model="AddEditInfo.wealNameId" placeholder="表单名称" :disabled="disabledFlag" style="width:100%">
            <el-option
              v-for="item in wealNameData"
              :key="item.uId"
              :value="item.uId"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='发放标准'  prop="grantStandard">
          <el-input type="number" v-model="AddEditInfo.grantStandard" :min="0.00" :step="0.01"></el-input>
        </el-form-item>
        <el-form-item label ='排序'>
          <el-input type="number" v-model="AddEditInfo.sort" :min="0" :disabled="disabledFlag"></el-input>
        </el-form-item>
        <el-form-item label ='状态'>
          <el-select v-model="AddEditInfo.state" placeholder="状态" :disabled="disabledFlag" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="" @click="canleDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择员工-->
    <el-dialog
      title="选择员工"
      :close-on-click-modal="false"
      :visible.sync="RoleDialogVisible"
      width="33%">
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
    <!--导出 弹出框-->
    <el-dialog
      title="导出"
      :close-on-click-modal="false"
      :visible.sync="dialogExcelVisible"
      width="23%">
        <el-select v-model="wealName" placeholder="请选择表单名称" style="width:100%">
          <el-option
            v-for="item in wealNameData"
            :key="item.uId"
            :value="item.uId"
            :label="item.name"
          ></el-option>
        </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="" @click="dialogExcelVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="UpdateExcelUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {importExcel} from '@/api/basic'
  import {wealName,WealList,AddWeal,GetWeal,EditWeal,DeleteWeal,departEmployee,wealExcel} from '@/api/personnel'
  const defaultListQuery = {
    wealNameId:'',
    pageNum:1,
    pageSize:10
  }

  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        listLoading:false,
        dialogTitle:'',
        dialogVisible: false,
        dialogExcelVisible:false,
        disabledFlag:false,
        wealNameData:[],
        AddEditInfo:{
          employeeIds:[],
          wealNameId:'',
          grantStandard:'',
          sort:'',
          state:''
        },
        stateData:[
          { id: 0, display_name: '不显示'},
          { id: 1, display_name: '显示'}
        ],
        rulesInfo: {
          employeeIds: [{ required: true,trigger: 'blur',message: '请选择员工'}],
          wealNameId:[{required: true, trigger: 'blur', message: '请选择名称'}],
          grantStandard:[{required: true, trigger: 'blur', message: '请输入发放标准'}],
          sort:[{required: true, trigger: 'blur', message: '请输入排序'}],
          state:[{ required: true,trigger: 'blur',message: '请选择状态'}]
        },
        wealName:'',
        RoleDialogVisible:false,
        roleData:[],
        resourceCheckedKey:[],
        defaultProps: {
          children: 'children',
          label: 'name',
        }
      }
    } ,
    created(){
      this.initTable();
      wealName().then(res=>{
        this.wealNameData = res.datas
      })
    },
    filters:{
      formatStatus(value){
        if(value===10){
          return '编内'
        }else if(value===20){
          return '借调'
        }else if(value===30){
          return '合同'
        }else if(value===40){
          return '临时'
        }else if(value===50){
          return '返聘'
        }else if(value===60){
          return '外聘'
        }else if(value===70){
          return '编内'
        }
      }
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        WealList(this.listQuery).then(response => {
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
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.state=1
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.disabledFlag = true
        this.dialogTitle = '编辑'
        GetWeal(row.uId).then(response=>{
          this.AddEditInfo.uId=response.datas.uId
          this.AddEditInfo.employeeIds=response.datas.employeeid
          this.AddEditInfo.sort=response.datas.sort
          this.AddEditInfo.state=response.datas.state
          this.AddEditInfo.wealNameId= response.datas.wealnameid
          this.AddEditInfo.grantStandard= response.datas.grantstandard
          this.AddEditInfo.grantstandard= response.datas.grantstandard
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              if(this.AddEditInfo.employeeIds.length<=0){
                this.AddEditInfo.employeeIds=[]
              }
              AddWeal(this.AddEditInfo)
                .then(response => {
                  this.dialogVisible = false
                  if (response.status === 0) {
                    this.initTable();
                    this.leftTree()
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
              this.AddEditInfo.grantstandard = this.AddEditInfo.grantStandard
              EditWeal(this.AddEditInfo).then(response => {
                if (response.status === 0) {
                  this.dialogVisible = false
                  this.initTable();
                  this.leftTree()
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
          DeleteWeal(row.uId)
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
        this.disabledFlag = false
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      ExportFun(){
        this.dialogExcelVisible = true
      },
      UpdateExcelUser(){
        if(this.wealName!==''){
          wealExcel(this.wealName).then(res=>{
            importExcel(res)
            this.dialogExcelVisible = false
          })
        }else{
          Message({
            message: '请先选择表单名称',
            type: 'success',
            duration: 3 * 1000
          })
        }
      },
      //选择用户
      userRole(){
        this.RoleDialogVisible = true
        departEmployee().then(response=>{
          response.datas.forEach((res,key)=>{
            this.roleData.push({id:key,name:res.name,children:[]})
            res.employee.forEach((child)=>{
              this.roleData[key].children.push({id:child.uId,name:child.realname,selected:child.selected})
            })
            res.childMenu.forEach((child,two)=>{
              this.roleData[key].children.push({id:two,name:child.name,children:[]})
              console.log( this.roleData[key].children[two])
              child.employee.forEach((three)=>{
                this.roleData[key].children[two].children.push({id:three.uId,name:three.realname,selected:three.selected})
              })
            })
          })
          this.resourceCheckedKey = this.AddEditInfo.employeeIds.split(',')

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
        this.AddEditInfo.employeeIds= checkedKeys
        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
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


