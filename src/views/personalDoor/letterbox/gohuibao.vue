<template>
  <div>
    <div class="tittle">
      <b>去汇报</b>
    </div>
    <div class="ToReport">
      <el-form :model="ruleForm" ref="ruleForm" label-width="200px" class="demo-ruleForm">
        <el-form-item size="mini" style="width: 700px" label="主题" prop="theme">
          <el-input v-model="ruleForm.theme"></el-input>
        </el-form-item>
        <el-form-item style="width: 700px" label="内容" prop="substance">
          <Editor v-model="ruleForm.substance" :curValue="ruleForm.substance" @input="newContent"></Editor>
        </el-form-item>
           <el-form-item style="width: 700px" label="收件人" prop="name">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="state2.realname"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-s-promotion" @click="submitForm('ruleForm')">发送</el-button>
          <el-button @click="resetForms('ruleForm')">保存为草稿</el-button>
          <el-button @click="resetForm('ruleForm')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Message, MessageBox } from "element-ui";
import {
  getToReport,
  addReport,
  defaultReport
} from "@/api/personalDoor";
import Editor from '@/components/Tinymce/Editor'
export default {
  data() {
    return {
      ruleForm: {},
      state2: [],
      tableData: [],
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
          ],
        },
      },
      defaultReports:[]
    };
  },
  components:{
      Editor
    },
  created() {
    defaultReport().then(res=>{

      this.defaultReports = res.datas
    })
  },
  mounted() {
    
  },
  methods: {
    resetForm(formName) {
      this.$router.back();
    },
    handleSelect(item) {
      this.state2 = item;
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
        toReportId: this.state2.id,
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
        toReportId: this.state2.id,
        state: 1,
      }; 
      this.$refs.ruleForm.validate((valid) => {
        addReport(ruleFormss).then((response) => {
          defaultReport().then(()=>{
            this.$router.back(-1)
          })
        });
      });
    },
    newContent(val){
        this.tableData.content= val
      }
  },
  
};
</script>

<style scoped>
.tittle {
  padding: 10px;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 10px;
}
.ToReport {
  width: 100%;
  height: 785px;

  border-radius: 5px 5px 0px 0px;
}

</style>


