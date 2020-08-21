<template>
  <div class="ToReport">
    <div class="ToReport-title">去汇报</div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="主题" prop="theme">
        <el-input v-model="ruleForm.theme"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="substance">
        <quill-editor
          class="fuwenbenbianji"
          v-model="tableData.content"
          :options="editorOption"
          ref="QuillEditor"
        ></quill-editor>
      </el-form-item>

      <el-form-item label="收件人" prop="name">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="state1"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">发送</el-button>
        <el-button @click="resetForms('ruleForm')">保存为草稿</el-button>
        <el-button @click="resetForm()">关闭</el-button>
      </el-form-item>
    </el-form>
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
import { quillEditor } from "vue-quill-editor";
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
      var ss = JSON.stringify(ruleFormss);
      this.$refs.ruleForm.validate((valid) => {
        addReport(ss).then((response) => {
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
  },
  
};
</script>

<style scoped>
.ToReport {
  width: 95%;
  margin: 0 auto;
  border: 5px solid #f5f5f5;
  border-radius: 5px 5px 0px 0px;
}
.ToReport-title {
  height: 30px;
  line-height: 30px;
  color: #ffffff;
  padding-left: 20px;
  background-color: #3c82fe;
  margin-bottom: 10px;
  border-radius: 5px 5px 0px 0px;
}
.fuwenbenbianji {
  height: 300px;
  padding-bottom: 50px;
}
.shoujianr-box {
  display: flex;
  justify-content: space-around;
}
</style>


