<template>
  <div>
    <div class="tittle">
      <b>匿名信</b>
    </div>
    <div class="ToReport">
      <el-form :model="ruleForm" ref="ruleForm" label-width="200px" class="demo-ruleForm">
        <el-form-item style="width: 700px" label="主题" prop="theme">
          <el-input v-model="ruleForm.theme"></el-input>
        </el-form-item>

        <el-form-item label="内容" style="width: 700px;" prop="substance">
          <el-input type="textarea" :rows="14" :max-rows="15" v-model="ruleForm.substance"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="success" icon="el-icon-s-promotion" @click="submitForm('ruleForm')">发送</el-button>
          <el-button @click="resetForm('ruleForm')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bom-box">河南健康奇点网络科技有限公司©All Rights Reserved.</div>
  </div>
</template>
<script >
// import {  MessageBox,} from "element-ui";
import { toLetter } from "@/api/personalDoor";
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      isanonym: 1,
      ruleForm: {
        substance: "",
        theme: "",
      },
      token:""
    };
  },
  methods: {
    submitForm() {
      let ruleFormss = {
        content: this.ruleForm.substance,
        title: this.ruleForm.theme,
        isanonym: this.isanonym,
      };
      var ss = JSON.stringify(ruleFormss);
      this.$refs.ruleForm.validate(valid => {
          toLetter(ss)
            .then(response=>{
              this.$router.back(-1)
            })
      })
    },
    resetForm() {
      this.$router.back(-1);
    },
  },
};
</script>

<style scoped>
.tittle {
  padding: 10px;
  border-bottom: 1px solid #cccccc;
}
.ToReport {
  width: 100%;
  height: 785px;
  border: 5px solid #f5f5f5;
  border-radius: 5px 5px 0px 0px;
}
.bom-box {
  text-align: center;
  font-size: 12px;
  height: 60px;
  line-height: 60px;
  background-color: #f5f5f5;
}
</style>


