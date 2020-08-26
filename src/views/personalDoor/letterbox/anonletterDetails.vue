
<template>
  <!-- 匿名信详情 -->
  <div class="root-box">
    <div class="title-box">
      <el-button type="info" size="mini" @click="goBack" icon="el-icon-d-arrow-left" plain>返回</el-button>
    </div>
    <div class="Letters-messages">
      <div>{{neirong.title}}</div>
      <div class="Information-style">收件人:{{neirong.realname}}</div>
      <div class="Information-style">时间:{{neirong.createdate}}</div>
    </div>

   
      <!-- <Editor :curValue="neirong.content" @input="newContent"></Editor> -->
      <div class="neirong-box" v-html="neirong.content"></div>
  </div>
</template>
<script >
import { Message, MessageBox } from "element-ui";
import { details } from "@/api/personalDoor";
import Editor from "@/components/Tinymce/Editor";
export default {
  data() {
    return {
      neirong: [],
    };
  },
  components: {
    Editor,
  },
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    details1(uId) {
      details(uId).then((res) => {
        this.neirong = res.datas;
      });
    },
  },
  mounted() {
    this.details1(this.$route.query.uId);
  },
  created() {},
};
</script>

<style scoped>
.bom-box {
  text-align: center;
  font-size: 12px;
  height: 60px;
  line-height: 60px;
  background-color: #f5f5f5;
}
.root-box {
  margin: 5px;
}
.title-box {
  height: 50px;
  background: rgba(181, 201, 237, 1);
  line-height: 50px;
  padding-left: 40px;
}
.Letters-messages {
  min-height: 90px;
  background: rgba(243, 247, 255, 1);
  padding: 10px;
  padding-left: 40px;
  font-size: 22px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
}
.Information-style {
  padding: 5px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(151, 151, 151, 1);
}
.neirong-box {
  height: 665px;
  padding: 50px;
}
</style>


