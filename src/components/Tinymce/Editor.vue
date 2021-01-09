<template>
  <div class="SEditor">
    <vue-tinymce
      v-model="value"
      :setting="setting">
    </vue-tinymce>
  </div>
</template>

<script>

  import {uploadfile } from '@/api/login'
  import indent2em from '../../../static/tinymce/plugins/indent2em/plugin.min.js'
  import lineheight from '../../../static/tinymce/plugins/lineheight/plugin.min.js'
  export default {
  data() {
    return {
      value:this.curValue,
      setting: {
        menubar: false,//顶部菜单栏的显示
        toolbar: "undo redo |fullscreen| styleselect formatselect alignleft aligncenter alignright alignjustify  indent2em lineheight | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |  code preview " +
        "help hr searchreplace emoticons  cut copy paste selectall |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough  | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars preview emoticons help hr searchreplace",
        language: 'zh_CN',
        height: 350,
        font_formats: "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        fontsize_formats: "14px 15px 16px 17px 18px 19px 20px 24px",
        images_upload_handler: (blobInfo, success, failure) => {
          let formData = new FormData();
          formData.append('folder', 'editor/img');
          formData.append('fileName', blobInfo.blob(), blobInfo.filename());
          uploadfile(formData).then(response => {
            let fileArr = response.datas;
            success(fileArr);
          })
          .catch(()=>{
            failure("上传失败")
          })
        }
      }
    }
  },
  props: {
    curValue:{
      type:String,
      default:''
    }
  },
  mounted(){
    this.value = this.curValue
  },
  watch: {
    curValue(newValue) {
      this.value = newValue
    //  console.log(this.value)
    },
    value(newValue) {
      this.$emit('input', newValue)
    }
  }
  }
</script>

<style>

</style>
