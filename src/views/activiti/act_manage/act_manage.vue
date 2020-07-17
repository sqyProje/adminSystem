<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="listQuery.type_id" placeholder="类型名称" style="width: 100%;">
            <el-option
              v-for="item in dictionTypeDataList"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-date-picker
          size="mini"
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
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
        size  = "small"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="类型名称" prop="typeName"></el-table-column>
        <el-table-column label="表名" prop="formName"></el-table-column>
        <el-table-column label="权限类型">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.isPerUse ? 'warning' : 'success'">
              {{scope.row.isPerUse ? "指定" :"全部"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="部署id" prop="actDeployid"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="操作" fixed="right" width="270px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('act_manage:edit')"
              @click="handleEdit(scope.row)">编辑</el-button>
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
    <!--添加 编辑-->
    <addInfo
      :dialogTitle='dialogTitle'
      @initTableFather = "initTable"
      ref="addInfoSelect">
    </addInfo>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import addInfo from './components/addInfo'
  import {dictionType} from '@/api/basic'
  import {InitFlowList,AddFlowInfo,GetFlowInfo,GetFlowRoleInfo,FindByDeployID} from '@/api/activiti'
  const defaultListQuery = {
    type_id:'',
    name: '',
    startDate:'',
    endDate:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        pickerOptions:{
          onPick:({maxDate,minDate})=>{
            this.listQuery.startDate = minDate
            this.listQuery.endDate = maxDate
          }
        },
        value1:"",
        listQuery: Object.assign({}, defaultListQuery),
        dictionTypeDataList:[],
        tableData:[],
        total: null,
        dialogTitle:'添加去',
      }
    } ,
    created(){
      this.initTable();
      dictionType('0556e14a6dbc49a1bb668421ad570560')
        .then(res=>{
            this.dictionTypeDataList = res.datas
        })
    },
    components:{addInfo},
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitFlowList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
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
      GetFindByDeployID(){
        FindByDeployID().then(response=>{
          this.$refs.addInfoSelect.deployIdData = response.datas
       //   this.$refs.addInfoSelect.AddEditInfo.deployId = this.$refs.addInfoSelect.deployIdData[0].deployId
          this.$refs.addInfoSelect.deployIdChange(this.$refs.addInfoSelect.AddEditInfo.deployId)
        })
      },
      handleAdd(){
        this.$refs.addInfoSelect.dialogVisible = !this.$refs.addInfoSelect.dialogVisible
        this.dialogTitle = '添加'
        Object.keys(this.$refs.addInfoSelect.AddEditInfo).forEach(key => this.$refs.addInfoSelect.AddEditInfo[key]= '');
        GetFlowRoleInfo().then(response=>{
          this.$refs.addInfoSelect.departInfoArray = response.datas.act_custom_depart_models
          this.$refs.addInfoSelect.userInfoArray = response.datas.act_custom_depart_user_models
          this.$refs.addInfoSelect.roleInfoArray = response.datas.act_custom_role_models
        })
        this.$refs.addInfoSelect.AddEditInfo.isPerUse = 0
        dictionType('0556e14a6dbc49a1bb668421ad570560')
          .then(res=>{
            this.$refs.addInfoSelect.dictionTypeData = res.datas
            this.$refs.addInfoSelect.AddEditInfo.type_id =  this.$refs.addInfoSelect.dictionTypeData[0].uId
            this.$refs.addInfoSelect.typeIdChange(this.$refs.addInfoSelect.AddEditInfo.type_id)
          })
        FindByDeployID().then(response=>{
          this.$refs.addInfoSelect.deployIdData = response.datas
          this.$refs.addInfoSelect.AddEditInfo.deployId = this.$refs.addInfoSelect.deployIdData[0].deployId
          this.$refs.addInfoSelect.deployIdChange(this.$refs.addInfoSelect.AddEditInfo.deployId)
        })
      },
      handleEdit(row) {
        this.$refs.addInfoSelect.dialogVisible = !this.$refs.addInfoSelect.dialogVisible
        Object.keys(this.$refs.addInfoSelect.AddEditInfo).forEach(key => this.$refs.addInfoSelect.AddEditInfo[key]= '')
        this.$refs.addInfoSelect.checkedDepart=[]
        this.$refs.addInfoSelect.checkedUser=[]
        this.$refs.addInfoSelect.checkedRole=[]
        this.dialogTitle = '编辑'
        GetFlowInfo(row.uId).then(response=>{
          dictionType('0556e14a6dbc49a1bb668421ad570560')
            .then(res=>{
              this.$refs.addInfoSelect.dictionTypeData = res.datas
              this.$refs.addInfoSelect.typeIdChange(response.datas.actCustomFlowManage.typeId)
            })
          this.$refs.addInfoSelect.AddEditInfo.m_id = row.uId
          this.$refs.addInfoSelect.AddEditInfo.name = response.datas.actCustomFlowManage.name
          this.$refs.addInfoSelect.AddEditInfo.type_id = response.datas.actCustomFlowManage.typeId
          this.$refs.addInfoSelect.AddEditInfo.sketch = response.datas.actCustomFlowManage.sketch
          this.$refs.addInfoSelect.AddEditInfo.isPerUse = response.datas.actCustomFlowManage.isPerUse
          this.$refs.addInfoSelect.AddEditInfo.deployId = response.datas.actCustomFlowManage.actDeployid
          this.$refs.addInfoSelect.AddEditInfo.key=response.datas.actCustomFlowManage.processkey
          this.$refs.addInfoSelect.AddEditInfo.p_id=response.datas.actCustomFlowManage.processdefineid
          this.$refs.addInfoSelect.AddEditInfo.formId = response.datas.actCustomFlowManage.formid
          this.$refs.addInfoSelect.departInfoArray=response.datas.act_custom_depart_models
          this.$refs.addInfoSelect.roleInfoArray=response.datas.act_custom_role_models
          this.$refs.addInfoSelect.userInfoArray=response.datas.act_custom_depart_user_models
          this.findAllChildren(this.$refs.addInfoSelect.departInfoArray,
            this.$refs.addInfoSelect.resourceCheckedKey,
            this.$refs.addInfoSelect.checkedDepart)
          this.findUserChildren(this.$refs.addInfoSelect.userInfoArray,
            this.$refs.addInfoSelect.userCheckedKey,
            this.$refs.addInfoSelect.checkedUser)
          this.findRoleChildren(this.$refs.addInfoSelect.roleInfoArray,
            this.$refs.addInfoSelect.roleCheckedKey,
            this.$refs.addInfoSelect.checkedRole)

          this.$refs.addInfoSelect.isPerSelect(this.$refs.addInfoSelect.AddEditInfo.isPerUse)
          this.GetFindByDeployID()
        })
      },
      //遍历选中子节点
      //部门
      findAllChildren(data,CheckedId,CheckDataItem){
        data.forEach((item,index)=>{
          if(item.children.length !== 0){
            if(item.selected){
              CheckedId.push(item.d_id)
              CheckDataItem.push({'name':item.name,'d_id':item.d_id})
            }
            item.children.forEach(childitem =>{
              if(childitem.selected){
                CheckedId.push(childitem.d_id)
                CheckDataItem.push({'name':childitem.name,'d_id':childitem.d_id})
                this.$refs.addInfoSelect.AddEditInfo.departArrays=CheckedId
              }
            })
          }else if(item.children.length ===0){
            if(item.selected){
              CheckedId.push(item.d_id)
              CheckDataItem.push({'name':item.name,'d_id':item.d_id})

            }
          }
        })
      },
      //部门用户
      findUserChildren(data,CheckedId,CheckDataItem){
        data.forEach((item,index)=>{
          if(item.children.length !== 0){
            item.children.forEach(childitem =>{
              if(childitem.selected){
                CheckedId.push(childitem.d_id)
                CheckDataItem.push({'name':childitem.name,'d_id':childitem.d_id})
                this.$refs.addInfoSelect.AddEditInfo.userArrays=CheckedId
              }
            })
          }
        })
      },
      //角色
      findRoleChildren(data,CheckedId,CheckDataItem){
        data.forEach((item,index)=>{
          if(item.selected){
            CheckedId.push(item.d_id)
            CheckDataItem.push({'name':item.name,'d_id':item.d_id})
            this.$refs.addInfoSelect.AddEditInfo.roleArrays=CheckedId
          }
        })
      },
    }
  }

</script>
<style scoped>
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }
  .out-border {
    border: 1px solid #DCDFE6;
    margin-bottom: 10px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
