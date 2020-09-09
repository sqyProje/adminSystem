<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  /*//滚动条的宽度*/
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
 /* //滚动条的滑块*/
    ::-webkit-scrollbar-thumb {
      background-color: rgba(144, 147, 153, 0.3);
      border-radius: 3px;
    }
</style>
