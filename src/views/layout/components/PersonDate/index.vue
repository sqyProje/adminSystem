<template>
  <div class="person-container" ref="perCont">
    <div class="content"  v-if="dialogVisible">
      <div class="title">
        <div class="closeright">有责信息过期记录</div>
        <div class="close" type="text" @click="close()"><img src="@/assets/images/close.png" alt=""></div>
      </div>
      <ul class="ul-content">
        <li v-for="(item, index) in dateInfo.pushMsgModels" :key="index">
          <router-link :to="{path:'/hrDoor/record/employee',query:{bool:1,keyvalue:index+1}}">
           {{index+1}}. {{item.typeName}}
            <el-link v-if="index==0" type="primary" class="counts">{{item.counts}}</el-link>
            <el-link v-if="index==1" type="warning" class="counts">{{item.counts}}</el-link>
            <el-link v-if="index==2" type="info" class="counts">{{item.counts}}</el-link>
            <el-link v-if="index==3" type="danger" class="counts">{{item.counts}}</el-link>
            <el-link v-if="index==4" type="success" class="counts">{{item.counts}}</el-link>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-if="!dialogVisible" @click="SeeInfo()" style="padding: 4px;cursor: pointer;color: #ff0000;">查看</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: true
      };
    },
    computed:{
      dateInfo(){
        return this.$store.state.user.dateInfo
      },
    },
    methods: {
      close(){
        this.dialogVisible=!this.dialogVisible
      },
      SeeInfo(){
        this.dialogVisible=true
      }
    }
  }
</script>

<style scoped lang="scss">
  div,ul,li{
    margin:0;
    padding:0
  }
  .person-container{
    position: fixed;
    bottom:30px;
    right:0;
    border:1px solid #e1e1e1;
    z-index: 10000002;
    background-color: #ffffff;
    font-size: 14px;
    border-radius: 6px;
    box-shadow: 0 0 15px #ccc;
  }
  .content{
    position: relative;
  }

  .title{
    clear: both;
    height: 26px;
    line-height: 26px;
    border-bottom:1px solid #e1e1e1;
    margin-top:10px;
    text-indent: 4px;
    font-weight:bold;
  }
  .closeright{
    display: inline-block;
    height: 20px;
    margin-right:10px;
  }
  .close{
    float: right;
    margin-right:10px;
    height: 20px;
    width: 20px;
    height: 20px;
    img{
      width:100%;
    }
  }
  .ul-content{
    width:200px;
    min-height: 160px;
    padding:10px;

  }
  .ul-content li{
    list-style: none;
    height: 36px;
    line-height: 36px;
  }
  .counts{
    float: right;
  }
</style>
