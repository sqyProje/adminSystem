<template>
<div class="app-container stepComponent" >
  <div class="approvalProcess" >
    <el-steps :active = workData.length  direction="vertical" >
      <el-step :title="item.courseName"  v-for="(item,index) in workData" :key="index">
        <template slot="description" >
          <div class="step-row" >
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
              <tr>
                <td style="color:#333">
                  <div class="processing_content_detail" :class="{'lastDetail':index==lastDetail}">
                    <div><el-image
                      style="
                      width: 30px; height: 30px;
                      vertical-align: middle;
                      text-align:center;margin-right: 10px;"
                      :src="baseURLS+'/'+item.courseUserPic"
                      fit="fill">
                      <div slot="error" class="image-slot">
                        <el-image :src=logo></el-image>
                      </div>
                    </el-image>
                      <span>{{item.courseUserName}}</span>
                      <span v-if="item.courseStatus =='' "></span>
                      <span v-else>({{item.courseStatus | formatState}})</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span v-show="item.approveDate">审批时间：{{item.approveDate}}</span>
                    </div>
                    <div v-if="!item.bool && item.courseSketch.length >0" >批注：<span style="color:#219AFF">{{item.courseSketch}}</span></div>
                    <div class="demo-image__error" v-if="!item.bool && item.picsignatureUrl.length>0">签名：
                      <el-image
                        style="width: 100px; height: 36px;vertical-align: middle"
                        :src="baseURLS+'/'+item.picsignatureUrl"
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
  import {OldMyApproveDetails,OldWaitApproveDetails} from  '@/api/approve'
  export default {
    components: {
    },
    data() {
      return {
        logo:logo,
        workData:[],
        lastDetail:'',
        baseURLS:this.baseURL
      };
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
      let urls = '';
      if(this.$route.query.formName === 'old_waitApprove'){
        OldWaitApproveDetails(this.$route.query.u_id)
          .then(response=>{
            this.workData= response.datas.approveCourses
          })
      }else{
        OldMyApproveDetails(this.$route.query.u_id)
          .then(response=>{
            this.workData= response.datas.approveCourses
            this.lastDetail = this.workData.length-1
          })
      }

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
  @import "index.css";
</style>
