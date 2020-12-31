<template>
  <div class="app-container" shadow="never">
    <div class="progress-container">
      <h3>{{otherInfo.name}}</h3>
      <div class="clearfix">
        <span class="left">部门名称：{{otherInfo.departName}}</span>
        <span class="right">审批编号：{{otherInfo.approveId}}</span>
      </div>
      <table class="progress-table" cellspacing="0" cellpadding="0" >
        <tr v-for="item in ProcessData">
          <td class="fieldName" v-show="item.fieldValues.trim().length>0">
            {{item.fieldName}}
          </td>
          <td  class="fieldValues" v-show="item.fieldValues.trim().length>0">{{item.fieldValues}}</td>
        </tr>
        <tr v-show="imgArray.length>0">
          <td class="fieldName">
            {{imgTitle}}
          </td>
          <td  class="fieldValues">
            <el-image
              v-for="item in imgArray"
              :key="item"
              :src="item"
              :preview-src-list="imgArray"
              fit="fill"
              style="height:100px;width:100px;overflow: visible;margin: 10px 5px 0 ;"
            ></el-image>
          </td>
        </tr>
        <tr v-show="fileHref.length>0">
          <td class="fieldName">
            {{fileTitle}}
          </td>
          <td class="fieldValues">
            <a :href="fileHref">{{fileHref}}</a>
          </td>
        </tr>
      </table>
      <div class="clearfix">
        <span class="left">查看人：{{otherInfo.checkRealName}}</span>
        <span class="right">查看日期：{{otherInfo.checkDate}}</span>
      </div>
      <h3> 审批流程</h3>
      <table class='progress-table' cellspacing="0" cellpadding="0" >
        <tr v-for="item in workData">
          <td class="fieldName">
            {{item.courseName}}
          </td>
          <td >
            <table class='progress-man' cellspacing="0" cellpadding="0" >
              <tr v-for="itemchild in item.approveStepCourseModels">
                <td>
                  <span><el-image
                    style="
                      width: 30px; height: 30px;
                      vertical-align: middle;
                      text-align:center;margin-right: 10px;  "
                    :src=itemchild.courseUserPic
                    fit="fill">
                      <div slot="error" class="image-slot">
                        <el-image :src=logo></el-image>
                      </div>
                  </el-image>{{itemchild.courseUserName}}
                     <span v-if="itemchild.courseStatus=='' "></span>
                    <span v-else-if=" itemchild.courseStatus !=80 && itemchild.courseStatus != 85 ">({{itemchild.courseStatus | formatState}})</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {{itemchild.courseSketch}}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <el-image
                      v-if="itemchild.picsignatureUrl.length != 0"
                      style="
                        width: 100px; height: 30px;
                        vertical-align: middle;
                        text-align:center;margin-right: 10px;  "
                      :src=itemchild.picsignatureUrl
                      fit="fill">
                        <div slot="error" class="image-slot">
                          <el-image :src=logo></el-image>
                        </div>
                    </el-image>
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <div v-show="this.$route.query.approveStepId">
        <h3>审批</h3>
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
          <el-form-item label='审批' prop="approveStatus">
            <el-select v-model="AddEditInfo.approveStatus" placeholder="审批" style="width: 100%;" @change="approveChange">
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
          <el-form-item label='选择图片' v-show="this.$route.query.isPicture==1">
            <multiUploadImg
              ref="multiImg"
              @imgUrl="picPreview"
              @delUrl = "delUrlPreview"
              :picArray="picString"
            ></multiUploadImg>
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
  import {GetMyInfo,WorkFlow,ToApprove,GetProcessUser} from '@/api/approve'

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
          { id: 60, display_name: '拒绝'},
          { id: 70, display_name: '同意'}
        ],
        AddEditInfo:{
          approveStepId:'',
          approveUserId:'',
          approveStatus:'',
          sketch:'',
          pictures:''
        },
        rulesInfo: {
          approveStatus: [{required: true, trigger: 'blur', message: '请选择审批'}]
        },
        picString:"",
        picIdsArray:[],
        picPreviewInfo:'',
      }
    },
    components:{multiUploadImg},
    filters:{
      formatState(value){
        if(value===10){
          return "草稿"
        }else if(value===20){
          return "审批中"
        }else if(value===25){
          return "任务审批中"
        }else if(value===30){
          return "待批"
        }else if(value===40){
          return "挂起"
        }else if(value===50){
          return "任务"
        }else if(value===55){
          return "待领任务"
        }else if(value===60){
          return "拒绝"
        }else if(value===70){
          return "同意"
        }else if(value===80){
          return "抄送"
        }else if(value===85){
          return "抄送完成"
        }else if(value===90){
          return '完成审批'
        }
      }
    },
    created(){
      if(this.$route.query.approveStepId){
        this.AddEditInfo.approveStepId = this.$route.query.approveStepId
      }
      GetProcessUser(this.$route.query.approveStepId).then(res=>{
        this.ApproveUserData = res.datas!=null ? res.datas :[]
        if(this.ApproveUserData.length>0){
          this.UserFlag = true
        }
      })
      WorkFlow(this.$route.query.u_id).then(response=>{
        this.workData= response.datas
      })
      GetMyInfo(this.$route.query.u_id)
      .then(response=>{
        this.otherInfo={
          name:response.datas.name,
          approveId:response.datas.approveId,
          departName:response.datas.departName,
          checkDate:response.datas.checkDate,
          checkRealName:response.datas.checkRealName,
        }
        response.datas.tableFieldValueModels.forEach((item,index)=>{
          if(item.fieldType ===150){
            this.imgTitle = item.fieldName
            if(item.fieldValues.length==0){
              this.imgArray = []
            }else{
              this.imgArray= item.fieldValues.split(',')
            }
          }else if(item.fieldType === 160){
            this.fileTitle = item.fieldName
            this.fileHref = decodeURIComponent(item.fieldValues)
          }else{
            this.ProcessData.push(item)
          }
        })
      })
    },
    methods:{
      picPreview(value){
        this.picPreviewInfo += value+','
        this.picIdsArray.push(value)
      },
      delUrlPreview(value){
        this.picIdsArray= this.picIdsArray.filter((x)=>{
          return x !==value
        })
        this.picString = this.picIdsArray.toString()
        this.picPreviewInfo = this.picIdsArray.toString()+','
      },
      prev(){
        this.$router.push({name:'wait_approve',
          query:{
          pageNum:this.$route.query.pageNum
          }
        })
      },
      approveChange(value){
        this.AddEditInfo.approveStatus = value
      },
      UpdateUser(){
        this.AddEditInfo.pictures =  this.picPreviewInfo.substring(0, this.picPreviewInfo.length-1)
        //60拒绝不选人
        if(this.AddEditInfo.approveStatus === 60){
          this.$refs.AddEditInfo.validate(valid => {
            if (valid) {
              ToApprove(this.AddEditInfo).then(response => {
                if (response.status === 0) {
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.$router.push({name:'wait_approve'})
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
                this.$router.push({name:'wait_approve'})
                ToApprove(this.AddEditInfo).then(response => {
                  if (response.status === 0) {
                    this.$router.push({name:'wait_approve'})
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
            ToApprove(this.AddEditInfo).then(response => {
              if (response.status === 0) {
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$router.push({name:'wait_approve'})
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
  .progress-container{
    width: 800px;
    margin: 20px auto 50px;
  }
  .progress-container h3{
    text-align: left;
  }
  .clearfix span{
    margin:15px 0;
  }
  .progress-table {
    width: 800px;

    border-left:1px solid #e1e1e1;
    border-bottom:1px solid #e1e1e1;
  }
  .progress-table td{
    min-height: 38px;
    line-height: 38px;
    color: #595959;

  }
  .fieldName{
    width: 200px;
    text-align: right;
    padding-right: 10px;
    border-top:1px solid #e1e1e1;
    border-right:1px solid #e1e1e1;
  }
  .fieldValues{
    text-indent: 20px;
    border-top:1px solid #e1e1e1;
    border-right:1px solid #e1e1e1;
  }
  .fieldName span{
    display:block;
    width:150px;
    text-align: center;
  }
  .progress-man{
    border-right:1px solid #e1e1e1;
    display: block;
  }
  .progress-man tr{
    display: block;
    border-top: 1px solid #e1e1e1;
  }
  .progress-man td{
    display: block;
  }
  .progress-man td span{
    margin-left: 20px;
  }
  .left{
    float: left;
  }
  .right{
    float: right;
  }
</style>
