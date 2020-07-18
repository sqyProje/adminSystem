<template>
  <div class="app-container">
    <el-form class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="表单名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.approvestatus" placeholder="审批状态">
            <el-option value="" label="全部">全部</el-option>
            <el-option
              v-for="item in approveStatusData"
              :value="item.enumKey"
              :label="item.enumValue"
              :key="item.enumKey">
             {{item.enumValue}}
            </el-option>
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
      </el-form>
    </el-form>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        size  = "small"
        border
      >
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="expand" label="摘要" align="center">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.tableFieldValueModels"
              :key="index">
              <div style="height: 24px;line-height: 24px">
                <el-link :underline="false">{{item.fieldName}}：</el-link>
                <el-link type="info" :underline="false">{{item.fieldValues}}</el-link>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="表单名称" prop="name" align="center"></el-table-column>
        <el-table-column label="发起人" prop="startUserName" align="center"></el-table-column>
        <el-table-column label="状态" prop="approvestatus" align="center">
          <template slot-scope="scope">
            <el-button size="mini" round style="padding: 5px 12px;">{{scope.row.approvestatus | formatState}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="enddate" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createdate" align="center"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleSeek(scope.row)">查看</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="HandleWorkFlow(scope.row)">审批过程</el-button>
            <el-button
              size="mini"
              type="error"
              @click="HandleRepeal(scope.row)">撤销</el-button>
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
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {enumeration} from '@/api/basic'
  import {InitMyList,repeal} from '@/api/approve'
  const defaultListQuery = {
    name: '',
    approvestatus:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        approveStatusData:[]
      }
    } ,
    beforeCreate(){
      let that = this
    },
    created(){
      enumeration('/approveEnum/getApproveStateEnums').then(response=>{
        this.approveStatusData = response.datas
      })
      this.initTable();
    },
    filters:{
      formatState(value){
        if(value===10){
          return '草稿'
        }else if(value===20){
          return '审批中'
        }else if(value===25){
          return '任务审批中'
        }else if(value===30){
          return '待批'
        }else if(value===40){
          return '挂起'
        }else if(value===50){
          return '任务'
        }else if(value===60){
          return '拒绝'
        }else if(value===70){
          return '同意'
        }else if(value===80){
          return '抄送'
        }else if(value===90){
          return '完成审批'
        }
      }
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitMyList(this.listQuery).then(response => {
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
      /*typeStateBg(row){
          if(row.state===0){
            return this.typeStateBtn='info'
          }else if(row.state===1){
            return this.typeStateBtn='primary'
          }else if(row.state===2){
            return this.typeStateBtn='danger'
          }else if(row.state===3){
            return this.typeStateBtn='warning'
          }else if(row.state===4){
            return this.typeStateBtn='success'
          }
      },*/
      handleSeek(row) {
        this.$router.push({name:'see',query: {u_id: row.uId}})
      },
      HandleWorkFlow(row){
        this.$router.push({name:'workflow',query: {u_id: row.uId}})
      },
      HandleRepeal(row){
        repeal(row.uId).then(res=>{
          this.initTable()
          Message({
            message: response.msg,
            type: 'success',
            duration: 3 * 1000
          })
        })
      }
    }
  }

</script>

