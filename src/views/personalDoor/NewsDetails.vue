<template >
  <div class="root-box">
      <div class="title-style"><b>{{neirong.title}}</b></div>
      <div class="news-content" v-html="neirong.content"></div>
      <div class="news-date">{{neirong.createdate}}</div>
  </div>
</template>
      
<script>

import {newsdetails} from "@/api/personalDoor";
export default {
  data() {
    return {
     neirong:[]
    };
  },
   methods: {
    details1(uId) {
      newsdetails(uId).then((res) => {
        this.neirong = res.datas;
      });
    },
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
    padding: 20px;
    padding-left: 300px;
    width: 1200px;
    text-align: center;
}
.news-date{
    padding-left: 70%;
}
</style>