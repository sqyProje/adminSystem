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
                <el-input v-model="loginUserInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名">
                <el-input v-model="loginUserInfo.realname"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="邮箱">
                <el-input v-model="loginUserInfo.email">
                <span slot="suffix" @click="openUser">
                  <svg-icon icon-class="s-edit" class="color-main"></svg-icon>
                </span>
                </el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="loginUserInfo.idcard">
                <span slot="suffix" @click="openUser">
                  <svg-icon icon-class="s-edit" class="color-main"></svg-icon>
                </span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="手机号">
                <el-input v-model="loginUserInfo.phoneno">
                <span slot="suffix" @click="PhoneDialogVisible = true">
                  <svg-icon icon-class="s-edit" class="color-main"></svg-icon>
                </span>
                </el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="loginUserInfo.password">
                <span slot="suffix" @click="passwordDialogVisible = true">
                  <svg-icon icon-class="s-edit" class="color-main"></svg-icon>
                </span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
            </el-col>
          </el-form>
          <!--修改基本信息-->
          <el-dialog
            title="修改基本信息"
            :visible.sync="dialogVisible"
            width="40%">
            <el-form size="mini" :model="editInfoQuery" label-width="100px">
              <el-form-item label ='头像'>
                <singleUpload  v-model="editInfoQuery.picpath" @input="picFun"></singleUpload>
                <el-input v-model="editInfoQuery.picpath"></el-input>
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
            :visible.sync="PhoneDialogVisible"
            width="20%"
          >
            <el-form size="mini" :model="editPhoneQuery" label-width="100px">
              <el-form-item label ='原手机号'>
                <el-input v-model="loginUserInfo.phoneno" disabled></el-input>
              </el-form-item>
              <el-form-item label ='新手机号'>
                <el-input v-model="editPhoneQuery.phoneno"></el-input>
              </el-form-item>
              <el-form-item label ='验证码'>
                <el-col :span="13">
                  <el-input v-model="editPhoneQuery.code"></el-input>
                </el-col>
                <el-col :span="9" style="float: right">
                  <el-button type="primary" size="mini" @click="getCode" :disabled="!sendAuthCode">
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
            <el-form size="mini" :model="editPassQuery" label-width="100px">
              <el-form-item label ='旧密码'>
                <el-input type="password" v-model="editPassQuery.re_Pwword"></el-input>
              </el-form-item>
              <el-form-item label ='新密码'>
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
  import store from '../../store'
  import {Message} from 'element-ui'
  import {getLoginUserInfo,editInfo,uploadfile,editPhone,getPhoneCode,editPassWord} from '@/api/login'
  import singleUpload from '@/components/Upload/singleImg'
  import md5 from 'js-md5';
  export default {
    components: {
      singleUpload
    },
    data () {
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
        dialogVisible: false,
        PhoneDialogVisible:false,
        passwordDialogVisible:false,
        sendAuthCode:true,
        auth_time:0,
        defaultImg:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      }
    },
    created(){
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
        this.dialogVisible = true
      //  this.editInfoQuery = this.loginUserInfo
        this.editInfoQuery = {
          picpath: this.loginUserInfo.picpath,
          email: this.loginUserInfo.email,
          idcard: this.loginUserInfo.idcard
        }
        console.log(this.editInfoQuery.picpath)
      },
      canleDialog() {
        this.dialogVisible = false
        this.PhoneDialogVisible = false
        this.passwordDialogVisible=false
      },
      editInfoFunc() {
        editInfo(this.editInfoQuery).then(response => {
          this.dialogVisible = false;
          this.getLoginInfo()

        })
      },
      getCode(){
        getPhoneCode(this.oldphoneno).then(response=>{
          if(response.status === 0){
            this.sendAuthCode = false;
            this.auth_time = 180;
            var auth_timetimer =  setInterval(()=>{
            this.auth_time--;
            if(this.auth_time<=0){
              this.sendAuthCode = true;
              clearInterval(auth_timetimer);
                }
            }, 1000);
          }
        })
      },
      editPhoneFunc(){
        editPhone(this.editPhoneQuery).then(response =>{
          this.PhoneDialogVisible = false
          this.loginUserInfo.phoneno = this.editPhoneQuery.phoneno
          this.editPhoneQuery ={
            phoneno:'',
            code:'',
          }
        })
      },
      editPassWordFunc(){
       let editPassQueryM={
            re_Pwword:md5(this.editPassQuery.re_Pwword),
            password:md5(this.editPassQuery.password),
        }
        editPassWord(editPassQueryM).then(response=>{
          if(response.status === 0){
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
      },
      picFun(data){
        this.editInfoQuery.picpath = data
      },
    }
  };
</script>
