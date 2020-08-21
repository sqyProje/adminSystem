<template>
  <div>
    <div class="tittle">
      <b>会议详情</b>
    </div>
    <div class="ToReport">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
      <el-form-item label="收件人" style="width: 700px" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item style="width: 700px" label="主题" prop="theme">
          <el-input v-model="ruleForm.theme"></el-input>
        </el-form-item>

        <el-form-item label="内容" style="width: 700px;" prop="substance">
          <el-input type="textarea" :rows="14" :max-rows='15' v-model="ruleForm.substance"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="success" icon="el-icon-s-promotion" @click="submitForm('ruleForm')">发送</el-button>
          <el-button @click="resetForm('ruleForm')">保存为草稿</el-button>
          <el-button @click="resetForm('ruleForm')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bom-box">河南健康奇点网络科技有限公司©All Rights Reserved.</div>
  </div>
</template>
<script >
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        region: "",
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入收件人", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],

        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
    };
  },
  methods: {
    resetForm(){
      this.$router.back(-1)
    }
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
  background-color: #F5F5F5;
}
</style>


