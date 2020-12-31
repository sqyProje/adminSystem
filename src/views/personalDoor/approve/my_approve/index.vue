<template>
  <div class="app-container filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="表单名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.contentKey" placeholder="审批关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.approveStatus" placeholder="审批状态">
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
          <el-button
            type="success"
            size="small"
            @click="handleAll">
            批量打印</el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="basetreetable"
        :data="tableData"
        v-loading="listLoading"
        size  = "small"  max-height="600"
        default-expand-all
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
        <el-table-column label="发起人" prop="startUserName" align="center"></el-table-column>
        <el-table-column label="表单名称" prop="name" align="center"></el-table-column>
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
              type="info"
              v-if="scope.row.approvestatus == 60"
              @click="HandleSubmitRepeat(scope.row)">重新提交</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.approvestatus !=10 && scope.row.approvestatus !=60 && scope.row.approvestatus !=90"
              @click="HandleRepeal(scope.row)">撤销</el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.approvestatus == 90"
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
  import {InitMyList,repeal,PrintAll} from '@/api/approve'
  const defaultListQuery = {
    name: '',
    contentKey:'',
    approveStatus:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        approveStatusData:[],
        selectedData:[],
      }
    } ,
    beforeCreate(){
      let that = this
    },
    created(){
      enumeration('/approveEnum/getApproveStateEnums').then(response=>{
        this.approveStatusData = response.datas
      })
      if(this.$route.query.pageNum){
        this.listQuery.pageNum = this.$route.query.pageNum
      }
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
        this.$router.push({
          name: 'see',
          query: {u_id: row.uId, pageNum: this.listQuery.pageNum, formName: 'my_approve'}
        })
      },
      HandleWorkFlow(row) {
        this.$router.push({
          name: 'workflow',
          query: {u_id: row.uId, pageNum: this.listQuery.pageNum, formName: 'my_approve'}
        })
      },
      HandleRepeal(row) {
        repeal(row.uId).then(res => {
          this.initTable()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        })
      },
      HandleSubmitRepeat(row) {
        this.$router.push({
          name: 'sub_approve_fields',
          query: {u_id: row.uId, form_id: row.tableFromId, form_name: row.name}
        })
      },
      HandlePrint(row) {
        this.$router.push({
          name: 'print',
          query: {u_id: row.uId, pageNum: this.listQuery.pageNum, formName: 'my_approve'}
        })
      },
      handleSelectionChange(data) {
        this.selectedData = data;
      },
      handleAll() {
        let dataSelect = this.selectedData;
        let ids = ''
        dataSelect.forEach((value, keys) => {
          ids += value.uId + ','
        })
        let selectStr = ids.substring(0, ids.length - 1)
        PrintAll(selectStr).then(response => {
          let fileData = response.datas.tableFormTableFieldContentModel
          let workData = response.datas.approveStepCourseParentModels
          let otherInfo = {
            name: fileData.name,
            approveId: fileData.approveId,
            departName: fileData.departName,
            checkDate: fileData.checkDate,
            checkRealName: fileData.checkRealName,
          }
          let ProcessData =[]
          fileData.tableFieldValueModels.forEach((item, index) => {
            if (item.fieldType != 150 && item.fieldType != 160) {
               ProcessData.push(item)
            }
          })
          let printContTop = '';
          let printContMiddle = '';
          let printHead = `
            <html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><link rel='stylesheet' type='text/css' href='static/print.css'></head><body>
            <div class="printContainer">
            <h3>${otherInfo.name}</h3>
            <div class='clearfix'>
              <span class='left'>部门名称：${otherInfo.departName}</span>
              <span class='right'>审批编号：${otherInfo.approveId}</span>
            </div>
            <table class='progress-table two-table' cellspacing='0' cellpadding='0'>`;
          ProcessData.forEach((item, keys) => {
            printContTop += `<tr><td class='fieldName'>${item.fieldName}</td><td  class="fieldValues">${item.fieldValues}</td></tr>`;
          })
          workData.forEach((items, keys) => {
            printContMiddle += `<tr><td class="fieldName">${ items.courseName}</td><td style="display: block" class="fieldValues"><div>`;
              items.approveStepCourseModels.forEach((itemchild, index)=>{
                printContMiddle+=`
                <span class="left">${itemchild.courseUserName}</span>
                <span class="signPic" ${itemchild.courseUserPic.length>0 ?'class="signHide"':''}><img  src="${itemchild.courseUserPic}"></span>
                <span class="right" style="margin-right: 40px">${itemchild.approveDate!==null ? itemchild.approveDate: ''}</span>`
          })
            printContMiddle+=`</div></td></td></tr>`
          })
          let pageNextStr = `<div style="page-break-after: always;"></div>`;
          let last = `</table><div class="clearfix">
              <span class="left">查看人：${otherInfo.checkRealName}</span>
              <span class="right">查看日期：${otherInfo.checkDate}</span>
              </div></div>${pageNextStr}</div></body></html>`;
          let newContent = printHead + printContTop + printContMiddle + last;
          /*window.print();
            this.$router.go(0)*/
          document.body.innerHTML = newContent;
        })
      }
    }
  }

</script>

