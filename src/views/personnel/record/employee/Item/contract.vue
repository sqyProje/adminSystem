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
        <el-date-picker type="date" v-model="AddEditInfo.signaturedate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item label="签订公司" prop="company">
    <el-input v-model="AddEditInfo.company"></el-input>
  </el-form-item>
  <el-row :gutter="20">
    <el-col :span="8">
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
    <el-col :span="8">
      <el-form-item label="是否续签" prop="isContinue">
        <el-select v-model="AddEditInfo.isContinue" placeholder="合同状态" style="width: 100%;">
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
        <el-date-picker type="date" v-model="AddEditInfo.enddate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="继续签时间" prop="continuedate">
        <el-date-picker type="date" v-model="AddEditInfo.continuedate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="创建时间">
        <el-input v-model="AddEditInfo.createdate" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="更新时间" >
        <el-input v-model="AddEditInfo.updatedate" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item label="附件" prop="filepath">
    <multiUploadFile
      @imgUrl="picPreview"
      :picArray="picArray">
    </multiUploadFile>
    <a :href="AddEditInfo.filepath" style="width: 100%;display: inline-block">下载附件 {{AddEditInfo.fileName}}</a>
  </el-form-item>
  <el-form-item size="large">
    <el-button type="primary" @click="UpdateUser">提交</el-button>
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
        picArray:[],
        picPreviewInfo:'',
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
          { id: 0, name: '劳务合同'},
          { id: 1, name: '劳务派遣合同'},
        ],
        stateData:[
          { id: 0, name: '有效',Continuename:'是'},
          { id: 1, name: '解除',Continuename:'否'},
        ],
      };
    },
    components:{
      multiUploadFile
    },
    mounted(){
      this.getInfo(this.$route.query.uId)
    },
    methods: {
      picPreview(value){
        console.log(value);
        this.picPreviewInfo += value+','
      },
      getInfo(uId){
        GetContractInfo(uId).then(response=>{
          this.AddEditInfo = response.datas==null ? this.AddEditInfo={} :  response.datas;
          this.picArray.push({name:response.datas.fileName,url:response.datas.filepath})
        })
      },
      UpdateUser() {
        this.AddEditInfo.filepath =  this.picPreviewInfo.substring(0, this.picPreviewInfo.length-1)
        console.log(this.AddEditInfo.filepath)
        this.$refs.AddEditInfo.validate(valid => {
          this.AddEditInfo.employeeid=this.$route.query.uId
          if (valid) {
            EditContractInfo(this.AddEditInfo).then(response=>{
              if (response.status === 0) {
                this.$options.methods.getInfo(this.$route.query.uId)
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }
            })

          }
        })
      },

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
