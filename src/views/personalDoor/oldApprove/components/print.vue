<template>
  <div class="app-container" shadow="never">
    <div id="subOutputRank-print">
      <!--startprint-->
      <div class="progress-container" >
        <h2>{{otherInfo.departName}}</h2>
        <div class="clearfix">
          <span class="left">汝州市骨科医院</span>
          <span class="right">审批编号：{{appoveOnlyId}}</span>
        </div>
        <table class="progress-table" cellspacing="0" cellpadding="0" >
          <tr v-for="(first,firstKey) in workData"  v-if="firstKey==0" :key="firstKey">
            <td class="fieldName">
              {{first.courseName}}
            </td>
            <td  class="fieldValues">{{first.courseUserName}}</td>
          </tr>
          <tr v-for="item in ProcessData">
            <td class="fieldName" v-show="item.fieldValues.indexOf('未填写') == -1">
              {{item.fieldName}}
            </td>
            <td  class="fieldValues" v-show="item.fieldValues.indexOf('未填写') == -1">{{item.fieldValues}}</td>
          </tr>
          <tr >
            <td class="fieldName" :rowspan="workData.length">审批流程</td>
            <td class="fieldValues">
              <div
                v-for="(items,keys) in workData"
               v-if="keys!==0"
               style="border-bottom: 1px solid #999999"
                :class="{nones: workData.length-1 ==keys ? true :false}"
              >
                <span >{{items.courseName}}</span>
                <span  style="width: 100px; height: 30px;vertical-align: middle;display:inline-block ">
                  <img style="width: 100%" :src="baseURLS+'/'+items.picsignatureUrl" />
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {{items.courseStatus }}&nbsp;&nbsp;&nbsp;&nbsp;
                <span class="right" style="margin-right: 40px"> {{items.approveDate}}</span>
              </div>
            </td>
          </tr>
        </table>
        <div class="clearfix" style="margin-top: 10px">
          <span>查看日期：{{otherInfo.checkDate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span>查看人：{{checkName}}</span>
        </div>
      </div>
      <!--endprint-->
    </div>
    <div style="text-align: center;">
      <el-button style="margin-top: 12px;" type="warning" size="medium" @click="prev">返回</el-button>
      <el-button style="margin-top: 12px;" type="warning" size="medium" @click="print">打印</el-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import { Message, MessageBox } from 'element-ui'
  import logo from '@/assets/images/logo.png'
  import {OldMyApproveDetails,WorkFlow} from '@/api/approve'

  export default {
    data(){
      return {
        logo:logo,
        workData:[],
        ProcessData:[],
        imgTitle:'',
        imgArray:[],
        fileTitle:'',
        fileHref:'',
        otherInfo:{},
        baseURLS:this.baseURL,
        appoveOnlyId:''
      }
    },
    computed:{
      checkName(){
        return this.$store.state.user.name
      }
    },
    filters:{
      formatState(value){
        if(value==='审批中'){
          return "审批中"
        }else if(value==='待审批'){
          return "待审批"
        }else if(value==='结束审批'){
          return "结束审批"
        }else if(value==='已撤销'){
          return "已撤销"
        }else if(value==='已同意'){
          return "已同意"
        }else if(value==='已拒绝'){
          return "已拒绝"
        }
      }
    },
    created(){
      this.checkRealName = this.$route.checkRealName
      this.appoveOnlyId = this.$route.query.u_id
      OldMyApproveDetails(this.$route.query.u_id)
        .then(response=>{
          const formInfo = response.datas.ap_Cont_DetailsModel
          this.otherInfo={
            name:formInfo.createDate,
            approveId:formInfo.approveId,
            departName:formInfo.tableName,
            checkDate:formInfo.createDate,
            checkRealName:formInfo.userRealName,
          }
          formInfo.fieldValueModels.forEach((item,index)=>{
            if(item.fieldType ===150){
              this.imgTitle = item.fieldName
              if(item.fieldValues.length==0){
                this.imgArray = []
              }else{
                this.imgArray= item.fieldValues.split(',')
              }
            }else if(item.fieldType === 160){
              this.fileTitle = item.fieldName
              let Href  = decodeURIComponent(item.fieldValues)
              this.fileHref=Href.split(',')
            }else{
              this.ProcessData.push(item)
            }
          })
          this.workData= response.datas.approveCourses
        })
    },
    methods:{
      prev(){
        const names=this.$route.query.formName
        this.$router.push({name:names,query: {pageNum:this.$route.query.pageNum}})
      },
      print(){
        let oldContent = document.body.innerHTML;
        let newContent = document.getElementById('subOutputRank-print').innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        this.$router.go(0)
      }
    }
  }

</script>

<style rel="stylesheet/stylus" scoped>
  @import "index.css";
  .nones{
    border-bottom: none !important;
  }
</style>
