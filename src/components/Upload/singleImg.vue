<template> 
  <div>
    <!--:class="{hide:hideUpload}"-->
    <el-upload
      name="fileName"
      :class="{hide:hideUpload}"
      :action="this.baseURL+urlSign"
      :headers = "headers"
      list-type="picture-card"
      :limit="limitCount"
      accept="image/jpeg,image/png"
      :multiple="false"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-exceed="handleExceed"
      :on-preview="handlePreview">
      <i class="el-icon-plus"></i>
      <div slot="tip" >只能上传一张jpg/png文件，且不超过1MB</div>
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
  import {DeleteFileUrl} from '@/api/basic'
  export default {
    name: 'singleUpload',
    data(){
      return {
        hideUpload:false,
        limitCount:1,
        dialogVisible: false,
        fileList:[],
        dialogImageUrl: '',
        headers:{
          Authorization: localStorage.getItem('loginToken') //从cookie里获取token，并赋值  Authorization ，而不是token
        },
      }
    },
    props: {
      value:{
        type:String,
        default:''
      } ,
      urlSign:{
        type:String,
        default: '/file/getPicPath' /*/file/getIconPicPath*/
      },
     /* hideUpload:{
        type:Boolean,
        default:false
      }*/
    },
    watch:{
      'value'(){
        if(this.value==undefined){
          this.fileList=[]
          this.hideUpload = false
          return
        }
        if(this.value.length<=0){
          this.fileList=[]
          this.hideUpload = false
        }else if(this.value.length>0){
          const pictureList=this.value.split(",")
          this.fileList = pictureList.map(item => {
            return {
              url: item
            }
          });
          this.hideUpload = true
        }
      }
    },
    mounted(){
      if(this.value==undefined){
        this.fileList=[]
        this.hideUpload = false
        return
      }
      if(this.value.length<=0){
        this.fileList=[]
        this.hideUpload = false
      }else if(this.value.length>0) {
        const pictureList = this.value.split(",")
        this.fileList = pictureList.map(item => {
          return {
            url: item
          }
        });
        console.log( this.value.length > 0 ? true :false)

        this.hideUpload = true

      }
    },
    methods: {
      beforeAvatarUpload(file){
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
      handleRemove(file, fileList) {
        if (file && file.status==="success") {
          this.hideUpload = false
          this.$message.warning('删除成功');
          this.$emit('input', '')
        }
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，请删除后重新上传`);
      },
      handleUploadSuccess(res, file) {
        console.log(res)
        this.fileList=[{name: file.name, url: res.datas}];
        this.hideUpload = this.fileList.length >= this.limitCount;
        this.hideUpload = true
        this.$emit('input', res.datas)
      }
    }
  }
</script>
<style>
  /* .el-upload--picture-card,.el-upload-list--picture-card .el-upload-list__item{
    width: 100px;
    height:100px;
    line-height:100px;
  }*/
  .hide .el-upload--picture-card {
    display: none;
  }
</style>


