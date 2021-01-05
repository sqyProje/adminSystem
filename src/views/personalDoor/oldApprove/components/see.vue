<template>
  <div class="app-container" shadow="never">
    <div class="progress-container">
      <h2>{{otherInfo.departName}}</h2>
      <!--<div class="clearfix">
        <span class="left">部门名称：{{otherInfo.departName}}</span>
      </div>-->
      <table class="progress-table" cellspacing="0" cellpadding="0" >
        <tr v-for="item in ProcessData">
          <td class="fieldName" v-show="item.fieldValues.indexOf('未填写') == -1">
            {{item.fieldName}}
          </td>
          <td  class="fieldValues" v-show="item.fieldValues.indexOf('未填写') == -1">{{item.fieldValues}}</td>
        </tr>
        <tr v-if="imgArray.length>0">
          <td class="fieldName">图片</td>
          <td  class="fieldValues">
           <div v-if="imgArray.length>0">
             <el-image
               v-for="(item,key) in imgArray"
               :key="key"
               :src="item"
               :preview-src-list="imgArray"
               fit="fill"
               style="height:100px;width:100px;overflow: visible;margin: 10px 5px 0 ;"
             ></el-image>
           </div>
          </td>
        </tr>
        <tr v-show="fileHref.length>0">
          <td class="fieldName">
            文件
          </td>
          <td class="fieldValues">
            <div v-for="(item,key) in fileHref" :key="key" style="height: 26px;line-height: 26px">
              <a :href="item" >{{decodeURIComponent(item.substring(50,item.length))}}</a><br>
            </div>
          </td>
        </tr>
      </table>
      <div class="clearfix">
        <span class="left">申请人：{{otherInfo.checkRealName}}</span>
        <span class="right">创建日期：{{otherInfo.checkDate}}</span>
      </div>
      <h2 v-show="reasonInfo.length>0"> 拒绝原因</h2>
      <table class="progress-table" cellspacing="0" cellpadding="0" v-show="reasonInfo.length>0">
        <tr>
          <td class="fieldName">拒绝原因</td>
          <td class="fieldValues">拒绝人</td>
        </tr>
        <tr v-for="item in reasonInfo">
          <td class="fieldName">
            {{item.approveSketch}}
          </td>
          <td  class="fieldValues">{{item.approveUser}}</td>
        </tr>
      </table>
      <h2> 审批流程</h2>
      <table class='progress-table' cellspacing="0" cellpadding="0" >
        <tr v-for="item in workData">
          <td class="fieldName">
            {{item.courseName}}
          </td>
          <td ><!--class="fieldValues"-->
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-image
              style="
              width: 30px; height: 30px;
              vertical-align: middle;
              text-align:center;margin-right: 10px;  "
              :src="baseURLS  +'/' + item.courseUserPic"
              fit="fill">
              <div slot="error" class="image-slot">
                <el-image :src=logo></el-image>
              </div>
            </el-image>
            {{item.courseUserName}}
            <span v-if="item.courseStatus=='' "></span>
            <span v-else>{{item.courseStatus}}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {{item.courseSketch}}
           &nbsp;&nbsp;&nbsp;&nbsp;
            <el-image
                v-if="item.picsignatureUrl.length != 0"
                style="
                  width: 100px; height: 30px;
                  vertical-align: middle;
                  text-align:center;margin-right: 10px;  "
                :src="baseURLS + '/' +item.picsignatureUrl"
                fit="fill">
                  <div slot="error" class="image-slot">
                    <el-image :src=logo></el-image>
                  </div>
              </el-image>
          </td>
        </tr>
      </table>
      <div style="text-align: center;">
        <el-button style="margin-top: 12px;margin-bottom:100px;" type="warning" size="medium" @click="prev">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import logo from '@/assets/images/logo.png'
  import {OldMyApproveDetails,GetMyInfo,WorkFlow,ToApprove} from '@/api/approve'

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
        reasonInfo:[],
        baseURLS:this.baseURL
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
        formInfo.picturesUrls.forEach(items=>{
          this.imgArray .push(this.baseURLS+'/'+items)
        })
        this.fileHref =formInfo.filesUrls ?formInfo.filesUrls:[]
        this.ProcessData = formInfo.fieldValueModels
        this.workData = response.datas.approveCourses
      })
    },
    methods:{
      prev(){
        const names=this.$route.query.formName
        this.$router.push({name:names,query: {pageNum:this.$route.query.pageNum}})
      }
    }
  }

</script>

<style rel="stylesheet/stylus">
  @import "index.css";
</style>
