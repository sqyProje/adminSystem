<template>
  <!--@focus="selectTrigger()"-->
  <el-select
    v-model="mineStatus"
    placeholder="请选择"
    style="width: 100%"
  >
    <el-option :value="mineStatusValue" style="height: auto">
      <el-tree
        :data="Tree"
        node-key="uId"
        ref="roleData"
        @node-click="handleNodeClick"
        :props="defaultProps">
      </el-tree>
    </el-option>
  </el-select>
</template>
<script type="text/ecmascript-6">
  import {GetDepartInfoArray} from '@/api/personnel'
    export default {
      data(){
        return {
          mineStatus:'',
          mineStatusValue:'',
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
        names:{
          type:String
        },
        fatherMehto:{
          type:Function,
        },
        toChildTree:{
          type:Array,
        }
      },
      mounted(){

      },
      computed:{
        Tree(){
          if(this.names=="departname"){
            return this.menuInfoArray[0].childMenu=this.toChildTree
          }else if(this.names=='dutyname'){
            console.log(4)
          }
          //return this.menuInfoArray[0].childMenu=this.toChildTree
        },
      },
      methods:{
        selectTrigger(){
         /*if(this.fatherMehto){
           console.log(this.toChildTree)
           this.menuInfoArray[0].childMenu=this.toChildTree
         }*/

        },
        handleNodeClick(val){
          console.log(val)
          this.mineStatus = val.name
          this.$emit('childFnToParent',{
            ids:val.uId,
            name:val.name
          })
        }
      }
    }

</script>

<style>

</style>
