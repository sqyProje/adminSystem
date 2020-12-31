
<template>
  <div class="footer">
    河南健康奇点网络科技有限公司 | 地址：河南省郑州市郑东新区木华广场3号楼A座601室 | 电话：0371-88917172 | 豫ICP备19022191号-1
    &copy;   {{getFullYear}}<a href="http://hnjkqd.com/" target="_blank" style="color: #00a0e9">hnjkqd.com</a>版权所有
  </div>
</template>
<script>
export default {
  computed: {
    getFullYear(){
      let myDate= new Date()
      return myDate.getFullYear()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/variables.scss";
  .footer{
    width: calc(100% - #{$sideBarWidth});
    height: 30px;
    line-height:30px;
    font-size: 13px;
    text-align: center;
    color: #868686;
    background-color:#304156;
    position: fixed;
    bottom: 0;
    z-index:1001;
  }
</style>
