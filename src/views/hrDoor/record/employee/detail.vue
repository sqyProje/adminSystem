<template>
  <div class="app-container">
    <div class="conedu" style="text-align: left;color: #f1c40f;font-size: 14px;cursor: pointer" @click="prev">返回上一级</div>
    <el-tabs tab-position="left" class="conedu">
      <el-tab-pane label="员工详情"><manInfo style="width: 800px"></manInfo></el-tab-pane>
      <el-tab-pane label="身份证信息"><idCard style="width: 800px;"></idCard></el-tab-pane>
      <el-tab-pane label="教育培训情况"><education style="width: 1200px;"></education></el-tab-pane>
      <el-tab-pane label="家庭成员"><family style="width: 1200px;"></family></el-tab-pane>
      <el-tab-pane label="证书证件"><credential style="width: 1200px;"></credential></el-tab-pane>
      <el-tab-pane label="工作履历"><job style="width: 1200px;"></job></el-tab-pane>
      <el-tab-pane label="员工合同"><contract style="width: 800px;"></contract></el-tab-pane>
    </el-tabs>
  </div>

</template>
<script type="text/ecmascript-6">
  import manInfo from './Item/manInfo'
  import idCard from './Item/idCard'
  import education from './Item/education'
  import family from './Item/family'
  import job from './Item/job'
  import credential from './Item/credential'
  import contract from './Item/contract'
  export default {
    components:{
      manInfo,idCard,education,family,job,credential,contract
    },
    methods:{
      prev(){
        this.$router.push({name:'employee',
          query: {
          uId: this.$route.query.uId,
          bool:this.$route.query.bool,
          keyvalue:this.$route.query.keyvalue,
          pageNum:this.$route.query.pageNum
        }
        })
        //,pageNum:this.$route.query.pageNum
      }
  }
  }
</script>

<style>
  .conedu{
    min-width: 800px;
    width:800px;
    width: auto!important;
    padding-top: 20px;
    margin: 0 160px;
  }
</style>

<style>

</style>
