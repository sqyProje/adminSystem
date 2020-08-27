<template>
  <div>
    <svg t="1585816188489" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="2233" width="20" height="20"
        :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" >
      <path
        d="M131.413333 85.333333h142.933334a32 32 0 1 0 0-64H54.186667a32 32 0 0 0-32 32v221.013334a32 32 0 1 0 64 0V131.413333l344.32 344.32a32 32 0 0 0 45.226666-45.226666zM969.813333 717.653333a32 32 0 0 0-32 32v142.506667l-344.32-344.32a32 32 0 0 0-45.226666 45.226667l344.32 345.6h-142.933334a32 32 0 0 0 0 64h220.16a32 32 0 0 0 32-32v-221.013334a32 32 0 0 0-32-32zM999.253333 42.666667a32 32 0 0 0-29.44-19.626667h-220.16a32 32 0 1 0 0 64h142.506667l-344.32 344.32a32 32 0 1 0 45.226667 45.226667L938.666667 131.413333v142.933334a32 32 0 1 0 64 0V54.186667a32 32 0 0 0-3.413334-11.52zM430.506667 548.266667L85.333333 892.586667v-142.933334a32 32 0 1 0-64 0v220.16a32 32 0 0 0 32 32h221.013334a32 32 0 1 0 0-64H131.413333l344.32-344.32a32 32 0 0 0-45.226666-45.226666z"
        fill="" p-id="2234"></path>
    </svg>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      // console.log(screenfull.isEnabled)
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
