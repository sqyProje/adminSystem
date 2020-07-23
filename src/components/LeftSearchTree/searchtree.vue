<template>
  <el-col :span="3">
    <div style="padding-right: 16px;">
      <el-input
        placeholder="输入上级部门"
        v-model="filterText"
        size="mini"
        style="margin-bottom: 6px;"
      >
      </el-input>
      <el-tree
        ref="leftTree"
        :data="menuInfoArray"
        node-key="uId"
        @node-click="handleNodeClickDepart"
        default-expand-all
        :filter-node-method="filterNode"
        :props="defaultProps">
      </el-tree>
    </div>
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
          console.log(val)
          this.menuInfoArray[0].childMenu=this.toChildTree

        }
      },
      mounted(){
      },

      methods:{
        handleNodeClickDepart(val){
          this.$emit('childFnToParent',val.uId)
        },
        filterNode(value,data){
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        }
      }
    }
</script>

<style>
  .text-center{
    text-align: center;
  }
</style>
