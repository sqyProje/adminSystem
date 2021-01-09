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
        <table class="progress-table" cellspacing="0" cellpadding="0" >
          <tr  v-for="(item,key) in firstManData" :key="key+'hh'">
            <td class="fieldName">
              {{item.courseName}}
            </td>
            <td style="display: block">
              <table class='progress-man' cellspacing="0" cellpadding="0" >
                <tbody>
                  <tr v-for="(itemchild,index) in item.approveStepCourseModels" :key="index">
                    <td>
                      <span  v-if="itemchild.picsignatureUrl.length!==0"
                            style="width: 100px; height: 30px;vertical-align: middle;display:inline-block "
                      >
                        <img
                          v-if="itemchild.picsignatureUrl.length!==0"
                          style="width:100%;height: 30px;"
                          :src=itemchild.picsignatureUrl
                        >
                      </span>
                      <span v-else >{{itemchild.courseUserName}}</span>
                      {{itemchild.courseStatus | formatState}}
                      <span class="right"  style="margin-right: 40px">{{itemchild.approveDate}}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr v-for="(item,ids) in ProcessData" :key="ids+'hhh'" >
            <td class="fieldName" v-show="item.fieldValues.trim().length>0">
              {{item.fieldName}}
            </td>
            <td  class="fieldValues" v-show="item.fieldValues.trim().length>0">{{item.fieldValues}}</td>
          </tr>
          <tr  v-for="(item,keys) in otherManData" :key="keys+'h'">
            <td class="fieldName">
              {{item.courseName}}
            </td>
            <td style="display: block">
              <table class='progress-man' cellspacing="0" cellpadding="0" >
                <tbody>
                  <tr v-for="(itemchild,index) in item.approveStepCourseModels" :key="index">
                    <td>
                      <span  v-if="itemchild.picsignatureUrl.length!==0"
                            style="width: 100px; height: 30px;vertical-align: middle;display:inline-block "
                      >
                        <img
                          v-if="itemchild.picsignatureUrl.length!==0"
                          style="width:100%;height: 30px;"
                          :src=itemchild.picsignatureUrl
                        >
                      </span>
                      <span v-else >{{itemchild.courseUserName}}</span>
                      {{itemchild.courseStatus | formatState}}
                      <span class="right"  style="margin-right: 40px">{{itemchild.approveDate}}</span>
                    </td>
                  </tr>
                </tbody>
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
      <el-button style="margin-top: 12px;" type="primary" size="medium" @click="print">打印</el-button>
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
    computed:{
      firstManData(){
        return this.workData.filter((item,keys)=>{
          if(keys==0){
            return item
          }
        })
      },
      otherManData(){
        return this.workData.filter((item,keys)=>{
          if(keys != 0){
            return item
          }
        })
      }

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
  .progress-container h2{
    text-align: center;
  }
</style>
