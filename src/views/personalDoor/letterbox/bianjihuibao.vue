<template>
  <div>
    <div class="tittle">
      <b>编辑汇报</b>
    </div>
    <div class="ToReport" style="width:700px ">
      <el-form :model="ruleForm" size="mini" ref="ruleForm":rules="rulesInfo" label-width="200px" class="demo-ruleForm">
        <el-form-item  label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <Editor v-model="ruleForm.content" :curValue="ruleForm.content" @input="newContent"></Editor>
        </el-form-item>
        <el-form-item label="被汇报人" prop="toReportId">
          <el-select v-model="ruleForm.toReportId" filterable placeholder="请选择被汇报人" style="width: 100%">
            <el-option
              v-for="item in reportMan"
              :key="item.uId"
              :label="item.realname"
              :value="item.uId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="ruleForm.state">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">提交</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Message, MessageBox } from "element-ui";
import Editor from "@/components/Tinymce/Editor";
import {ToReport,DraftEditor,getToReport,addReport,editReport,editReports} from "@/api/personalDoor";

export default {
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
          ],
        },
      },
      ruleForm: {},
      reportMan: [],
      rulesInfo: {
        title: [{ required: true,trigger: 'blur',message: '请输入标题'}],
        toReportId:[{ required: true,trigger: 'blur',message: '请选择被汇报人'}]
      }
    };
  },
  components: {
    Editor,
  },
  created() {
    getToReport().then((response) => {
      this.reportMan = response.datas;
    });
  },
  mounted() {
    this.editReport1(this.$route.query.uId);
  },
  methods: {
    editReport1(uId) {
      editReport(uId).then((res) => {
        this.ruleForm = {
          uId:res.datas.uId,
          title:res.datas.title,
          content:res.datas.content,
          toReportId:res.datas.toreportuserid,
          state:res.datas.state,
        };
      });
    },
    resetForm(formName) {
      this.$router.back();
    },
    // 保存
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          editReports(this.ruleForm).then((response) => {
            this.$router.back(-1);
          });
        }
      });
    },
    newContent(val) {
      this.ruleForm.content = val;
    },
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


