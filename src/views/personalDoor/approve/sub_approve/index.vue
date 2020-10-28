<template>
  <div class="icons-container">
    <el-row>
      <el-card class="box-card" v-for="(item,index) in ListQuerys" :key="index">
        <div slot="header" class="clearfix">
          <span>{{item.name}}</span>
        </div>
        <div style="margin-bottom:50px;"  class="clearfix">
          <el-col
            :span="2" class="text-center"
            v-for = 'itemChild in item.tableFormSubModels'
            :key="itemChild.uId">
            <el-tooltip placement="top">
              <div slot="content">
               {{itemChild.name}}
              </div>
              <div class="icon-item" @click="handleViewOrder(itemChild.uId,itemChild.name)">
                <img :src="itemChild.picpath  ? itemChild.picpath : logo"/>
                <span>{{itemChild.name}} </span>
              </div>
            </el-tooltip>
          </el-col>
        </div>
      </el-card>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import logo from '@/assets/images/logo.png'
  import {InitSubList} from '@/api/approve'
  export default {
    data() {
      return {
        logo:logo,
        ListQuerys:[]
      }
    },
    created(){this.InitList()},
    methods:{
      InitList(){
        InitSubList().then(response=>{
          this.ListQuerys = response.datas
        })
      },
      handleViewOrder(itemUId,itemName){
        this.$router.push({name:'sub_approve_fields',query: {form_id: itemUId,form_name:itemName}})
      },
    }
  }
</script>
<style scoped>
  .icons-container {
    background-color: #f0f2f5;
    padding: 10px;
    min-height: calc(100vh - 84px);
  }
  .box-card{
    margin-bottom: 20px;
  }
  .icons-container .icon-item {
    margin-bottom: 20px;
    padding:20px 4px;
    height: 110px;
    text-align: center;
    border:1px solid #eeeeee;
    border-radius: 4px;
    width: 110px;
    float: left;
    color: #24292e;
    cursor: pointer;
  }
  .icon-item img{
    width: 40px;
    height: 40px;
  }

  .icon-item span {
    display: block;
    font-size: 14px;
    margin-top: 10px;
  }
</style>
