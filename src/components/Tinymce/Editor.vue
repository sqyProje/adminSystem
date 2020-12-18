<template>
  <div class="SEditor">
    <vue-tinymce
      v-model="value"
      :setting="setting" >
    </vue-tinymce>
  </div>
</template>

<script>
  export default {
  data() {
    return {
      value:this.curValue,
      setting: {
        menubar: false,//顶部菜单栏的显示
        toolbar: "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars",
        language: 'zh_CN',
        height: 350,
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
  watch: {
    curValue(newValue) {
      this.value = newValue
   //   console.log(this.value)
    },
    value(newValue) {
      this.$emit('input', newValue)
    }
  }
  }
</script>

<style>

</style>
