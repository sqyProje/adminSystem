<template> 
  <div>
    <el-upload
      ref="Upload"
      class="upload-demo"
      name="fileName"
      :action="this.baseURL+'/file/getPicPath'"
      :headers = "headers"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success = 'handleSuccess'
      :on-change = "handleChange"
      :on-progress="handleProcess"
      list-type="picture-card"
      :limit="1000"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
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
        headers:{
          Authorization: localStorage.getItem('loginToken') //从cookie里获取token，并赋值  Authorization ，而不是token
        }
      };
    },
    watch:{
      'picArray'(){
        if(this.picArray.length<=0){
          this.fileList=[]
        }else{
          const pictureList=this.picArray.split(",")
        //  console.log(this.fileList)
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
      //  console.log('之前')
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isJPG && !isPNG) {
          this.$message.warning('上传图片必须是JPG/PNG 格式!');
          return isJPG && isPNG ;
        }
        if (!isLt1M) {
          this.$message.warning('上传图片大小不能超过 1MB!');
          return isLt1M;
        }
      },
      handleChange(file,fileList){
        //  console.log('改变')
      },
      handleProcess(event,file,fileList){
      //  console.log('上传进度')
      },
      handleSuccess(response, file, fileList) {
      //  console.log('成功')
        this.fileList.push({url: response.datas})
        this.$emit('imgUrl',response.datas)
      },
      handleRemove(file, fileList) {
        if (file && file.status==="success") {
          let multiUrl = ''
          fileList.forEach((value, key) => {
            multiUrl = multiUrl + value.url + ','
          })
          this.fileList = fileList
          this.$message.warning('删除成功');
          this.$emit('delUrl', file.url)
        }
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.picDialogVisible = true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1000 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      parentClickClear(){
      //  this.picArray=''
        this.fileList=[]
      }
    }
  }
</script>
<style>
  /*.el-upload--picture-card,.el-upload-list--picture-card .el-upload-list__item{
    width:100px;
    height:100px;
    line-height:100px;
  }*/
</style>


