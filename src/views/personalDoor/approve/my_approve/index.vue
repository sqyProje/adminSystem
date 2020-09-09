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
        size  = "small"  max-height="600"
        border
      >
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

            <div v-html=" $options.filters.formatState(scope.row.approvestatus)"></div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdate" align="center"></el-table-column>
        <el-table-column label="结束时间" prop="enddate" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="300" align="left">
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
              v-if="scope.row.approvestatus !=10 && scope.row.approvestatus !=60 && scope.row.approvestatus !=90"
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
      console.log(43)
      this.initTable();
    },
    filters:{
      formatState(value){
        if(value===10){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #c53535; padding: 5px 12px;'>撤销</el-button>"
        }else if(value===20){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #FF9900; padding: 5px 12px;'>审批中</el-button>"
        }else if(value===25){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #909399; padding: 5px 12px;'>任务审批中</el-button>"
        }else if(value===30){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #32f50a; padding: 5px 12px;'>待批</el-button>"
        }else if(value===40){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #193dc2; padding: 5px 12px;'>挂起</el-button>"
        }else if(value===50){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #8156c2; padding: 5px 12px;'>任务</el-button>"
        }else if(value===60){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #c199c2; padding: 5px 12px;'>拒绝</el-button>"
        }else if(value===70){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #c2077a; padding: 5px 12px;'>同意</el-button>"
        }else if(value===80){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #193dc2; padding: 5px 12px;'>抄送</el-button>"
        }else if(value===90){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: rgba(194,75,77,0.67); padding: 5px 12px;'>完成审批</el-button>"
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
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        })
      }
    }
  }

</script>

