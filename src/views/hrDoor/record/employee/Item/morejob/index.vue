<template>
  <div>
    <el-form
      ref="form"
      :rules="formRules"
      :inline="true"
      :model="form"
      label-width="80px"
      size="mini"
    >
      <el-form-item>
        <el-button type="success" size="mini" icon="el-icon-circle-plus-outline"@click="addItem">添加</el-button>
      </el-form-item>
      <!-- 动态增加项目 -->
    <!-- 不止一个项目，用div包裹起来 -->
    <div v-for="(item, index) in form.dynamicItem" :key="index">
      <el-form-item
        label="在职学历"
        :prop="'dynamicItem.' + index + '.jobeducation'"
        :rules="{
            required: true, message: '在职学历不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="item.jobeducation"></el-input>
      </el-form-item>
      <el-form-item
        label="毕业时间"
        :prop="'dynamicItem.' + index + '.jobfinishdate'"
        :rules="[
             {required: true, message: '毕业时间不能为空', trigger: 'blur'},
          ]"
      >
        <el-date-picker
          style="width: 178px"
          v-model="item.jobfinishdate"
          type="date"
          placeholder="请选择毕业时间"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="毕业院校"
        :prop="'dynamicItem.' + index + '.jobuniversity'"
        :rules="[
             {required: true, message: '毕业院校不能为空', trigger: 'blur'},
          ]"
      >
        <el-input v-model="item.jobuniversity"></el-input>
      </el-form-item>
      <el-form-item
        label="在职专业"
        :prop="'dynamicItem.' + index + '.jobprofession'"
        :rules="{
            required: true, message: '在职专业不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="item.jobprofession"></el-input>
      </el-form-item>

      <el-form-item>
       <el-link icon="el-icon-delete" @click="deleteItem(item, index)">删除</el-link>&nbsp;&nbsp;&nbsp;&nbsp;
       <el-link v-show="item.uId" icon="el-icon-edit" @click="editItem(item, index)">编辑</el-link>
       <el-link v-show="!item.uId" icon="el-icon-circle-check" @click="submitItem(item, index)">提交</el-link>
      </el-form-item>
      <hr>
    </div>
    </el-form>
  </div>
</template>
<script>
  import {Message,MessageBox} from 'element-ui'
  import {addEJob,deleteJob,editEJob} from '@/api/personnel'
  export default {
    props:{
      moreJobData:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
        dialogVisible:false,
        form: {
          dynamicItem: []
        },
        formRules: {
          jobeducation: [{required: true, message: '在职学历', trigger: 'blur'}],
          jobfinishdate: [{required: true, message: '毕业时间', trigger: 'blur'}],
          jobprofession: [{required: true, message: '在职专业', trigger: 'blur'}],
          jobuniversity: [{required: true, message: '在职毕业院校', trigger: 'blur'}],
        }
      }
    },
    mounted(){
        this.form.dynamicItem =  this.moreJobData
    },
    watch:{
      'moreJobData'(){
        this.form.dynamicItem=this.moreJobData
      }
    },
    methods:{
      addItem () {
        if(this.form.dynamicItem.length>=5){
          Message({
            message: '在职教育信息暂时为五条',
            type: 'danger',
            duration: 3 * 1000
          })
          return
        }
        this.form.dynamicItem.push({
          employeeId:this.$route.query.uId,
          jobeducation: "",
          jobfinishdate: "",
          jobprofession: "",
          jobuniversity: "",
        })
      },
      deleteItem (item, index) {
        this.form.dynamicItem.splice(index, 1)
        deleteJob(item.uId).then(res=>{
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        })
      },
      submitItem(item){
        for(let key in item){
          if(item[key]===''){
            Message({
              message:'当前验证不合格',
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
        }
        addEJob(item).then(res=>{
            Message({
              message: res.msg,
              type: 'success',
              duration: 3 * 1000
            })
          this.$emit('updateInfo')
        })
      },
      editItem(item){
        editEJob(item).then(res=>{
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.$emit('updateInfo')
        })
      }
    }
  }

</script>
