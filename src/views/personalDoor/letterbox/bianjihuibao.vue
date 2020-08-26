<template>
  <div class="ToReport">
    <div class="tittle">
      <b>去汇报</b>
    </div>
    <el-form :model="neirong" ref="neirong" label-width="150px" class="demo-ruleForm">
      <el-form-item style="width: 700px" label="主题">
        <el-input v-model="neirong.title"></el-input>
      </el-form-item>
      <el-form-item style="width: 700px" label="内容详情">
        <Editor :curValue="neirong.content" @input="newContent"></Editor>
      </el-form-item>
      <!--  @change="stationTrigger" -->
      <el-form-item label="收件人">
        <el-select
        class="shoujian-box"
          v-model="neirong.name"
          placeholder="收件人"
        > 
          <el-option
            v-for="item in stationData"
            :value="item.uId"
            :key="item.uId"
          >{{item.name}}</el-option>
        </el-select>
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
import Editor from "@/components/Tinymce/Editor";
import {
  ToReport,
  DraftEditor,
  getToReport,
  addReport,
  editReport,
  editReports,
} from "@/api/personalDoor";

export default {
  data() {
    return {
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
      neirong: {
        title: {},
        content: "",
        toRealname: "",
      },
      stationData: '',
    };
  },
  components: {
    Editor,
  },
  created() {
    getToReport().then((response) => {
      this.stationData = response.datas;
    });
  },
  mounted() {
    this.editReport1(this.$route.query.uId);
  },
  methods: {
    editReport1(uId) {
      editReport(uId).then((res) => {
        this.neirong = res.datas != null ?res.datas :[] ;
      });
    },
    submitForm(formName) {},
    resetForm(formName) {
      this.$router.back();
    },
    // 保存草稿
    resetForms() {
      let ruleFormss = {
        title: this.neirong.title,
        content: this.neirong.content,
        toReportId: this.neirong.toRealname,
        state: 0,
        uId: this.neirong.uId,
      };
      this.$refs.ruleForm.validate((valid) => {
        editReports(ruleFormss).then((response) => {
          this.$router.back(-1);
        });
      });
    },
    // 发送信件
    submitForm() {
      let ruleFormss = {
        title: this.neirong.title,
        content: this.neirong.content,
        toReportId: this.state2,
        state: 1,
        uId: this.neirong.uId,
      };
      this.$refs.neirong.validate((valid) => {
        editReports(ruleFormss).then((response) => {
          this.$router.back(-1);
        });
      });
    },
     newContent(val){
//         console.log(val)
        this.neirong.content= val
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


