<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="listQuery.realName" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="listQuery.departName"
                placeholder="请选择部门"
                ref="departName"
                style="width: 100%">
                <el-option :value="listQuery.departName" style="height: auto;padding:0">
                  <el-tree
                    :data="departData"
                    node-key="uId"
                    @node-click="departNodeClick"
                    :props="defaultProps">
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="listQuery.dutyName"
                placeholder="请选择职务"
                ref="dutyName"
                style="width: 100%"
              >
                <el-option :value="listQuery.dutyName" style="height: auto;padding:0">
                  <el-tree
                    :data="dutyData"
                    node-key="uId"
                    @node-click="dutyNodeClick"
                    :props="defaultProps">
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="listQuery.stationId"
                placeholder="请选择岗位名称"
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
              <el-input v-model="listQuery.shortPhone" placeholder="短号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="listQuery.phone" placeholder="手机号"></el-input>
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
          </el-form>
          <div class="grid-content" v-show="tableDataCheckFlag">
            <el-table
              :data="tableDataCheck"
              v-loading="listLoadingCheck"
              size  = "small"  max-height="600"
              border
            >
              <el-table-column label="姓名" prop="realname"></el-table-column>
              <el-table-column label="部门" prop="departName"></el-table-column>
              <el-table-column label="职务" prop="duty"></el-table-column>
              <el-table-column label="岗位" prop="station"></el-table-column>
              <el-table-column label="短号" prop="shortPhone"></el-table-column>
              <el-table-column label="手机号" prop="phone"></el-table-column>
              <el-table-column label="邮箱" prop="email"></el-table-column>
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
        <el-col :span="24"  v-show="!tableDataCheckFlag">
          <div class="grid-content">
            <el-table
              :data="tableData"
              v-loading="listLoading"
              row-key="id"
              default-expand-all
              :tree-props="{children:'children',hasChildren:'hasChildren'}"
              size  = "small"  max-height="600"
              border
            >
              <el-table-column label="部门/姓名" prop="name"></el-table-column>
              <el-table-column label="职务" prop="duty"></el-table-column>
              <el-table-column label="岗位" prop="station"></el-table-column>
              <el-table-column label="短号" prop="shortPhone"></el-table-column>
              <el-table-column label="手机号" prop="phone"></el-table-column>
              <el-table-column label="邮箱" prop="email"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {addressList,addressCheckList} from '@/api/address'
  import {GetDepartInfoArray,GetStationDrop,GetDutyInfoArray} from '@/api/personnel'

  const defaultListQuery = {
    realName: '',
    departId:'',
    dutyId:'',
    stationId:'',
    departName:'',
    dutyName:'',
    stationName:'',
    phone:'',
    shortPhone:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableDataCheck:[],
        total: null,
        listLoading:false,
        tableData:[],
        listLoadingCheck:false,
        i:1,
        tableDataCheckFlag:false,
        departData:[],
        dutyData:[],
        stationData:[],
        defaultProps: {
          children: 'childMenu',
          label: 'name'
        },
      }
    } ,
    created(){
      GetDutyInfoArray().then(response=>{
        this.dutyData.push(response.datas[0])
      })
      GetDepartInfoArray().then(response=>{
        response.datas.forEach(item=>{
          this.departData.push(item)
        })
      })
      GetStationDrop().then(response=>{
        this.stationData = response.datas
      })
      this.initTable()
    },
    methods: {
      onSearchList() {
        this.initTableCheck()
        this.tableDataCheckFlag = true
      },
      initTable() {
        this.listLoading = true
        addressList().then(response => {
          this.listLoading = false
          response.datas.forEach((res,key)=>{
            this.tableData.push({id:this.i++,name:res.name,children:[]})
            res.employees.forEach((child)=>{
              this.tableData[key].children.push({
                id:child.uId,
                name:child.realname,
                email:child.email,
                duty:child.duty,
                phone:child.phone,
                picPath:child.picPath,
                station:child.station,
                shortPhone:child.shortPhone,
                selected:child.selected
              })
            })
            res.childMenu.forEach((child,two)=>{
              this.tableData[key].children.push({id:this.i++,name:child.name,children:[]})
              child.employees.forEach((three)=>{
                this.tableData[key].children[two].children.push({
                  id:three.uId,
                  name:three.realname,
                  email:three.email,
                  duty:three.duty,
                  phone:three.phone,
                  picPath:three.picPath,
                  station:three.station,
                  shortPhone:three.shortPhone,
                  selected:three.selected
                })
              })
            })
          })
        })
      },
      initTableCheck() {
        this.listLoadingCheck = true
        addressCheckList(this.listQuery).then(response => {
          this.listLoadingCheck = false
          this.tableDataCheck = response.datas.list
          this.total = response.datas.total
        })
          .catch(error => {
            console.log(error);
          });
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.tableDataCheckFlag = false
        this.initTableCheck();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.initTableCheck();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.initTableCheck();
      },
      departNodeClick(val){
        this.listQuery.departId = val.uId
        this.listQuery.departName = val.name
        this.$refs.departName.blur();
      },
      dutyNodeClick(val){
        this.listQuery.dutyId = val.uId
        this.listQuery.dutyName = val.name
        this.$refs.dutyName.blur();
      },

    }
  }

</script>


