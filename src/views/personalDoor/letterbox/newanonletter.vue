<template>
  <div>
    <div class="tittle">
      <b>发起新的匿名信</b>
    </div>
    <div class="ToReport">
      <el-form :model="ruleForm" ref="ruleForm" label-width="200px" :rules="rulesInfo" size="small" class="demo-ruleForm">
        <el-form-item size="mini" style="width: 700px;" label="标题" prop="theme">
          <el-input v-model="ruleForm.theme"></el-input>
        </el-form-item>
        <el-form-item style="width: 700px" label="内容" prop="substance">
          <Editor v-model="ruleForm.substance" :curValue="ruleForm.substance" @input="newContent"></Editor>
        </el-form-item>
        <div style="margin:10px 0px 10px 200px; ">
          <el-radio-group v-model="isanonym" size="small">
            <el-radio label="0" border>不匿名</el-radio>
            <el-radio label="1" border>匿名</el-radio>
          </el-radio-group>
        </div>
        <el-form-item>
          <el-button type="success" icon="el-icon-s-promotion" @click="submitForm('ruleForm')">发送</el-button>
          <el-button @click="resetForm('ruleForm')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script >
import {Message} from 'element-ui'
import { toLetter } from "@/api/personalDoor";
import Editor from "@/components/Tinymce/Editor";
export default {
  data() {
    return {
      isanonym:'1',
      // radio: '1',
      ruleForm: {
        substance: "",
        theme: "",
      },
      token: "",
      rulesInfo: {
        theme: [{ required: true,trigger: 'blur',message: '请输入标题'}],
        substance:[{ required: true,trigger: 'blur',message: '请输入内容'}]
      }
    };
  },
  methods: {
    submitForm() {
      let ruleFormss = {
        content: this.ruleForm.substance,
        title: this.ruleForm.theme,
        isanonym: this.isanonym,
      };

      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          toLetter(ruleFormss).then((response) => {
            this.$router.back(-1);
          });
        }else{
          Message({
            type: 'error',
            message: '验证参数不合法'
          });
        }

      });
    },
    resetForm() {
      this.$router.back(-1);
    },
    newContent(val) {
      this.ruleForm.substance = val;
    },
  },
  components: {
    Editor,
  },
};
</script>

<style >
.tittle {
  padding: 10px;
  border-bottom: 1px solid #cccccc;
}
.ToReport {
  width: 100%;
  height: 785px;
  /* border: 5px solid #f5f5f5; */
  border-radius: 5px 5px 0px 0px;
  margin-top: 10px;
}
</style>


