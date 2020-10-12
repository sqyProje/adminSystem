<template>
    <div class="app-container" style="background-color:#f1f1f1">
      <iframe :src="this.$route.query.url+'?userToken='+this.$route.query.userToken" frameborder="0" width="100%" height="1000"></iframe>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
       data(){
         return{
           Urls:''
         }
    },
      mounted(){
        this.Urls=this.$route.query.url
       // console.log(decodeURIComponent(this.Urls))
      },
    }

</script>

<style>

</style>
