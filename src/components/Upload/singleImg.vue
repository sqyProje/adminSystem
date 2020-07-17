<template> 
  <div>
    <el-upload
      class="upload-demo"
      name="fileName"
      action="http://192.168.1.7:8088/file/getPicPath"
      list-type="picture-card"
      :limit="1"
      accept="image/jpeg,image/png"
      :multiple="false"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-exceed="handleExceed"
      :on-preview="handlePreview">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      width="25%"
      append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'singleUpload',
    data(){
      return {
        dialogVisible: false,
        fileList:[],
        dialogImageUrl: '',
      }
    },
    props: {
      value: String,
      default:''
    },
    watch:{
      'value'(){
       // debugger
       // console.log(this.value)
        if(this.value==undefined){
          this.fileList=[]
          return
        }
        if(this.value.length<=0){
          this.fileList=[]
        }else if(this.value.length>0){
          const pictureList=this.value.split(",")
          this.fileList = pictureList.map(item => {
            return {
              url: item
            }
          });
        }
      }
    },
    methods: {
      beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt1M = file.size / 1024 / 1024 < 1;

        if (!isJPG && !isPNG) {
          this.$message.warning('上传图片必须是JPG/GIF/PNG/BMP 格式!');
        }
        if (!isLt1M) {
          this.$message.warning('上传图片大小不能超过 1MB!');
        }
        return (isJPG  || isPNG) && isLt1M;
      },
      handleRemove(file, fileList) {
        this.$emit('input', '')
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，请删除后重新上传`);
      },
      handleUploadSuccess(res, file) {
        this.fileList=[{name: file.name, url: res.datas}];
        this.$emit('input', res.datas)
      }
    }
  }
</script>
<style>

</style>


