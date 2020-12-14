<template>
  <div class="app-container" shadow="never">
    <h3 class="demo-dynamic" style="text-align: center">{{FormName}}</h3>
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
        ><!--天-->
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
        ><!--秒-->
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
        <!--          v-for="(firstItem,firstIndex) in OnlyDataMany"
                  :key="firstIndex"

        && domain.listId===firstItem.dId
-->
        <el-form-item
          v-for="(firstItem,firstIndex) in OnlyDataMany"
          :key="firstIndex"
          v-if="domain.fieldtype===90 && domain.listId===firstItem.dId "
          :label="domain.fieldname"
          :prop="'domains.' + index + '.fieldValue'"
          :rules="domain.ismust ?{
            required: true, message: domain.fieldname+'必填项', trigger: 'blur'
          }:[]"
        >
          <el-select
            v-model="domain.fieldValue"
            filterable
            :placeholder="domain.valimessage"
            @focus="onlyFocus(firstItem.dId,firstItem.isdrop)"
            style="width: 100%"
            popper-class="selectJob"
            :filter-method="dataFilter"
          ><!-- v-el-select-loadmore="loadmore"-->
            <el-option
              v-for="item in selectOne"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
            <div style="text-align: center">
              <span class="text" @click.stop="prevePage">上一页</span>
              <span class="text" @click.stop="nextPage" v-show="formData.pageNum !== pageCount">下一页</span>
            </div>
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
          <el-select
            v-model="domain.fieldValue"
            multiple
            filterable
            :placeholder="domain.valimessage"
            @focus="onlyFocus(ManyItem.dId,ManyItem.isdrop)"
            style="width: 100%"
            popper-class="selectJob"
            :filter-method="dataFilter"
          >
            <el-option
              v-for="item in selectMany"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
            <div style="text-align: center">
              <span class="text" @click.stop="prevePage">上一页</span>
              <span class="text" @click.stop="nextPage" v-show="formData.pageNum !== pageCount">下一页</span>
            </div>
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
              :key="item.name"
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
            @delUrl = "delUrlPreview"
            ref="multiImg"
            :picArray="domain.fieldValue"
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
            ref="fileFile"
            @file-url="FilePreview"
            @delFile = 'delFilePreview'
            :fileArray="domain.fieldValue">
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
      :close-on-click-modal="false"      :show-close="false"
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
        <el-form-item label='审批人'>
          <el-select v-model="AddEditInfo.UserId" filterable style="width: 100%;">
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
  import {dictionTypePer} from '@/api/basic'
  import {GetSubInfo,AddFormInfo,GetApproveUser,GetMyInfo,subReloadApprove} from '@/api/approve'

  export default {
    data(){
      return {
        FormName:'',
        FileArray:[],
        picPreviewInfo:'',
        picIdsArray:[],
        filePreviewInfo:'',
        fileIdsArray:[],
        dynamicValidateForm: {
          domains: [],
        },
        OnlyDataMany:[],//当前页数数据
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
        submitFlag:false,
        ProcessData:[],
        approveId:'',//重复提交时用到
        formData: {   //下拉参数
          parentId:'',
          name:'',
          pageNum: 1,// 当前页数
          pageSize: 20
        },
        isdrop:'',
        total: null, // 获取总数据量
        pageCount: null, // 获取总页数
        selectOne:[],
        selectMany:[]
      }
    },
    components:{
      multiUploadImg,multiUploadFile
    },
    directives: {
      'el-select-loadmore': {
        bind(el, binding) {
          // 获取element-ui定义好的scroll盒子
          const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
          SELECTWRAP_DOM.addEventListener('scroll', function () {
            /**
             * scrollHeight 获取元素内容高度(只读)
             * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
             * clientHeight 读取元素的可见高度(只读)
             * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
             * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
             */
            const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
            if (condition) {
              binding.value();
            }
          });
        }
      }
    },
    created(){
      this.FormName=this.$route.query.form_name
      GetSubInfo(this.$route.query.form_id)
        .then(response=>{
          response.datas.forEach((item,index)=> {
            if(item.isdrop===1){//单选
              dictionTypePer(item.listId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
                this.OnlyDataMany.push({ItemData:res.datas,dId:item.listId,isdrop:item.isdrop})

              })
            }
            if(item.isdrop===2){//多选
              dictionTypePer(item.listId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
                this.ManyData.push({ItemData:res.datas,dId:item.listId,isdrop:item.isdrop})

              })
            }
            this.dynamicValidateForm.domains.push({
              uId:item.uId,
              fieldname: item.fieldname,
              fieldtype: item.fieldtype,
              valimessage: item.valimessage,
              ismust:item.ismust,
              listId:item.listId,
              fieldValue:'',
              isdrop:item.isdrop
            })
            //性别
            if(item.fieldtype===140){
              dictionTypePer('a09ec95d95484cd5902c5b608c51d310').then(res=>{
                this.SexData=res.datas
              })
            }
          })

        })
      if(this.$route.query.form_id && this.$route.query.u_id){
        GetMyInfo(this.$route.query.u_id)
          .then(response=>{
            this.approveId = response.datas.approveId
            response.datas.tableFieldValueModels.forEach((item,index)=>{
              this.ProcessData.push(item)
              if(item.fieldType ===150){
                this.picIdsArray= item.fieldValues.split(',')
              }else if(item.fieldType === 160){
                let Href  = decodeURIComponent(item.fieldValues)
                this.fileIdsArray=Href.split(',')
              }
            })
          }).then(()=>{
          //console.log(this.fileIdsArray)
          this.dynamicValidateForm.domains.filter(item=>{
            this.ProcessData.forEach(Pinfo=>{
              if(item.fieldname==Pinfo.fieldName){
                item.fieldValue = Pinfo.fieldValues
              }
            })
          })
        })
      }

    },
    methods:{
      FilePreview(value){ //文件
        this.fileIdsArray.push(value)
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 160){
            item.fieldValue = this.fileIdsArray.toString()
          }
        })
      },
      delFilePreview(value){
        this.fileIdsArray= this.fileIdsArray.filter((x)=>{
          return x !==value
        })
        //console.log(this.fileIdsArray)
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 160){
            item.fieldValue = this.fileIdsArray.toString()
          }
        })
      },
      picPreview(value){ //图片
        this.picIdsArray.push(value)
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 150){
            item.fieldValue = this.picIdsArray.toString()
          //  console.log(item.fieldValue)
          }
        })
      },
      delUrlPreview(value){
        this.picIdsArray= this.picIdsArray.filter((x)=>{
          return x !==value
        })
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          if(item.fieldtype === 150){
            item.fieldValue = this.picIdsArray.toString()
          }
        })
      },
      prev(){
        this.$router.push({name:'sub_approve'})
      },

      //提交审批
      submitForm() {
        if(this.submitFlag){
          Message({
            message:'请勿重复提交',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        this.submitFlag=true
        const data={
          approveId:this.approveId,
          tableFormId:this.$route.query.form_id,
          tableFieldSubModels:[]
        }
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          data.tableFieldSubModels.push({
            tableFieldId:item.uId,
            tableFieldValue:item.fieldValue.toString()
          })
        })
        //console.log(data)
        this.$refs.dynamicValidateForm.validate((valid) => {
          if (valid) {
            GetApproveUser(data).then(response=>{
              if(response.datas===null){
                this.dialogVisible = false
                if(this.$route.query.u_id){
                  subReloadApprove(data).then(res => {
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
                }else{
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
                }


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
        if(this.$refs.fileFile && this.$refs.multiImg){
          this.$refs.multiImg[0].fileList=[]
          this.$refs.fileFile[0].fileList=[]
        }else if(this.$refs.multiImg){
          this.$refs.multiImg[0].fileList=[]
        }else if(this.$refs.fileFile){
          this.$refs.fileFile[0].fileList=[]
        }
      },
      UpdateUser(){
        const data={
          approveId:this.approveId,
          tableFormId:this.$route.query.form_id,
          approveUserId:this.AddEditInfo.UserId,
          tableFieldSubModels:[]
        }
        this.dynamicValidateForm.domains.forEach((item,index)=>{
          data.tableFieldSubModels.push({
            tableFieldId:item.uId,
            tableFieldValue:item.fieldValue.toString()
          })
        })
        if(this.AddEditInfo.UserId.length>0){
          if(this.$route.query.u_id){
            subReloadApprove(data).then(res => {
              if (res.status === 0) {
                this.dialogVisible = false
                this.$router.push({name: 'sub_approve'})
                Message({
                  message: res.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }
            })
          }else {
            AddFormInfo(data).then(res => {
              if (res.status === 0) {
                this.dialogVisible = false
                this.$router.push({name: 'sub_approve'})
                Message({
                  message: res.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }
            })
          }
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
      onlyFocus(value,isdrop){
        this.formData.name = ''
        this.formData.parentId=value
        this.isdrop= isdrop
        this.total=null
        this.pageCount= null
        this.formData.pageNum=1
        if(this.isdrop===1){//单选
          dictionTypePer(this.formData.parentId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
            this.selectOne=res.datas.list
            this.total= (res.datas.list && res.datas.total)
            this.pageCount = Math.ceil(this.total / 20)
          })
        }
        if(this.isdrop===2){
          dictionTypePer(this.formData.parentId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
            this.selectMany=res.datas.list
            this.total= (res.datas.list && res.datas.total)
            this.pageCount = Math.ceil(this.total / 20)
          })
        }

      },
      prevePage(){
        -- this.formData.pageNum;
        if( this.formData.pageNum< 1){
          this.formData.pageNum = 1
        }
        if(this.isdrop===1){//单选
          dictionTypePer(this.formData.parentId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
            this.selectOne=res.datas.list
          })
        }
        if(this.isdrop===2){
          dictionTypePer(this.formData.parentId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
            this.selectMany=res.datas.list
          })
        }
      },
      nextPage(){
        if(this.formData.pageNum < this.pageCount){
          ++ this.formData.pageNum
          if(this.isdrop===1){//单选
            dictionTypePer(this.formData.parentId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
              this.selectOne=res.datas.list
            })
          }
          if(this.isdrop===2){
            dictionTypePer(this.formData.parentId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
              this.selectMany=res.datas.list
            })
          }
        }
      },
      //自定义搜索
      dataFilter(value){
        this.formData.pageNum=1
        this.formData.pageSize=20
        this.formData.name = value
        if(this.isdrop===1) {//单选
          dictionTypePer(this.formData.parentId, this.formData.name, this.formData.pageNum, this.formData.pageSize).then(res => {
            this.selectOne = res.datas.list
          })
        }
        if(this.isdrop===2){
          dictionTypePer(this.formData.parentId,this.formData.name,this.formData.pageNum,this.formData.pageSize).then(res=>{
            this.selectMany=res.datas.list
          })
        }
      }
    }
  }

</script>

<style rel="stylesheet/stylus">
  .demo-dynamic{
    width:800px;
    margin: 20px auto;
  }
  .selectJob .span{
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .selectJob .text{
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    color :cornflowerblue;
  }

</style>
