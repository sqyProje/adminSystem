<template>
<el-form ref="AddEditInfo" :model="AddEditInfo" :rules="rulesInfo" label-width="150px" size="mini">
    <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="合同编号" prop="number">
        <el-input v-model="AddEditInfo.number"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="签订时间" prop="signaturedate">
        <el-date-picker type="date" v-model="AddEditInfo.signaturedate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item label="签订公司" prop="company">
    <el-input v-model="AddEditInfo.company"></el-input>
  </el-form-item>
  <el-row :gutter="20">
    <el-col :span="9">
      <el-form-item label="合同类型" prop="type">
        <el-select v-model="AddEditInfo.type" placeholder="合同类型" style="width: 100%;">
          <el-option
            v-for="item in typeData"
            :label="item.name"
            :value="item.id"
            :key = "item.id"
          >{{item.name}}</el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="合同状态" prop="state">
        <el-select v-model="AddEditInfo.state" placeholder="合同状态" style="width: 100%;">
          <el-option
            v-for="item in stateData"
            :label="item.name"
            :value="item.id"
            :key = "item.id"
          >{{item.name}}</el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="7">
      <el-form-item label="是否续签" prop="isContinue">
        <el-select v-model="AddEditInfo.isContinue" placeholder="合同状态" style="width: 100%;" @change="ContinueChange">
          <el-option
            v-for="item in stateData"
            :label="item.Continuename"
            :value="item.id"
            :key = "item.id"
          >{{item.Continuename}}</el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="到期时间" prop="enddate">
        <el-date-picker type="date" v-model="AddEditInfo.enddate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="ContinueFlag">
      <el-form-item label="续签时间" prop="continuedate">
        <el-date-picker type="date" v-model="AddEditInfo.continuedate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item label="附件" prop="filepath">
    <multiUploadFile
      @file-url="FilePreview"
      @delFile = 'delFilePreview'
      :fileArray="picArray">
    </multiUploadFile>
    <el-input v-model="AddEditInfo.filepath" type="hidden"></el-input>
    <a
      v-for="(items,index) in fileIdsArray "
      :href="items"
      style="width: 100%;display: inline-block">
      下载附件{{index+1}} {{items.substring(50,items.length)}}
    </a>
  </el-form-item>
  <el-form-item size="large">
    <el-button type="primary" @click="UpdateUser" :disabled="submitFlag">提交</el-button>
  </el-form-item>
</el-form>
</template>
<script>
  import {Message,MessageBox} from 'element-ui'
  import {validmobile,validEmail} from '@/utils/validate'
  import multiUploadFile from '@/components/Upload/multiUploadFile'
  import {GetContractInfo,EditContractInfo,ContractPathInfo} from '@/api/personnel'
  export default {
    data() {
      return {
        AddEditInfo: {
          e_id:'',
          employeeid:'',
          number:'',
          company:'',
          type:'' ,
          signaturedate:'',
          enddate:'',
          continuedate:'',
          isContinue:'' ,
          fileName:'',
          filepath:'',
          createdate:'',
          updatedate:'',
          state:'',
        },
        rulesInfo: {
          number: [{ required: true,trigger: 'blur',message: '请输入合同编号'}],
          company:[{ required: true,trigger: 'blur',message: '请输入签订公司'}],
          type:[{ required: true,trigger: 'blur',message: '请输入家庭住址'}],
          signaturedate:[{ required: true,trigger: 'blur',message: '请输入签订时间'}],
          enddate:[{ required: true,trigger: 'blur',message: '请输入到期时间'}],
          continuedate:[{ required: true,trigger: 'blur',message: '请输入续签时间'}],
          isContinue:[{ required: true,trigger: 'blur',message: '请选择是否续签'}],
          filepath:[{ required: true,trigger: 'blur',message: '请上传附件'}],
          state	:[{ required: true,trigger: 'blur',message: '请输入合同状态'}]
        },
        typeData:[
          { id: 0, name: '聘用合同'},
          { id: 1, name: '退休人员返聘协议'},
          { id: 2, name: '外聘专家聘用协议'}
        ],
        stateData:[
          { id: 0, name: '解除',Continuename:'否'},
          { id: 1, name: '有效',Continuename:'是'},
        ],
        submitFlag:false,
        picArray:'',
        fileFlag:false,
        fileIdsArray:[],
        filePreviewInfo:'',
        fileString:'',
        ContinueFlag:false
      };
    },
    components:{
      multiUploadFile
    },
    mounted(){
      this.getInfo(this.$route.query.uId)
    },
    methods: {
      FilePreview(value){
        this.filePreviewInfo += value+','
        this.fileIdsArray.push(value)
      },
      delFilePreview(value){
        this.fileIdsArray= this.fileIdsArray.filter((x) =>{
        return  x !== value
        } );
        this.fileString = this.fileIdsArray.toString()
        this.filePreviewInfo = this.fileIdsArray.toString()+','
      },
      getInfo(uId){
        GetContractInfo(uId).then(response=>{
          if(response.datas==null){
            return
          }
          this.AddEditInfo =  response.datas==null ?  this.AddEditInfo :  response.datas

          this.picArray = response.datas.filepath;
          this.filePreviewInfo = response.datas.filepath+','
          this.fileIdsArray = response.datas.filepath.split(',')
          this.ContinueFlag = this.AddEditInfo.isContinue ? true:false
        })
      },
      UpdateUser() {
        this.AddEditInfo.filepath =  this.filePreviewInfo.substring(0, this.filePreviewInfo.length-1)
        //console.log(this.AddEditInfo.filepath)
        this.$refs.AddEditInfo.validate(valid => {
          this.AddEditInfo.employeeid=this.$route.query.uId
            if (valid) {
              EditContractInfo(this.AddEditInfo).then(response => {
                if (response.status === 0) {
                  this.submitFlag = true
                  this.$options.methods.getInfo(this.$route.query.uId)
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  setTimeout(()=>{
                    this.submitFlag = false
                  },5000)
                }
              })
            }else{
              Message({
                message: '参数验证不合法',
                type: 'error',
                duration: 3 * 1000
              })
            }
        })
      },
      ContinueChange(value){
        if(value){
          this.ContinueFlag=true
        }else{
          this.ContinueFlag=false
        }
      }
    }
  };
</script>
<style>
  .header{
    padding-bottom: 10px;

    margin-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
  }
</style>
