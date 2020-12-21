<template>
  <div class="app-container">
    <search-tree
      :toChildId="listQuery.departId"
      :toChildTree="departData"
      @childFnToParent="childFnInfo"
    ></search-tree>
    <el-col :xs="16" :sm="18" :md="21">
      <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item v-if="!dateInfo">
          <el-input v-model="listQuery.realName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item v-if="!dateInfo">
          <el-select
            v-model="listQuery.stationId"
            placeholder="岗位名称"
            filterable
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
        <el-form-item v-if="!dateInfo">
          <el-button type="primary" @click="onSearchList"  size="small">查询</el-button>
          <el-button
            type="warning"
            @click="handleResetSearch()"
            size="small">
            重置
          </el-button>
        </el-form-item>
        <el-form-item v-if="dateInfo">
          <el-select
            v-model="listQuery.type"
            placeholder="有责日期状态"
            style="width: 100%;">
            <el-option
              v-for="item in typeData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dateInfo">
          <el-button type="primary" @click="onSearchListDate"  size="small">有责日期查询</el-button>
        </el-form-item>
        <el-col>
          <el-form-item>
            <el-button
              type="success"
              size="small"
              v-if="hasPerm('employee:add')"
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
        class="basetreetable"
        :data="tableData"
        v-loading="listLoading"
        size  = "small"
        max-height="600"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="姓名" prop="realname"></el-table-column>
        <el-table-column label="部门名称" prop="departname"></el-table-column>
        <el-table-column label="任职时间" prop="officedate"></el-table-column>
        <el-table-column label="岗位名称" prop="stationname"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="360">
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
              type="primary"
              @click="handleStation(scope.row)">岗位调动</el-button>
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
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="dialogVisible"
      width="26%">
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
            ref="departname"
          >
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterDepart"
              clearable>
            </el-input>
            <el-option :value="AddEditInfo.departname" style="height: auto;padding:0">
              <el-tree
                :data="departData"
                node-key="uId"
                @node-click="departNodeClick"
                ref="DepartTree"
                :filter-node-method="filterNode"
                :props="defaultProps">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ="职务名称"  prop="dutyname">
          <el-select
            v-model="AddEditInfo.dutyname"
            placeholder="请选择"
            style="width: 100%;padding: 0;"
            ref="dutyname"
          >
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterDuty"
              clearable>
            </el-input>
            <el-option :value="AddEditInfo.dutyname" style="height: auto;padding:0">
              <el-tree
                :data="dutyData"
                node-key="uId"
                ref="DutyTree"
                @node-click="dutyNodeClick"
                :filter-node-method="filterNode"
                :props="defaultProps">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ="岗位名称"  prop="stationname">
          <el-select
            v-model="AddEditInfo.stationname"
            filterable
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
        <el-form-item label ="关联用户">
          <el-select
            filterable
            clearable
            v-model="AddEditInfo.userId"
            placeholder="关联用户"
            style="width: 100%;">
            <el-option
              v-for="item in userIdData"
              :label="item.realname +'（'+item.phone+'）'"
              :value="item.uId"
              :key = "item.uId"
            >{{item.realname}}（{{item.phone}}）</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='调动原因' v-show="sketchFlag">
          <el-input v-model="AddEditInfo.sketch"></el-input>
        </el-form-item>
        <el-form-item label ='任职时间'>
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
    <el-dialog
      title="岗位调动信息"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="stationFlag"
      width="70%">
      <stationmove :employeeIds ='employeeId'></stationmove>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" @click="canleDialogFlag">关  闭</el-button>
      </span>
    </el-dialog>
    <!--导出 弹出框-->
    <el-dialog
      title="导出"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="dialogExcelVisible"
      width="23%">
      <el-select v-model="wealName" placeholder="请选择岗位名称" style="width:100%">
        <el-option
          v-for="item in stationData"
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
  import {EmployeeList,AddEmployee,GetEmployee,EditEmployee,DeleteEmployee
  ,GetDepartInfoArray,GetStationDrop,GetDutyInfoArray,excelByDuty} from '@/api/personnel'
  import {userDrop} from '@/api/menu-pers'
  import singleUpload from '@/components/Upload/singleImg'
  import SearchTree from '@/components/LeftSearchTree/searchtree'
  import stationmove from './Item/stationmove'
  const defaultListQuery = {
    realName: '',
    departId:'',
    stationId:'',
    type:'',
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
        dialogExcelVisible:false,
        stationFlag:false,
        employeeId:'',
        sketchFlag:false,
        AddEditInfo:{
          uId:'',
          picpath:'',
          realname:'',
          departname:'',
          departid:'',
          stationname:'',
          sketch:'',
          stationid:'',
          dutyname:'',
          dutyid:'',
          officedate:'',
          jobstate:'',
        },
        stateData:[
          { id: 0, display_name: '在职'},
          { id: 1, display_name: '辞职'},
          { id: 2, display_name: '退休'},
          { id: 3, display_name: '停薪留职'},
          { id: 4, display_name: '死亡'}
        ],
        typeData:[
          { id: '1', display_name: '试用期'},
          { id: '2', display_name: '转正'},
          { id: '3', display_name: '身份证'},
          { id: '4', display_name: '合同'}
        ],
        departData:[],
        dutyData:[],
        stationData:[],
        userIdData:[],
        defaultProps: {
          children: 'childMenu',
          label: 'name'
        },
        rulesInfo: {
          realname: [{ required: true,trigger: 'blur',message: '请输入姓名'}],
          departname:[{ required: true,trigger:['blur','change'],message: '请选择部门'}],
          dutyname:[{ required: true,trigger: ['blur','change'],message: '请选择职务名称'}],
          stationname	:[{ required: true,trigger: 'blur',message: '请选择岗位名称'}],
          jobstate:[{required: true, trigger: 'blur', message: '请选择在职状态'}],
        },
        wealName:'',
        filterDepart:'',
        filterDuty:''
      }
    } ,
    components:{
      singleUpload,SearchTree,stationmove
    },
    computed:{
      dateInfo(){
       return this.$route.query.bool
     },
    },
    created(){
      this.departFu()
      this.dutyFu()
      GetStationDrop().then(response=>{
        this.stationData = response.datas
      })
      userDrop().then(response=>{
        this.userIdData = response.datas
      })
    },
    watch:{
      $route: {
        handler() {
          if(this.$route.query.keyvalue) {
          //  console.log(typeof(this.$route.query.keyvalue) )
            const queryvalue=this.$route.query.keyvalue
            this.listQuery.type = queryvalue
            this.initTable();
            //深度监听，同时也可监听到param参数变化
          }else{
          //  console.log(2)
            if(this.$route.query.pageNum){
              this.listQuery.pageNum = this.$route.query.pageNum
            }
            this.listQuery.type = ''
            this.initTable();
          }
        },
        deep: true,
        immediate:true
      },
      filterDepart(val) {
        this.$refs.DepartTree.filter(val);
      },
      filterDuty(val) {
        this.$refs.DutyTree.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
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
          response.datas.forEach(item=> {
            this.dutyData.push(item)
          })
        })
      },
      handleStation(row){
        this.stationFlag = true
        this.employeeId =row.uId

      },
      onSearchList() {
        this.initTable()
      },
      onSearchListDate(){
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        EmployeeList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
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
      handleAdd(){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.jobstate=0
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.sketchFlag = false
        this.dialogTitle = '编辑'
        GetEmployee(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
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
              let totalPage = Math.ceil((this.total - 1)/this.listQuery.pageSize);
              let currentPage = this.listQuery.pageNum > totalPage ? totalPage : this.listQuery.pageNum;
              this.listQuery.pageNum = this.listQuery.pageNum < 1 ? 1 : currentPage;
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
      canleDialogFlag(){
        this.stationFlag = false
      },
      handleViewOrder(row){
        this.$router.push({name:'detail',
          query: {
            uId: row.uId,
            bool:this.$route.query.bool,
            keyvalue:this.$route.query.keyvalue,
            pageNum:this.listQuery.pageNum
          }
        })
        //,pageNum:this.listQuery.pageNum
      },
      stationTrigger(val){
        this.AddEditInfo.stationname = val ? this.stationData.find(ele => ele.uId === val).name : ''
      //  this.AddEditInfo.stationid = val
        if(this.AddEditInfo.stationid !==val ){
          this.sketchFlag = true
          this.AddEditInfo.stationid = val
        }else{
          this.sketchFlag = false
        }
      },
      departNodeClick(val){
        this.AddEditInfo.departid = val.uId
        this.AddEditInfo.departname = val.name
        this.$refs.departname.blur();
        this.filterDepart=''
      },
      dutyNodeClick(val){
        this.AddEditInfo.dutyid = val.uId
        this.AddEditInfo.dutyname = val.name
        this.$refs.dutyname.blur();
        this.filterDuty=''
      },
      childFnInfo(payload){
        this.listQuery.departId = payload.uId
        this.listQuery.pageNum = 1
        this.initTable(this.listQuery);
      },
      /*导出*/
      ExportFun(){
        this.dialogExcelVisible = true
      },
      UpdateExcelUser(){
        if(this.wealName!==''){
          excelByDuty(this.wealName).then(res=>{
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
    }
  }

</script>


