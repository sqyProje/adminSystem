<template >
  <div>
    <el-button style="margin:10px" @click="backtrack" type="primary">返回</el-button>

    <div style="cursor:pointer" class="root-box" >
      <div class="title-style">
        <b>{{neirong.title}}</b>
      </div>
      <div class="news-date">创建时间：{{neirong.createdate}}</div>
      <div class="news-content" v-html="neirong.content"></div>
    </div>
  </div>
</template>

<script>
import { newsdetails } from "@/api/personalDoor";
export default {
  data() {
    return {
      neirong: [],
    };
  },
  methods: {
    details1(uId) {
      newsdetails(uId).then((res) => {
        this.neirong = res.datas;
      });
    },
    backtrack() {
      this.$router.back();
    },

  },
  created() {},
  mounted() {
    this.details1(this.$route.query.uId);
  },
};
</script>

<style scoped>
  .title-style{
    font-size: 30px;
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
    text-align: center;
    color:#999999;
    font-size: 14px;
    margin-top: 10px;
  }

</style>
