<template>
  <div  class="app-wrapper" :class="classObj"><!-- -->
    <div :class="slideNames.className">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container"></sidebar>
      <div :class="{hasTagsView:needTagsView}"  class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <navbar></navbar>
          <tags-view  v-if="needTagsView"/>
        </div>
        <app-main></app-main>
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
        <person-date v-if="dateInfo"></person-date>
        <Footer></Footer>
      </div>
    </div>

  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { Navbar, Sidebar, AppMain, TagsView, Settings, PersonDate,Footer} from './components'
//import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    RightPanel,
    Settings,
    PersonDate,
    Footer
  },
 // mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    needTagsView () {
      return this.$store.state.settings.tagsView
    },
    fixedHeader (){
      return this.$store.state.settings.fixedHeader
    },
    device() {
      return this.$store.state.app.device
    },
    showSettings() {
      return this.$store.state.settings.showSettings
    },
    dateInfo(){
      return this.$store.state.user.dateInfo.bool
    },
    slideNames(){
      return this.$store.state.app.slideName
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  @import "src/styles/variables.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .fixed-header{
    position: fixed;
    top:0;
    right:0;
    z-index:9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s
  }
</style>
