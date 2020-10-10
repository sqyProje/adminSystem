<template>
  <div  :class="classObj" class="app-wrapper">
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
      <div class="footer">
         河南健康奇点网络科技有限公司 | 地址：河南省郑州市郑东新区木华广场3号楼A座601室 | 电话：0371-88917172 | 豫ICP备19022191号-1
        &copy;   2020<a href="http://hnjkqd.com/" target="_blank" style="color: #00a0e9">hnjkqd.com</a>版权所有
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { Navbar, Sidebar, AppMain, TagsView, Settings} from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    RightPanel,
    Settings
  },
  mixins: [ResizeMixin],
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
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
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
  .footer{
    width: calc(100% - 210px);
    height: 30px;
    line-height:30px;
    font-size: 13px;
    text-align: center;
    color: #868686;
    background-color:#304156;
    position: fixed;
    bottom: 0;
    z-index:100001;
  }
</style>
