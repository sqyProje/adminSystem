<template>
  <el-col :xs="8" :sm="6" :md="3" class="scroll-wrap" >
    <el-scrollbar wrap-class="scrollbar-wrapper" style="width: 90%;height: calc(100vh - 160px);margin-bottom: 20px">
      <el-input
        placeholder="输入上级部门"
        v-model="filterText"
        size="mini"
        style="margin-bottom: 6px;width: 90%;"
      >
      </el-input>
      <el-tree
        ref="leftTree"
        :data="menuInfoArray"
        node-key="uId"
        @node-click="handleNodeClickDepart"
        default-expand-all
        :filter-node-method="filterNode"
        :props="defaultProps"
      >
      </el-tree>
    </el-scrollbar>
  </el-col>
</template>
<script type="text/ecmascript-6">
  import {GetDutyInfoArray} from '@/api/personnel'
    export default {
      name:'searchtree',
      data(){
        return{
          filterText:'',
          menuInfoArray:[{
            'name':'全部',
            'uId':'',
            'childMenu':[]
          }],
          defaultProps: {
            children: 'childMenu',
            label: 'name'
          },
        }
      },
      props:{
        toChildId:{
          type:String,
        },
        toChildTree:{
          type:Array,
        }
      },
      watch:{
        filterText(val){
          this.$refs.leftTree.filter(val)
        },
        toChildTree(val) {
      //    console.log(val)
          this.menuInfoArray[0].childMenu=this.toChildTree

        }
      },
      mounted(){
      },

      methods:{
        handleNodeClickDepart(val){
         // console.log(val)
          this.$emit('childFnToParent',{uId:val.uId,Name:val.name})
        },
        filterNode(value,data){
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        }
      }
    }
</script>

<style>
  .scroll-wrap .el-scrollbar .el-scrollbar_wrap{
    overflow-x: hidden;
  }
  .scroll-wrap .el-tree>.el-tree-node{display:inline-block;}
  .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
</style>
