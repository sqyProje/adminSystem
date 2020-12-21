<template>
  <div class="app-container filter-container">
    <el-table
      class="basetreetable"
      :data="tableData"
      v-loading="listLoading"
      size  = "small"  max-height="600"
    >
      <el-table-column type="expand" label="摘要" align="center">
        <template slot-scope="scope">
          <div
            v-for="(item,index) in scope.row.tableFieldValueModels"
            :key="index">
            <div v-if="item.fieldType!=150 && item.fieldType!=160" style="height: 24px;line-height: 24px">
              <el-link :underline="false">{{item.fieldName}}：</el-link>
              <el-link type="info" :underline="false">{{item.fieldValues}}</el-link>
            </div>
            <div v-if="item.fieldType==150">
              <el-link :underline="false">{{item.fieldName}}：</el-link>
              <el-image v-for="(img,keys) in item.fieldValues.split(',')"
                        style="width: 100px; height: 100px"
                        :src="img"
                        :key="keys"
                        fit="cover"></el-image>
            </div>
            <div v-if="item.fieldType==160">
              <el-link :underline="false">{{item.fieldName}}：</el-link>
              <el-link type="info" :underline="false" v-for="(filetext,keys) in item.fieldValues.split(',')" :key="keys">
                {{filetext.substring(50,filetext.length)}}<span v-if="keys!= item.fieldValues.split(',').length-1">，</span></el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发起人" prop="userRealName" align="center"></el-table-column>
      <el-table-column label="表单名称" prop="name" align="center"></el-table-column>
      <el-table-column label="当前审批状态" prop="approveStatus" align="center">
        <template slot-scope="scope">
          <div v-html=" $options.filters.formatState(scope.row.approveStatus)"></div>
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
            type="primary"
            v-if="scope.row.approveStatus == '已同意'"
            @click="HandlePrint(scope.row)">打印</el-button>
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
  import {InitOldMyList,repeal} from '@/api/approve'
  const defaultListQuery = {
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
      }
    } ,
    beforeCreate(){
      let that = this
    },
    created(){
      if(this.$route.query.pageNum){
        this.listQuery.pageNum = this.$route.query.pageNum
      }
      this.initTable();
    },
    filters:{
      formatState(value){
        if(value==='审批中'){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #c53535; padding: 5px 12px;'>审批中</el-button>"
        }else if(value==='待审批'){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #FF9900; padding: 5px 12px;'>待审批</el-button>"
        }else if(value==='结束审批'){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #909399; padding: 5px 12px;'>结束审批</el-button>"
        }else if(value==='已撤销'){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #32f50a; padding: 5px 12px;'>已撤销</el-button>"
        }else if(value==='已同意'){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #193dc2; padding: 5px 12px;'>已同意</el-button>"
        }else if(value==='已拒绝'){
          return "<el-button class='el-button el-button--default el-button--mini is-round' style='color: #8156c2; padding: 5px 12px;'>已拒绝</el-button>"
        }
      }
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitOldMyList(this.listQuery).then(response => {
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
      handleSeek(row) {
        this.$router.push({name:'oldsee',query: {u_id: row.approveid,pageNum:this.listQuery.pageNum, formName:'old_myApprove'}})
      },
      HandleWorkFlow(row){
        this.$router.push({name:'oldworkflow',query: {u_id: row.approveid,pageNum:this.listQuery.pageNum, formName:'old_myApprove'}})
      },
      HandlePrint(row){
        this.$router.push({name:'oldprint',query: {u_id: row.approveid,pageNum:this.listQuery.pageNum, formName:'old_myApprove'}})
      }
    }
  }

</script>

