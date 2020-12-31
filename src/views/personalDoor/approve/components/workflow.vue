<template>
<div class="app-container stepComponent" >
  <div class="approvalProcess" >
    <el-steps :active = workData.length  direction="vertical" >
      <el-step :title="item.courseName"  v-for="(item,index) in workData" :key="index">
        <template slot="description" >
          <div class="step-row" v-for="child in item.approveStepCourseModels">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
              <!-- v-if=" child.courseStatus !=80 && child.courseStatus != 85 "-->
              <tr>
                <td style="color:#333">
                  <div class="processing_content_detail" :class="{'lastDetail':index==lastDetail}">
                    <div><el-image
                      style="
                      width: 30px; height: 30px;
                      vertical-align: middle;
                      text-align:center;margin-right: 10px;"
                      :src=child.courseUserPic
                      fit="fill">
                      <div slot="error" class="image-slot">
                        <el-image :src=logo></el-image>
                      </div>
                    </el-image>
                      <span>{{child.courseUserName}}</span>
                      <span v-if="child.courseStatus =='' "></span>
                      <span v-else-if="child.courseStatus !=80 && child.courseStatus != 85 ">({{child.courseStatus | formatState}})</span>
                      <span v-show="child.approveDate">{{child.picPaths.length>0 ? '办理' : '审批'}}时间：{{child.approveDate}}</span>
                    </div>
                    <div v-if="!item.bool && child.courseSketch.length >0" >批注：<span style="color:#219AFF">{{child.courseSketch}}</span></div>
                    <div class="demo-image__error" v-if="child.picPaths[0]!=='' && child.picPaths.length>0">图片：
                      <el-image
                        style="width: 100px; height: 100px;vertical-align: middle"
                        v-for="(items,keys) in child.picPaths"
                        :key="keys"
                        :src=items
                        fit="fill"
                        :preview-src-list="child.picPaths">
                        <div slot="error" class="image-slot"  style="width: 100px; height: 100px;line-height: 100px;text-align: center">
                          暂无图片信息
                        </div>
                      </el-image>
                    </div>
                    <div class="demo-image__error" v-if="!item.bool && child.picsignatureUrl.length>0">签名：
                      <el-image
                        style="width: 100px; height: 36px;vertical-align: middle"
                        :src=child.picsignatureUrl
                        fit="fill">
                        <div slot="error" class="image-slot"  style="width: 100px; height: 36px;line-height: 36px;text-align: center">
                         暂无签名信息
                        </div>
                      </el-image>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </template>
      </el-step>
    </el-steps>
    <el-button style="margin-top: 12px;margin-bottom:100px;" type="warning" size="medium" @click="prev">返回</el-button>
  </div>

</div>
</template>
<script>
  import logo from '@/assets/images/logo.png'
  import {WorkFlow} from  '@/api/approve'
  export default {
    components: {
    },
    data() {
      return {
        logo:logo,
        workData:[],
        lastDetail:''
      };
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
        this.lastDetail = this.workData.length-1
        })
    },
    methods: {
      prev(){
      //  this.$router.go(-1)
        const names=this.$route.query.formName
        this.$router.push({name:names,query: {pageNum:this.$route.query.pageNum}})
      }
    }
  };
</script>
<style scoped>
  .approvalProcess{
    color: #000;
    font-size: 14px;
    margin-left:20px;
    margin-right:0px;
    margin-top:10px;
    width: 800px;
    overflow: hidden;
  }
  .processing_content_detail{
    margin-left: 10px;
    display:inline-block;
    background-color: #f9f9f9;
    float:left;
    width:100%;
    padding: 10px;
    font-size: 14px;
  }

  .processing_content_detail div{
    margin-bottom: 3px;
  }
  .step-row{
    width:100%;
    margin-bottom:12px;
    margin-top:12px;
  }
  .lastDetail{
    width:90%!important;
  }
  .demo-image__error .image-slot{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #000;
    font-size: 14px
  }
  .demo-image__error .image-slot .el-icon-picture-outline {
    font-size: 30px;
    text-align: center;
    display: block;
    line-height: 100px;
  }
  .demo-image__error  .image-slot img{
    width:100%;
    height: 100%;
  }
</style>
