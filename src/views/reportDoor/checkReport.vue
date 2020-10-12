<template>
  <div class="app-container">
    <el-row :gutter="10" style="width: 80%;margin: 0 auto;">
      <el-col :span="6" v-for="item in tableData" :key="item.uId">
        <div class="total-frame" ><!---->
         <router-link :to="{path:'/finance/finance',query:{url:item.reqUrl,userToken:userToken}}">
           <img :src="item.picUrl" alt="" class="total-icon">
           <div class="total-value">报表名称</div>
           <div class="total-title">{{item.name}}</div>
         </router-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {reportForm} from '@/api/reportInfo'

  export default {
    data(){
      return {
        tableData:[],
        userToken:''
      }
    } ,
    created(){
      this.initTable();
      this.userToken=localStorage.getItem('loginToken')
    },
    methods: {
      initTable() {
        this.listLoading = true
        reportForm().then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      },
    }
  }

</script>
<style scoped>
  .total-frame{
    border: 1px solid #dcdfe6;
    padding: 20px;
    height: 100px;
  }
  .total-icon{
    color: #409eff;
    width: 60px;
    height: 60px;
    border-radius: 10px;
  }
  .total-title {
    position: relative;
    font-size: 14px;
    color: #606266;
    left: 70px;
    top: -40px;
  }
  .total-value {
    position: relative;
    font-size: 18px;
    color: #909399;
    left: 70px;
    top: -50px;
  }
</style>
