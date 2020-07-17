<template> 
  <div>
    <el-upload
      class="upload-demo"
      name="fileName"
      action="http://192.168.1.7:8088/file/getPicPath"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success = 'handleSuccess'
      list-type="picture-card"
      :limit="10"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog
      :visible.sync="picDialogVisible"
      width="25%"
      append-to-body
    >
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      picArray: String,
      //最大上传图片数量
      maxCount: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        fileList: [],
        dialogImageUrl: '',
        picDialogVisible: false,
      };
    },
    watch:{
      'picArray'(){
        if(this.picArray.length<=0){
          this.fileList=[]
        }else{
          const pictureList=this.picArray.split(",")
          this.fileList = pictureList.map(item => {
            return {
              url: item
            }
          });
        }
      }
    },
    methods: {
      handleSuccess(response, file, fileList) {
        this.fileList.push({url: response.datas})
        this.$emit('imgUrl',response.datas)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.picDialogVisible = true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    }
  }
</script>
<style>

</style>


