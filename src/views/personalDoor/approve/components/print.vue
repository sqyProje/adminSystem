<template>
  <div class="app-container" shadow="never">
    <div id="subOutputRank-print">
      <!--startprint-->
      <div class="progress-container" >
        <h2>{{otherInfo.name}}</h2>
        <div class="clearfix">
          <span class="left">部门名称：{{otherInfo.departName}}</span>
          <span class="right">审批编号：{{otherInfo.approveId}}</span>
        </div>
        <table class="progress-table two-table" cellspacing="0" cellpadding="0" >
          <tr v-for="item in ProcessData">
            <td class="fieldName">
              {{item.fieldName}}
            </td>
            <td  class="fieldValues">{{item.fieldValues}}</td>
          </tr>
        </table>
        <table class='progress-table ' cellspacing="0" cellpadding="0"><!-- style="border-left:1px solid #e1e1e1 "-->
          <tr v-for="(items,keys) in workData">
            <td class="fieldName" :style="keys==0? 'border-top:none':''">
              {{items.courseName}}
            </td>
            <td style="display: block">
              <table class='progress-man' cellspacing="0" cellpadding="0" >
                <tr v-for="(itemchild,index) in items.approveStepCourseModels" class="ddtss">
                  <td>
                  <span style="display: block;width: 100%;"><el-image
                    style="
                      width: 30px; height: 30px;
                      background-color:#e1e1e1;
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
                        background-color:#e1e1e1;
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
        <div class="clearfix">
          <span class="left">查看人：{{otherInfo.checkRealName}}</span>
          <span class="right">查看日期：{{otherInfo.checkDate}}</span>
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
        this.otherInfo={
          name:response.datas.name,
          approveId:response.datas.approveId,
          departName:response.datas.departName,
          checkDate:response.datas.checkDate,
          checkRealName:response.datas.checkRealName,
        }
        response.datas.tableFieldValueModels.forEach((item,index)=>{
          if(item.fieldType !=150 && item.fieldType !=160){
            this.ProcessData.push(item)
          }
        })
      })
    },
    methods:{
      prev(){
        this.$router.go(-1)
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
  .progress-container{
    width: 800px;
    margin: 20px auto 50px;
  }
  .progress-container h2{
    text-align: center;
  }
  .clearfix span{
    margin:15px 0;
  }
  .progress-table {
    width: 800px;
  }
  .two-table{
    border-top:1px solid #999999;
  }
  .progress-table td{
    border-right:1px solid #999999;
    border-bottom:1px solid #999999;
  }
  .progress-table td{
    min-height: 38px;
    line-height: 38px;
    color: #595959;
    word-break: break-all;
  }
  .fieldName{
    width: 200px;
    text-align: right;
    padding-right: 10px;
    border-right:none;
    border-left: 1px solid #999999;
  }

  .fieldValues{
    text-indent: 20px;
  }
  .fieldName span{
    display:block;
    width:150px;
    text-align: center;
  }
  .progress-man{
    display: block;
  }
  .progress-man tbody{
    width:100%;
    display: block;
  }
  .progress-man tr{
    width:100%;
    display: block;
  }

  .progress-man td{
    width:100%;
    display: block;
    border-left:none;
    border-bottom:none;
    border-right: none;
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
