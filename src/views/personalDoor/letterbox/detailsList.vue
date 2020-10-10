
<template>
  <!-- 匿名信详情 -->
  <div class="root-box">
    <div class="title-box">
      <el-button type="primary" size="mini" @click="goBack" icon="el-icon-d-arrow-left" plain>返回</el-button>
    </div>
    <div class="Letters-messages">
      <div>{{neirong.title}}</div>
      <div class="Information-style">收件人:&nbsp;&nbsp;<span>{{neirong.toRealname}}</span></div>
      <div class="Information-style">时&nbsp;&nbsp;&nbsp;&nbsp;间:&nbsp;&nbsp;{{neirong.createdate}}</div>
    </div>


      <!-- <Editor :curValue="neirong.content" @input="newContent"></Editor> -->
      <div class="neirong-box" v-html="neirong.content"></div>
  </div>
</template>
<script >
import { Message, MessageBox } from "element-ui";
import { detailsList } from "@/api/personalDoor";
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
      detailsList(uId).then((res) => {
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

.root-box {
  margin: 10px;
  background-color: #f1f1f1;
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
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
}
.Information-style {
  padding-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(151, 151, 151, 1);
}
.neirong-box {
  min-height: 665px;
  padding: 50px;
}
span{
  color:rgba(15,155,5,1);
}
</style>


