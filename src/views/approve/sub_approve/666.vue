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
          <td class="fieldName">
            {{item.fieldName}}
          </td>
          <td  class="fieldValues">{{item.fieldValues}}</td>
        </tr>
        <tr>
          <td class="fieldName">
            {{imgTitle}}
          </td>
          <td  class="fieldValues"><el-image
            v-for="item in imgArray"
            :key="item"
            style="width: 100px; height: 100px;margin-top: 10px;"
            :src="item"
            fit="cover"
            :preview-src-list="imgArray"
          ></el-image>
          </td>
        </tr>
        <tr>
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
            {{item.courseName}} ({{item.courseStatus}})
          </td>
          <td >
            <table class='progress-man' cellspacing="0" cellpadding="0" >
              <tr v-for="itemchild in item.approveStepCourseModels">
                <td>
                  <span><el-image
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
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {{itemchild.courseSketch}}
                   &nbsp;&nbsp;&nbsp;&nbsp;
                    <el-image
                      v-if="itemchild.picsignatureUrl.length != 0"
                      style="
                        width: 30px; height: 30px;
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
      <el-button style="margin-top: 12px;" type="primary" size="medium" @click="prev">返回</el-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import logo from '@/assets/images/logo.png'
  import {GetMyInfo,WorkFlow} from '@/api/approve'

  export default {
    data(){
      return {
        logo:logo,
        workData:[],
        ProcessData:[],
        imgTitle:'',
        imgArray:[],
        fileTitle:'',
        fileHref:'www.baidu.com',
        otherInfo:{}
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
            if(item.fieldType ===150){
              this.imgTitle = item.fieldName
              this.imgArray= item.fieldValues.split(',')
            }else if(item.fieldType === 160){
              this.fileTitle = item.fieldName
              this.fileHref = item.fieldValues
            }else{

              this.ProcessData.push(item)
            }
          })
        })
    },
    methods:{
      prev(){
        this.$router.go(-1)
      }
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
