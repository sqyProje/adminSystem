<template> 
  <div>
    <el-upload
      :class="{hide:hideUpload}"
      name="fileName"
      :multiple='false'
      :limit="limitCount"
      :action=" this.baseURL+'/file/getFilePath'"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeUploadFile"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传一份文件且支持zip，rar，pdf，doc文件，大小不超过20Mb</div>
    </el-upload>
  </div>
</template>
<script>
  import {DeleteFileUrl} from '@/api/basic'
  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      picArray: {
        type: Array,
        default: []
       },
      //最大上传图片数量
      maxCount: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        hideUpload:false,
        limitCount:1,
        fileList: [],
      };
    },
    watch:{
      'picArray'(){
        if(this.picArray.length<=0){
          this.fileList=[]
        }else{
         this.fileList=this.picArray
        }
      }
    },
    methods: {
      handleSuccess(response, file, fileList) {
        this.hideUpload = true
        this.fileList.push({name: response.datas.fileName,url: response.datas.filePath})
        this.$emit('file-url',decodeURIComponent(response.datas.filePath))
        this.$message.success('文件上传成功');
      },
      // 文件状态改变时的钩子
      handleChange(file, fileList) {
      //  console.log(file.raw);
      //  this.fileList.push(file.raw) ;
      //  console.log(this.fileList);
      },
      // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
      beforeUploadFile(file) {
        let extension = file.name.substring(file.name.lastIndexOf('.')+1);
        let size = file.size / 1024 / 1024;
        if(extension !== 'xlsx' && extension !=='xls' && extension !=='zip' && extension !=='rar'&& extension !=='doc' && extension !=='docx') {
          this.$message.warning('只能上传后缀是.xlsx,.xls,.zip,.rar,.doc,.docx的文件');
          return false
        }
        if(size > 20) {
          this.$message.warning('文件大小不得超过20M');
        }
      },
      handleRemove(file, fileList) {
        DeleteFileUrl( file.url).then(res=>{
          this.hideUpload = false
          this.$message.warning(res.msg);
          this.fileList = []
          this.$emit('file-url','')
        })
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
      },
      // 文件上传失败时的钩子
      handleError(err, file, fileList) {
        this.$message.error('文件上传失败');
      }
    }
  }
</script>
<style>
  .hide .el-upload--text {
    display: none;
  }
</style>


