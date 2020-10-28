<template>
    <div class="app-container">
      <div class="update-info" style="width: 600px;margin: 20px auto">
        <el-card class="box-card">
          <el-form ref="form" :inline="false" :model="loginUserInfo" label-width="80px" size="mini">
            <el-col>
              <el-form-item label="头像">
                <img class="user-avatar" :src="loginUserInfo.picpath" widht="50" height="50">
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="用户名">
                <el-input v-model="loginUserInfo.username" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名">
                <el-input v-model="loginUserInfo.realname" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="邮箱" >
                <el-input v-model="loginUserInfo.email" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="loginUserInfo.idcard" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="手机号">
                <el-input v-model="loginUserInfo.phoneno" :disabled="true">
                <span slot="suffix" @click="PhoneDialogVisible = true">
                  <svg-icon icon-class="s-edit" class="color-main"></svg-icon>
                </span>
                </el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="loginUserInfo.password" :disabled="true">
                <span slot="suffix" @click="passwordDialogVisible = true">
                  <svg-icon icon-class="s-edit" class="color-main"></svg-icon>
                </span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col >
              <el-form-item >
                <el-button type="button" class="el-button--primary" @click="openUser">修改基本信息</el-button>
              </el-form-item>
            </el-col>
          </el-form>
          <!--修改基本信息-->
          <el-dialog
            title="修改基本信息"
            :close-on-click-modal="false"
            :show-close="false"
            :visible.sync="dialogVisible"
            width="40%">
            <el-form size="mini" :model="editInfoQuery" label-width="100px">
              <el-form-item label ='头像'>
                <singleUpload  v-model="editInfoQuery.picpath" @input="picFun"></singleUpload>
              </el-form-item>
              <el-form-item label ='邮箱'>
                <el-input v-model="editInfoQuery.email"></el-input>
              </el-form-item>
              <el-form-item label ='身份证号'>
                <el-input v-model="editInfoQuery.idcard"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="editInfoFunc">确 定</el-button>
        </span>
          </el-dialog>
          <!--修改手机号-->
          <el-dialog
            title="更改手机号"
            :close-on-click-modal="false"
            :show-close="false"
            :visible.sync="PhoneDialogVisible"
            width="22%"
          >
            <el-form size="mini" :model="editPhoneQuery" :rules="rulesPhone" ref="rulesPhone" label-width="100px">
              <el-form-item label ='原手机号'>
                <el-input v-model="loginUserInfo.phoneno" disabled></el-input>
              </el-form-item>
              <el-form-item label ='新手机号' prop="phoneno">
                <el-input v-model="editPhoneQuery.phoneno"></el-input>
              </el-form-item>
              <el-form-item label ='验证码' prop="code">
                <el-col :span="10">
                  <el-input v-model="editPhoneQuery.code"></el-input>
                </el-col>
                <el-col :span="14" style="text-align: right">
                  <el-button type="primary" size="mini" @click="getCode" :disabled="!sendAuthCode" style="padding:7px 5px;">
                    <span  v-show="!sendAuthCode">{{auth_time}}秒过期</span>
                    <span v-show="sendAuthCode">获取验证码</span>
                  </el-button>

                </el-col>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="canleDialog">取 消</el-button>
              <el-button size="small" type="primary" @click="editPhoneFunc">确定修改</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="修改密码"
            :visible.sync="passwordDialogVisible"
            width="20%"
          >
            <el-form size="mini" :model="editPassQuery" ref="editPass" :rules="rules" label-width="100px">
              <el-form-item label ='旧密码' prop="re_Pwword">
                <el-input type="password" v-model="editPassQuery.re_Pwword"></el-input>
              </el-form-item>
              <el-form-item label ='新密码' prop="password">
                <el-input type="password" v-model="editPassQuery.password"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="editPassWordFunc">确定修改</el-button>
        </span>
          </el-dialog>
        </el-card>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import store from '../../../store'
  import md5 from 'js-md5';
  import {Message} from 'element-ui'
  import {getLoginUserInfo,editInfo,uploadfile,editPhone,getPhoneCode,editPassWord} from '@/api/login'
  import singleUpload from '@/components/Upload/singleImg'
  import {validmobile,validcard,validEmail} from '@/utils/validate'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
  export default {
    components: {
      ElButton,singleUpload
    },
    data () {
      const checkphone = (rule, value, callback) => {
        if (!validmobile(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      };
      return {
        loginUserInfo:{
          picpath: "",
          username: "",
          realname: "",
          email: "",
          idcard: "",
          phoneno: "",
          password:''
        },
        file_N: [],
        editInfoQuery:{
          picpath:'',
          email:'',
          idcard:''
        },
        editPhoneQuery:{
          phoneno:'',
          code:'',
        },
        editPassQuery:{
          re_Pwword:'',
          password:'',
        },
        oldphoneno:'',
        dialogVisible: false,
        PhoneDialogVisible:false,
        passwordDialogVisible:false,
        sendAuthCode:true,
        auth_time:0,
        defaultImg:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        rules:{
          re_Pwword:[{ required: true,trigger: 'blur',message: '原密码不能为空'}],
          password:[{ required: true,trigger: 'blur',message: '新密码不能为空'}]
        },
        rulesPhone:{
          phoneno:[{ required: true,trigger: 'blur',validator: checkphone}],
          code:[{ required: true,trigger: 'blur',message: '验证码不能为空'}]
        },
        auth_timetimer:''

      }
    },
    mounted(){
     this.getLoginInfo()

    },
    methods: {
      getLoginInfo(){
        getLoginUserInfo().then(response=>{
          this.loginUserInfo = response.datas
          this.$store.commit('SET_AVATAR',this.loginUserInfo.picpath)
        })
      },
      openUser() {
        getLoginUserInfo().then(response=>{
          let timer = new Date().getTime()
          this.editInfoQuery = response.datas
          this.dialogVisible = true
        })
      },

      canleDialog() {
        clearInterval(this.auth_timetimer);
        this.auth_time = 0
        this.sendAuthCode = true
        this.dialogVisible = false
        this.PhoneDialogVisible = false
        this.passwordDialogVisible=false
        Object.keys(this.editPhoneQuery).forEach(key => this.editPhoneQuery[key]= '');
        Object.keys(this.editPassQuery).forEach(key => this.editPassQuery[key]= '');

      },
      editInfoFunc() {
        if(!validcard(this.editInfoQuery.idcard)) {
          this.$message.warning('请输入正确的身份证号')
          return
        }
        if(!validEmail(this.editInfoQuery.email)) {
          this.$message.warning('请输入正确的邮箱号')
          return
        }
        editInfo(this.editInfoQuery).then(response => {
          this.dialogVisible = false;
          this.getLoginInfo()
        })

      },
      getCode(){
        this.oldphoneno = this.loginUserInfo.phoneno
        if(validmobile(this.editPhoneQuery.phoneno)){
          getPhoneCode(this.oldphoneno).then(response=>{
            if(response.status === 0){
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              this.sendAuthCode = false;
              this.auth_time = 180;
               this.auth_timetimer =  setInterval(()=>{
                this.auth_time--;
                if(this.auth_time<=0){
                  this.sendAuthCode = true;
                  clearInterval(this.auth_timetimer);
                }
              }, 1000);
            }else{
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }
          })
        }else{
          Message({
            message: '请输入新手机号',
            type: 'error',
            duration: 3 * 1000
          })
        }

      },
      editPhoneFunc(){
        this.$refs.rulesPhone.validate(valid=>{
          if(valid){
            editPhone(this.editPhoneQuery).then(response =>{
              if(response.status === 0){
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
                this.PhoneDialogVisible = false
                this.loginUserInfo.phoneno = this.editPhoneQuery.phoneno
                this.editPhoneQuery = {
                  phoneno:'',
                  code:'',
                }
              }else{
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
      editPassWordFunc(){
        this.$refs.editPass.validate(valid => {
          if (valid) {
            let editPassQueryM = {
              re_Pwword: md5(this.editPassQuery.re_Pwword),
              password: md5(this.editPassQuery.password),
            }
            editPassWord(editPassQueryM).then(response => {
              if (response.status === 0) {
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }
              this.passwordDialogVisible = false
              store.dispatch('FedLogOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            })
          }
        })
      },
      picFun(data){
        this.editInfoQuery.picpath = data
      },
    }
  };
</script>
