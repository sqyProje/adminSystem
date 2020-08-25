<template>
  <div>
    <div class="tittle">
      <b>去汇报</b>
    </div>
    <div class="ToReport">
      <el-form :model="ruleForm" ref="ruleForm" label-width="200px" class="demo-ruleForm">
        <el-form-item style="width: 700px" label="主题" prop="theme">
          <el-input v-model="ruleForm.theme"></el-input>
        </el-form-item>
        <el-form-item style="width: 700px" label="内容" prop="substance">
          <Editor v-model="ruleForm.substance" :curValue="ruleForm.substance" @input="newContent"></Editor>
        </el-form-item>

        <el-form-item>
          <el-button type="success" icon="el-icon-s-promotion" @click="submitForm('ruleForm')">发送</el-button>
          <el-button @click="resetForms('ruleForm')">保存为草稿</el-button>
          <el-button @click="resetForm('ruleForm')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bom-box">河南健康奇点网络科技有限公司©All Rights Reserved.</div>
  </div>
</template>
<script>
import { Message, MessageBox } from "element-ui";
import {
  ToReport,
  DraftEditor,
  getToReport,
  addReport,
  editReport
} from "@/api/personalDoor";
import Editor from '@/components/Tinymce/Editor'
export default {
  data() {
    return {
      ruleForm: {},
      restaurants: [],
      state1: "",
      state2: "",
      tableData: [],
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
          ],
        },
      },
    };
  },
  components:{
      Editor
    },
  created() {
  },
  mounted() {
    
  },
  methods: {
    submitForm(formName) {},
    resetForm(formName) {
      this.$router.back();
    },
    handleSelect(item) {
      this.state2 = item.id;
    },
    querySearch(queryString, cb) {
      getToReport().then(({ datas }) => {
        for (var i = 0; i < datas.length; i++) {
          datas[i].value = datas[i].realname;
          datas[i].id = datas[i].uId;
        }
        cb(datas);
      });
    },
    // 保存草稿
    resetForms() {
      let ruleFormss = {
        title: this.ruleForm.theme,
        content: this.tableData.content,
        toReportId: this.state2,
        state: 0,
      };
      this.$refs.ruleForm.validate((valid) => {
        addReport(ruleFormss).then((response) => {
          this.$router.back(-1)
        });
      });
    },
    // 发送信件
    submitForm() {
      let ruleFormss = {
        title: this.ruleForm.theme,
        content: this.tableData.content,
        toReportId: this.state2,
        state: 1,
      };
      var ss = JSON.stringify(ruleFormss);
      this.$refs.ruleForm.validate((valid) => {
        addReport(ss).then((response) => {
          this.$router.back(-1)
        });
      });
    },
    newContent(val){
        console.log(val)
        this.tableData.content= val
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
  background-color: #f5f5f5;
}
</style>


