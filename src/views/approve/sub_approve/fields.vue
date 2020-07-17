<template>
  <div class="app-container" shadow="never">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="150px"
      class="demo-dynamic"
      size="mini">
      <div  v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.uId">
        <el-form-item
          v-if="domain.fieldtype===10"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-input v-model="domain.fieldValue"  :placeholder="domain.valimessage"></el-input>
        </el-form-item>
        <el-form-item
          v-if="domain.fieldtype === 20"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ? {
          required: true, message: domain.fieldname+'必填项', trigger: ['blur']}:[]"
        >
          <el-input  type="number" :min="0" :step="1" v-model="domain.fieldValue"  :placeholder="domain.valimessage"></el-input>
        </el-form-item>
        <el-form-item
          v-if="domain.fieldtype===30 || domain.fieldtype===40"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ? {
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-input type="number" :min="0" :step="0.01" v-model="domain.fieldValue"  :placeholder="domain.valimessage"></el-input>
        </el-form-item>

        <el-form-item
          v-if="domain.fieldtype===50"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-date-picker
            v-model="domain.fieldValue"
            type="date"
            value-format="yyyy-MM-dd"
            :placeholder="domain.fieldname"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="domain.fieldtype===60"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-date-picker
            v-model="domain.fieldValue"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :placeholder="domain.valimessage"
            style="width: 100%" >
          </el-date-picker>
        </el-form-item>
        <!--文本-->
        <el-form-item
          v-if="domain.fieldtype===70"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-input type='textarea' v-model="domain.fieldValue"  :placeholder="domain.valimessage"></el-input>
        </el-form-item>
        <!--是否-->
        <el-form-item
          v-if="domain.fieldtype===80"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-switch
            v-model="domain.fieldValue"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <!--单选框-->
        <el-form-item
          v-if="domain.fieldtype===90"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-select v-model="domain.fieldValue"  :placeholder="domain.valimessage">
            <el-option
              v-for="item in OnlyData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--多选-->
        <el-form-item
          v-if="domain.fieldtype===100"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-select v-model="domain.fieldValue" multiple  :placeholder="domain.valimessage">
            <el-option
              v-for="item in ManyData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--身份证-->
        <el-form-item
          v-if="domain.fieldtype===110"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-input v-model="domain.fieldValue"  :placeholder="domain.valimessage"></el-input>
        </el-form-item>
        <!--邮箱-->
        <el-form-item
          v-if="domain.fieldtype===120"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}]:[]"
        >
          <el-input v-model="domain.fieldValue" :placeholder="domain.valimessage"></el-input>
        </el-form-item>
        <!--手机号-->
        <el-form-item
          v-if="domain.fieldtype===130"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-input v-model="domain.fieldValue"  :placeholder="domain.valimessage"></el-input>
        </el-form-item>
        <!--性别-->
        <el-form-item
          v-if="domain.fieldtype===140"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?
      { required: true, message: '请输入邮箱地址', trigger: 'blur' }:[]"
        >
          <el-select v-model="domain.fieldValue" placeholder="请选择">
            <el-option
              v-for="item in SexData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--图片-->
        <el-form-item
          v-if="domain.fieldtype===150"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <multiUploadImg
            @imgUrl="picPreview"
            :picArray="''"
          ></multiUploadImg>
        <!--  <el-input v-model="domain.fieldValue" :placeholder="domain.valimessage"></el-input>-->
        </el-form-item>
        <!--文件集-->
        <el-form-item
          v-if="domain.fieldtype===160"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-input v-model="domain.fieldValue" :placeholder="domain.valimessage"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import multiUploadImg from '@/components/Upload/multiUploadImg'
  import {dictionType} from '@/api/basic'
  import {GetSubInfo,AddFormInfo} from '@/api/approve'

  export default {
    data(){
      return {
        dynamicValidateForm: {
          domains: [],
        },
        OnlyData:[],
        ManyData:[],
        SexData:[]
      }
    },
    components:{
      multiUploadImg
    },
    created(){
      GetSubInfo(this.$route.query.form_id)
        .then(response=>{
          response.datas.forEach((item,index)=> {
            this.dynamicValidateForm.domains.push({
              uId:item.uId,
              fieldname: item.fieldname,
              fieldtype: item.fieldtype,
              valimessage: item.valimessage,
              ismust:item.ismust,
              fieldValue:''
            })
            //性别
            if(item.fieldtype===140){
              dictionType('a09ec95d95484cd5902c5b608c51d310').then(res=>{
                this.SexData=res.datas
              })
            }
            if(item.isdrop===1){
              dictionType(item.listId).then(res=>{
                this.OnlyData=res.datas
              })
            }
            if(item.isdrop===2){
              dictionType(item.listId).then(res=>{
                this.OnlyData=res.ManyData
              })
            }
          })
        })
    },
    methods:{
      prev(){
        this.$router.go(-1)
      },
      submitForm() {
        const data={
          tableFormId:this.$route.query.form_id,
          tableFieldSubModels:[]
        }
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          data.tableFieldSubModels.push({
            tableFieldId:item.uId,
            tableFieldValue:item.fieldValue
          })
        })
        console.log(data)
        this.$refs.dynamicValidateForm.validate((valid) => {
          if (valid) {
              AddFormInfo(data).then(res => {
                if (res.status === 0) {
                  Message({
                  message: res.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
            }
            })

          } else {
            Message({
              message: '参数验证不合法',
              type: 'error',
              duration: 3 * 1000
            })
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }

</script>

<style rel="stylesheet/stylus">
  .demo-dynamic{
    width:800px;
    margin: 20px auto;
  }
</style>
