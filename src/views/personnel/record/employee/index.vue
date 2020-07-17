<template>
  <div class="app-container">
    <search-tree
      :toChildId="listQuery.departId"
      :toChildTree="departData"
      @childFnToParent="childFnInfo"
    ></search-tree>
    <el-col :span="21">
      <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.realName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.stationId"
            placeholder="岗位名称"
            @change="stationTrigger"
            style="width: 100%;">
            <el-option
              v-for="item in stationData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
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
              v-if="hasPerm('employee:add')"
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
        <el-table-column label="姓名" prop="realname"></el-table-column>
        <el-table-column label="部门名称" prop="departname"></el-table-column>
        <el-table-column label="任职时间" prop="officedate"></el-table-column>
        <el-table-column label="部门名称" prop="departname"></el-table-column>
        <el-table-column label="岗位名称" prop="stationname"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="hasPerm('employee:details')"
              @click="handleViewOrder(scope.row)">详细信息</el-button>
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('employee:edit')"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="hasPerm('employee:deletes')"
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
    </el-col>
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
        <el-form-item label ='头像'>
          <singleUpload  v-model="AddEditInfo.picpath" @input="picFun"></singleUpload>
        </el-form-item>
        <el-form-item label ='姓名'  prop="realname">
          <el-input v-model="AddEditInfo.realname"></el-input>
        </el-form-item>
        <el-form-item label ='部门名称'  prop="departname">
          <el-select
            v-model="AddEditInfo.departname"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option value="1" style="height: auto">
              <el-tree
                :data="departData"
                node-key="uId"
                @node-click="departNodeClick"
                :props="defaultProps">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ="职务名称"  prop="dutyname">
          <el-select
            v-model="AddEditInfo.dutyname"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option value="2" style="height: auto">
              <el-tree
                :data="dutyData"
                node-key="uId"
                @node-click="dutyNodeClick"
                :props="defaultProps">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ="岗位名称"  prop="stationname">
          <el-select
            v-model="AddEditInfo.stationname"
            placeholder="岗位名称"
            @change="stationTrigger"
            style="width: 100%;">
            <el-option
              v-for="item in stationData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='任职时间'  prop="officedate">
          <el-date-picker
            style="width: 100%;"
            v-model="AddEditInfo.officedate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='在职状态'>
          <el-select v-model="AddEditInfo.jobstate" placeholder="在职状态" style="width: 100%;">
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
  import {Message,MessageBox} from 'element-ui'
  import {EmployeeList,AddEmployee,GetEmployee,EditEmployee,DeleteEmployee
  ,GetDepartInfoArray,GetStationDrop,GetDutyInfoArray} from '@/api/personnel'
  import singleUpload from '@/components/Upload/singleImg'
  import SearchTree from '@/components/LeftSearchTree/searchtree'
  const defaultListQuery = {
    realName: '',
    departId:'',
    stationId:'',
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
        AddEditInfo:{
          uId:'',
          picpath:'',
          realname:'',
          departname:'',
          departid:'',
          stationname:'',
          stationid:'',
          dutyname:'',
          dutyid:'',
          officedate:'',
          jobstate:'',
        },
        stateData:[
          { id: 0, display_name: '在职'},
          { id: 1, display_name: '离职'},
          { id: 2, display_name: '退休'}
        ],
        departData:[],
        dutyData:[],
        stationData:[],
        defaultProps: {
          children: 'childMenu',
          label: 'name'
        },
        rulesInfo: {
          realname: [{ required: true,trigger: 'blur',message: '请输入姓名'}],
          departname:[{ required: true,trigger: 'blur',message: '请选择部门'}],
          dutyname:[{ required: true,trigger: 'blur',message: '请选择职务名称'}],
          stationname	:[{ required: true,trigger: 'blur',message: '请选择岗位名称'}],
          officedate:[{ required: true,trigger: 'blur',message: '请选择任职时间'}],
          jobstate:[{required: true, trigger: 'blur', message: '请选择在职状态'}],
        },

      }
    } ,
    components:{
      singleUpload,SearchTree
    },
    created(){
      this.initTable();
      this.departFu()
      this.dutyFu()
      GetStationDrop().then(response=>{
        this.stationData = response.datas
      })
    },
    methods: {
      picFun(data){
        this.AddEditInfo.picpath = data
      },
      departFu(){
        GetDepartInfoArray().then(response=>{
          response.datas.forEach(item=>{
            this.departData.push(item)
          })
        })
      },
      dutyFu(){
        GetDutyInfoArray().then(response=>{
          this.dutyData.push(response.datas[0])
        })
      },
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        EmployeeList(this.listQuery).then(response => {
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
        this.AddEditInfo.jobstate=0
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetEmployee(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          console.log(this.AddEditInfo)
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddEmployee(this.AddEditInfo)
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
              EditEmployee(this.AddEditInfo).then(response => {
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
          DeleteEmployee(row.uId)
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
      handleViewOrder(row){
        this.$router.push({name:'detail',query: {uId: row.uId}})
      },
      stationTrigger(val){
        this.AddEditInfo.stationname = val ? this.stationData.find(ele => ele.uId === val).name : ''
        this.AddEditInfo.stationid = val
      },
      departNodeClick(val){
        this.AddEditInfo.departid = val.uId
        this.AddEditInfo.departname = val.name
      },
      dutyNodeClick(val){
        this.AddEditInfo.dutyid = val.uId
        this.AddEditInfo.dutyname = val.name
      },
      childFnInfo(payload){
        this.listQuery.departId = payload
        this.initTable(this.listQuery);
      }
    }
  }

</script>


