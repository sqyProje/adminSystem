<template >
<div>
<el-button style="margin:10px" @click="backtrack" type="primary" >返回</el-button> 

  <div style="cursor:pointer" class="root-box">
      <div class="title-style"><b>{{neirong.title}}</b></div>
      <div class="news-content" v-html="neirong.content"></div>
      <div class="news-date">{{neirong.createdate}}</div>
  </div>
  </div>
</template>
      
<script>

import {noticedetails} from "@/api/personalDoor";
export default {
  data() {
    return {
     neirong:[]
    };
  },
   methods: {
    details1(uId) {
      noticedetails(uId).then((res) => {
        this.neirong = res.datas;
      });
    },
    backtrack(){
      this.$router.back()
    }
  },
  created(){
  },
   mounted() {
    this.details1(this.$route.query.uId);
  },

};
</script>

<style scoped>
.title-style{
    font-size: 38px;
    text-align: center;
}
.root-box{
    width: 1690px;
    padding: 20px;
}
.news-content{
  padding-top: 20px;
  width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.news-date{
  padding-left: 80%;
  margin-top: 10px;
}
.fanhui{
  margin: 10px;
  margin-left: 30px;
  color: green;
}
</style>