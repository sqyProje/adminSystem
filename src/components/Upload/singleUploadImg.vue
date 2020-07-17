<template>
  <div class="">
    <!-- <el-form-item label="logo" prop="logo">-->
    <el-upload
      class="avatar-uploader"
      ref="upload"
      action="string"
      :show-file-list="false"
      :disabled="true"
      :before-upload="onBeforeUploadImage"
      :http-request="UploadImage"
      :on-change="fileChange"
      :file-list="fileList"
    >
      <img :src="toChild" alt="" v-show="toChildImg && toChildImgDefault" width="70" height="60">
      <img :src="this.imgResponse" v-show="!toChildImg || !toChildImgDefault" width="60" height="60">
      <el-button size="mini" type="primary" style="vertical-align: text-bottom;">点击上传</el-button>
    </el-upload>
    <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
    <!--</el-form-item>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import {editInfo,uploadfile} from '@/api/login'
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
  import ElUpload from "../../../node_modules/element-ui/packages/upload/src/index.vue";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import defaultImg from '@/assets/images/defaultupload.png'
  export default {
    name:'UploadImg',
    props:{
      toChild:String
    },
    components: {
      ElFormItem,
      ElUpload,
      ElInput},
    data () {
      return {
        toChildImg:true,
        toChildImgDefault:true,
        imgResponse:defaultImg,
        fileList: [],
       // logo:''
      }
    },
    mounted(){
      if(!this.toChild){
        this.toChildImg = !this.toChildImg
      }
    },
    watch:{
      'toChild':{
        handler(Val){
          if(Val != undefined){
            this.toChildImg = true
            console.log(this.toChildImg)
          }else{
            this.toChildImg = !this.toChildImg
            console.log(this.toChildImg)
          }
        }
      }
    },

    methods: {
      onBeforeUploadImage(file) {
        const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isIMAGE) {
          this.$message.error('上传文件只能是图片格式!')
        }
        if (!isLt1M) {
          this.$message.error('上传文件大小不能超过 1MB!')
        }
        return isIMAGE && isLt1M
      },
      UploadImage(param){
        const formData = new FormData()
        formData.append('file', param.file)
        uploadfile(formData).then(response => {
          this.imgResponse=response.datas
          this.toChildImg = false
          this.toChildImgDefault =false
          console.log(this.toChildImg)
          this.$emit('fromChildImg',this.imgResponse)
        }).catch(response => {
          console.log('图片上传失败')
        })
      },
      fileChange(file){
        this.$refs.upload.clearFiles() //清除文件对象
     //   this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
        this.fileList = [{name: file.name, url: file.url}] // 重新手动赋值filstList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
        this.toChildImg = false
        this.toChildImgDefault =false
      //  console.log(this.toChildImg)
      }
    }
  };
</script>
