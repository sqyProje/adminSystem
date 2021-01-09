<template> 
  <div><!-- :class="{hide:hideUpload}"-->
    <el-upload
       name="fileName"
      :multiple='false'
      :limit="limitCount"
      :action=" this.baseURL+'/file/getFilePath'"
      :headers = "headers"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-error	="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUploadFile"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传文件且支持xlsx，xls，zip，rar，doc，docx文件，大小不超过20Mb</div>
    </el-upload>
  </div>
</template>
<script>
  import {DeleteFileUrl} from '@/api/basic'
  import store from '../../store'
  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      fileArray:String,
      //最大上传图片数量
      maxCount: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        hideUpload:false,
        limitCount:100,
        fileList: [],
        headers:{
          Authorization: localStorage.getItem('loginToken') //从cookie里获取token，并赋值  Authorization ，而不是token
        }
      };
    },
    watch:{
      'fileArray'(){
        if(this.fileArray.length<=0){
          this.fileList=[]
        }else{
        // this.fileList=this.fileArray
          const pictureList=this.fileArray.split(",")
         // console.log(pictureList)
          this.fileList = pictureList.map((item,key) => {
            return {
              url: item,
              name:item.substring(50,item.length)
            }
          });
        }
      }
    },
    mounted(){
   //   console.log(this.picArray)
    },
    methods: {
      handleSuccess(response, file, fileList) {
      //  this.hideUpload = true
        this.fileList.push({name: response.datas.fileName,url: response.datas.filePath})
        this.$emit('file-url',decodeURIComponent(response.datas.filePath))
        this.$message.success('文件上传成功');
      },
      handleError(err){
        this.$msgbox.alert('登录信息过期，请重新登录', '确定登出', {//error.response.data.msg
          confirmButtonText: '重新登录',
          type: 'warning',
          callback:action=>{
            store.dispatch('FedLogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          }
        })
      },
      // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
      beforeUploadFile(file) {
        let extension = file.name.substring(file.name.lastIndexOf('.')+1);
        let size = file.size / 1024 / 1024;
        if(extension !== 'xlsx' && extension !=='xls' && extension !=='zip' && extension !=='rar'&& extension !=='doc' && extension !=='docx') {
          this.$message.warning('只能上传后缀是xlsx,xls,zip,rar,doc,docx的文件');
          return false
        }
        if(size > 20) {
          this.$message.warning('文件大小不得超过20M');
        }
      },
      handleRemove(file, fileList) {
        this.fileList = fileList
        if (file && file.status==="success") {
          let multiUrl = ''
          fileList.forEach((value, key) => {
            multiUrl = multiUrl + value.url + ','
          })
          this.$message.warning('删除成功');
          this.$emit('delFile', decodeURIComponent(file.url))
        }
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 100 个文件，请删除后继续上传`)
      },
      // 文件上传失败时的钩子
      handleError(err, file, fileList) {
        this.$message.error('文件上传失败');
      },
      parentClickClear(){
      //  this.fileArray=''
        this.fileList=[]
      }
    }
  }
</script>
<style>
  .hide .el-upload--text {
    display: none;
  }
</style>


