<template>
  <div class="app-container" shadow="never">
    <div class="progress-container">
      <h2>{{otherInfo.name}}</h2>
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
            {{imgTitle}}12
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
        <tr v-show="imgArray.length>0">
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
        <span class="left">查看人：{{otherInfo.checkRealName}}</span>
        <span class="right">查看日期：{{otherInfo.checkDate}}</span>
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
          <td >
            <table class='progress-man' cellspacing="0" cellpadding="0" >
              <tr v-for="(itemchild,index) in item.approveStepCourseModels">
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
      <div style="text-align: center;">
        <el-button style="margin-top: 12px;margin-bottom:100px;" type="warning" size="medium" @click="prev">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import logo from '@/assets/images/logo.png'
  import {GetMyInfo,WorkFlow,ToApprove} from '@/api/approve'

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
        reasonInfo:[]
      }
    },
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
      WorkFlow(this.$route.query.u_id).then(response=>{
        this.workData= response.datas
      })
      GetMyInfo(this.$route.query.u_id)
      .then(response=>{
        this.reasonInfo=response.datas.approveHistorysModels
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
           let Href  = decodeURIComponent(item.fieldValues)
            this.fileHref=Href.split(',')
          }else{
            this.ProcessData.push(item)
          }
        })
      })
    },
    methods:{
      prev(){
      //  this.$router.go(-1)
        const names=this.$route.query.formName
        this.$router.push({name:names,query: {pageNum:this.$route.query.pageNum}})
      }
    }
  }

</script>

<style rel="stylesheet/stylus">
 @import "index.css";
</style>
