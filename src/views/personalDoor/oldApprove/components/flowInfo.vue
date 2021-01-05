<template>
  <div class="app-container" shadow="never">
    <div class="progress-container">
      <h2>{{otherInfo.departName}}</h2>
      <!--<div class="clearfix">
        <span class="left">部门名称：{{otherInfo.departName}}</span>
      </div>-->
      <table class="progress-table" cellspacing="0" cellpadding="0" >
        <tr v-for="item in ProcessData" >
          <td class="fieldName"  v-show="item.fieldValues.indexOf('未填写') == -1">
            {{item.fieldName}}
          </td>
          <td  class="fieldValues"  v-show="item.fieldValues.indexOf('未填写') == -1">{{item.fieldValues}}</td>
        </tr>
        <tr v-show="imgTitle.length>0">
          <td class="fieldName">
            {{imgTitle}}
          </td>
          <td  class="fieldValues">
            <div v-if="imgArray.length>0">
              <el-image
                v-for="item in imgArray"
                :key="item"
                :src="item"
                :preview-src-list="imgArray"
                fit="fill"
                style="height:100px;width:100px;overflow: visible;margin: 10px 5px 0 ;"
              ></el-image>
            </div>
          </td>
        </tr>
        <tr v-show="fileTitle.length>0">
          <td class="fieldName">
            {{fileTitle}}
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
      <h2> 审批流程</h2>
      <table class='progress-table' cellspacing="0" cellpadding="0" >
        <tr v-for="item in workData">
          <td class="fieldName">
            {{item.courseName}}
          </td>
          <td>
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
            {{item.courseUserName}} &nbsp;&nbsp;&nbsp;&nbsp;
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
      <div v-show="this.$route.query.approveStepId">
        <h2>审批</h2>
        <el-form
          :inline="false"
          size="mini"
          :model="AddEditInfo"
          label-width="80px"
          ref="AddEditInfo"
          :rules ="rulesInfo"
        >
          <el-form-item label='用户' v-show="UserFlag">
            <el-select v-model="AddEditInfo.approveUserId" filterable style="width: 100%;">
              <el-option
                v-for="item in ApproveUserData"
                :label="item.realname"
                :value="item.uId"
                :key = "item.uId"
              >{{item.realname}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='审批' prop="approvestatus">
            <el-select v-model="AddEditInfo.approvestatus" placeholder="审批" style="width: 100%;" ><!--@change="approveChange"-->
              <el-option
                v-for="(item,index) in stateData"
                :style="index == 0 ? 'color:#ff0000' : 'color:#00ff00' "
                :label="item.display_name"
                :value="item.id"
                :key = "item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='批注'>
            <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="UpdateUser">审  批</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center;">
        <el-button style="margin-top: 12px;margin-bottom:100px;" type="warning" size="medium" @click="prev">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import logo from '@/assets/images/logo.png'
  import multiUploadImg from '@/components/Upload/multiUploadImg'
  import {OldMyApproveDetails,OldWaitApproveDetails,OldApprove,OldUser} from '@/api/approve'

  export default {
    data(){
      return {
        UserFlag:false,
        ApproveUserData:[],
        logo:logo,
        workData:[],
        ProcessData:[],
        imgTitle:'',
        imgArray:[],
        fileTitle:'',
        fileHref:'',
        otherInfo:{},
        stateData:[
          { id: 5, display_name: '拒绝'},
          { id: 4, display_name: '同意'}
        ],
        AddEditInfo:{
          approvestepid:'',
          approve_startUserid:'',
          approvestatus:'',
          sketch:'',
        },
        rulesInfo: {
          approvestatus: [{required: true, trigger: 'blur', message: '请选择审批'}]
        },
        picString:"",
        picIdsArray:[],
        picPreviewInfo:'',
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
      if(this.$route.query.approveStepId){
        this.AddEditInfo.approvestepid = this.$route.query.approveStepId
      }
      OldWaitApproveDetails(this.$route.query.approveStepId)
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
          this.roleId = response.datas.roleId
        }).then(es=>{
          if(this.roleId>0){
            OldUser(this.roleId).then(res=>{
              this.ApproveUserData = res.datas!=null ? res.datas :[]
              if(this.ApproveUserData.length>0){
                this.UserFlag = true
              }
            })
          }
      })
    },
    methods:{
      prev(){
        this.$router.push({name:'old_waitApprove',
          query:{
          pageNum:this.$route.query.pageNum
          }
        })
      },
      approveChange(value){
        this.AddEditInfo.approveStatus = value
      },
      UpdateUser(){
        //60拒绝不选人
        if(this.AddEditInfo.approveStatus === 60){
          this.$refs.AddEditInfo.validate(valid => {
            if (valid) {
              OldApprove(this.AddEditInfo).then(response => {
                if (response.status === 0) {
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.$router.push({name:'old_waitApprove'})
                }
              })
            }else{
              Message({
                message: '参数验证不合法',
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
          return
        }
        if(this.ApproveUserData.length > 0){
          if(this.AddEditInfo.approveUserId<=0){
            Message({
              message: '请选择用户',
              type: 'error',
              duration: 3 * 1000
            })
          }else{
            this.$refs.AddEditInfo.validate(valid => {
              if (valid) {
                OldApprove(this.AddEditInfo).then(response => {
                  if (response.status === 0) {
                    this.$router.push({name:'old_waitApprove'})
                    Message({
                      message: response.msg,
                      type: 'success',
                      duration: 3 * 1000
                    })
                  }
                })
              }else{
                Message({
                  message: '参数验证不合法',
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            })
          }
        }else{
          this.$refs.AddEditInfo.validate(valid => {
            if (valid) {
              OldApprove(this.AddEditInfo).then(response => {
              if (response.status === 0) {
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$router.push({name:'old_waitApprove'})
              }
            })
            }else{
              Message({
                message: '参数验证不合法',
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
        }
    },
  }
}

</script>

<style rel="stylesheet/stylus">
  @import "index.css";
</style>
