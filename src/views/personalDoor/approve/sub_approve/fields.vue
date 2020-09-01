<template>
  <div class="app-container" shadow="never">
    <el-form
      v-if="dynamicValidateForm.domains.length>0"
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
          v-for="(firstItem,firstIndex) in OnlyDataMany"
          :key="firstIndex"
          v-if="domain.fieldtype===90 && domain.listId===firstItem.dId"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
            required: true, message: domain.fieldname+'必填项', trigger: 'blur'
          }:[]"
        >
          <el-select v-model="domain.fieldValue"  :placeholder="domain.valimessage" style="width: 100%" >
            <el-option
              v-for="item in firstItem.ItemData"
              :key="item.uId"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <!--多选-->
        <el-form-item
          v-for="(ManyItem,ManyIndex) in ManyData"
          :key="ManyIndex"
          v-if="domain.fieldtype===100  && domain.listId===ManyItem.dId"
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
          required: true, message: domain.fieldname+'必填项', trigger: 'blur'
        }:[]"
        >
          <el-select v-model="domain.fieldValue" multiple  :placeholder="domain.valimessage" style="width: 100%" >
            <el-option
              v-for="item in ManyItem.ItemData"
              :key="item.uId"
              :label="item.name"
              :value="item.uId">
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
      { required: true, message: '请选择性别', trigger: 'blur' }:[]"
        >
          <el-select v-model="domain.fieldValue" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in SexData"
              :key="item.uId"
              :label="item.name"
              :value="item.name">
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
          <multiUploadFile
            @file-url="FilePreview"
            :picArray="[]">
          </multiUploadFile>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="warning" @click="prev()">返回</el-button>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div v-else style="text-align: center;color: #999;" >
      <div style="margin: 40px 0;" >暂无表单信息请联系管理员</div>
      <el-button type="warning" @click="prev()">返回</el-button>
    </div>
    <el-dialog
      title="选择下一级审批人"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="25%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="80px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label='选择用户'>
          <el-select v-model="AddEditInfo.UserId" style="width: 100%;">
            <el-option
              v-for="item in ApproveUserData"
              :label="item.realname"
              :value="item.uId"
              :key = "item.uId"
            >{{item.realname}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="canleDialog">关 闭</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import multiUploadImg from '@/components/Upload/multiUploadImg'
  import multiUploadFile from '@/components/Upload/multiUploadFile'
  import {dictionType} from '@/api/basic'
  import {GetSubInfo,AddFormInfo,GetApproveUser} from '@/api/approve'

  export default {
    data(){
      return {
        FileArray:[],
        picPreviewInfo:'',
        dynamicValidateForm: {
          domains: [],
        },
        OnlyDataMany:[],
        ManyData:[],
        SexData:[],
        dialogVisible: false,
        AddEditInfo:{
          UserId:''
        },
        ApproveUserData:[],
        rulesInfo: {
          UserId: [{required: true, trigger: 'blur', message: '请选择用户'}],
        },
        submitFlag:false
      }
    },
    components:{
      multiUploadImg,multiUploadFile
    },
    created(){
      GetSubInfo(this.$route.query.form_id)
        .then(response=>{
          response.datas.forEach((item,index)=> {
            if(item.isdrop===1){
              dictionType(item.listId).then(res=>{
                this.OnlyDataMany.push({ItemData:res.datas,dId:item.listId})
              })
              console.log(this.OnlyDataMany)
            }
            if(item.isdrop===2){
              dictionType(item.listId).then(res=>{
                this.ManyData.push({ItemData:res.datas,dId:item.listId})
              })
            }
            this.dynamicValidateForm.domains.push({
              uId:item.uId,
              fieldname: item.fieldname,
              fieldtype: item.fieldtype,
              valimessage: item.valimessage,
              ismust:item.ismust,
              listId:item.listId,
              fieldValue:''
            })
            //性别
            if(item.fieldtype===140){
              dictionType('a09ec95d95484cd5902c5b608c51d310').then(res=>{
                this.SexData=res.datas
              })
            }
          })

        })
    },
    methods:{
      FilePreview(value){
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 160){
            item.fieldValue = value
          }
        })
      },
      picPreview(value){
        this.picPreviewInfo += value+','
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 150){
            item.fieldValue += value+','
            console.log(item.fieldValue)
          }
        })

      },
      prev(){
        this.$router.push({name:'sub_approve'})
      },

      //提交审批
      submitForm() {
        if(this.submitFlag){
          return
        }
        this.submitFlag=true
        const data={
          tableFormId:this.$route.query.form_id,
          tableFieldSubModels:[]
        }
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 150){
            data.tableFieldSubModels.push({
              tableFieldId:item.uId,
              tableFieldValue:item.fieldValue.substring(0, item.fieldValue.length - 1)
            })
          }else{
            data.tableFieldSubModels.push({
              tableFieldId:item.uId,
              tableFieldValue:item.fieldValue
            })
          }
        })
      //  console.log(data)
        this.$refs.dynamicValidateForm.validate((valid) => {
          if (valid) {
            GetApproveUser(data).then(response=>{
              if(response.datas===null){
                this.dialogVisible = false
                  AddFormInfo(data).then(res => {
                    if (res.status === 0) {
                      this.dialogVisible = false
                      this.$router.push({name:'sub_approve'})
                      Message({
                        message: res.msg,
                        type: 'success',
                        duration: 3 * 1000
                      })
                    }
                  })
                    .catch(error => {
                      console.log(error);
                    });

              }else{
                this.dialogVisible = true
                this.ApproveUserData = response.datas
              }

            })
          } else {
            Message({
              message: '参数验证不合法',
              type: 'error',
              duration: 3 * 1000
            })
            this.submitFlag=false
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      UpdateUser(){
        const data={
          tableFormId:this.$route.query.form_id,
          approveUserId:this.AddEditInfo.UserId,
          tableFieldSubModels:[]
        }
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 150){
            data.tableFieldSubModels.push({
              tableFieldId:item.uId,
              tableFieldValue:item.fieldValue.substring(0, item.fieldValue.length - 1)
            })
          }else{
            data.tableFieldSubModels.push({
              tableFieldId:item.uId,
              tableFieldValue:item.fieldValue
            })
          }
        })
        if(this.AddEditInfo.UserId.length>0){
          AddFormInfo(data).then(res => {
            if (res.status === 0) {
              this.dialogVisible = false
              this.$router.push({name:'sub_approve'})
              Message({
                message: res.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }
          })
            .catch(error => {
              console.log(error);
            });
        }else{
          Message({
            message: '请选择审批人',
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      canleDialog(){
        this.dialogVisible = false
        this.submitFlag=false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
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
