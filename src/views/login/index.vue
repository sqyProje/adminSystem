<template>
  <div>
    <el-card class="login-form-layout">
      <div v-show="loginFormFlag">

        <img :src="loginFormFlag&&CodeFlag==true ? code_bg : codephone" class="code" @click="handleCode">
        <div style="text-align: center">
          <svg t="1585901382243" class="icon" icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="3417" width="200" height="200">
            <path
              d="M116 255.296c0-54.928 44.656-99.296 99.52-99.296h592.96c54.864 0 99.52 44.368 99.52 99.296v342.96c0 54.944-44.656 99.312-99.52 99.312H543.952V808h196.32a32 32 0 1 1 0 64H290.4a32 32 0 1 1 0-64h189.536v-110.432H215.52c-54.864 0-99.52-44.368-99.52-99.312V255.296z m99.52-35.296c-19.712 0-35.52 15.904-35.52 35.296v342.96c0 19.408 15.808 35.312 35.52 35.312h592.96c19.712 0 35.52-15.904 35.52-35.312V255.296a35.408 35.408 0 0 0-35.52-35.296H215.52z m444.48 32a32 32 0 0 1 29.92 20.64l92 241.984a32 32 0 1 1-59.84 22.752l-25.6-67.376h-72.96l-25.6 67.36a32 32 0 1 1-59.84-22.72l92-242.016a32 32 0 0 1 29.92-20.624z m-12.16 154h24.32l-12.16-31.952-12.16 31.952zM384 336a80 80 0 1 0 0 160 80 80 0 0 0 0-160z m-144 80a144 144 0 1 1 288 0 144 144 0 0 1-288 0z"
              p-id="3418" fill="#409EFF"></path>
          </svg>
        </div>
        <h2 class="login-title color-main">汝州市骨科医院OA</h2>
        <!--登录-->
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" v-show="loginFormFlag&&CodeFlag">
          <el-form-item prop="username">
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on"  placeholder="请输入用户名/手机号">
              <span slot="prefix"><svg-icon icon-class="user" class="color-main"></svg-icon></span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
              <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-col :span="15">
              <el-input name="code" v-model="loginForm.code" autoComplete="off" placeholder="请输入验证码">
          <span slot="prefix">
              <svg-icon icon-class="ums" class="color-main"></svg-icon>
          </span>
              </el-input>
            </el-col>
            <el-col :span="9">
              <img :src="imgCode" alt="加载失败" style="float: right" width="80" height="40" @click="changeImgCode">
            </el-col>
          </el-form-item>
          <el-form-item style="margin-bottom: 60px;text-align: center">
            <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>

        </el-form>
        <!--二维码登录-->
        <div  class="codeinfo" v-show="!CodeFlag" style="text-align: center">
          <div style="padding:20px;box-shadow: 0px 0px 20px 2px #ccc;display: inline-block">
            <img :src="loginCode" alt="">
            <div style="font-size:14px">请使用最新版手机端OA扫码</div>
          </div>
          <div class="refresh" @click="refreshCode" v-show="refreshFlag">
            <div class="color-text">
              <img :src="refresh_bg" alt="">
              <div>请点击刷新二维码</div>
            </div>
          </div>
        </div>
        <!--二维码登录结束-->
        <!--登录结束-->
        <el-button style="float: left; margin-bottom: 10px;color: #9fa2a8"
                   type="text"
                   @click = 'registerFormFlagFun'
        >注册账号</el-button>
        <el-button style="float: right; margin-bottom: 10px;color: #9fa2a8"
                   type="text"
                   @click = 'passFormFlagFun'
        >忘记密码</el-button>
      </div>




      <!--忘记密码start-->
      <el-form
        v-show="passFormFlag"
        :rules="PasswordRules"
        ref="ForgetPasswordQuery"
        :model="ForgetPasswordQuery"
        >
        <div style="text-align: center">
          <svg t="1585901382243" class="icon" icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="3417" width="200" height="200">
            <path
              d="M116 255.296c0-54.928 44.656-99.296 99.52-99.296h592.96c54.864 0 99.52 44.368 99.52 99.296v342.96c0 54.944-44.656 99.312-99.52 99.312H543.952V808h196.32a32 32 0 1 1 0 64H290.4a32 32 0 1 1 0-64h189.536v-110.432H215.52c-54.864 0-99.52-44.368-99.52-99.312V255.296z m99.52-35.296c-19.712 0-35.52 15.904-35.52 35.296v342.96c0 19.408 15.808 35.312 35.52 35.312h592.96c19.712 0 35.52-15.904 35.52-35.312V255.296a35.408 35.408 0 0 0-35.52-35.296H215.52z m444.48 32a32 32 0 0 1 29.92 20.64l92 241.984a32 32 0 1 1-59.84 22.752l-25.6-67.376h-72.96l-25.6 67.36a32 32 0 1 1-59.84-22.72l92-242.016a32 32 0 0 1 29.92-20.624z m-12.16 154h24.32l-12.16-31.952-12.16 31.952zM384 336a80 80 0 1 0 0 160 80 80 0 0 0 0-160z m-144 80a144 144 0 1 1 288 0 144 144 0 0 1-288 0z"
              p-id="3418" fill="#409EFF"></path>
          </svg>
        </div>
        <h2 class="login-title color-main">设置新密码</h2>
        <el-form-item prop="phone">
          <el-input v-model="ForgetPasswordQuery.phone" placeholder="请输入手机号"  autoComplete="off" ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-col :span="10">
            <el-input v-model="ForgetPasswordQuery.code"  placeholder="请输入验证码"  autoComplete="off" ></el-input>
          </el-col>
          <el-col :span="14" >
            <el-button type="primary" size="middle" @click="getCode" :disabled="!sendAuthCode" style="float: right">
              <span  v-show="!sendAuthCode">{{auth_time}}秒过期</span>
              <span v-show="sendAuthCode">获取验证码</span>
            </el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ForgetPasswordQuery.password" placeholder="请输入新密码"  autoComplete="off" ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="ForgetPassWord">
            确认修改
          </el-button>
        </el-form-item>
        <el-button style="float: right; margin-bottom: 10px;color: #9fa2a8"
                   type="text"
                   @click = 'passFormFlagFun'
        >登录</el-button>
      </el-form>
      <!--忘记密码end-->
      <!--注册账号start-->
      <el-form
        v-show="registerFormFlag"
        ref="registerQuery"
        :rules="registerQueryRules"
        :model="registerQuery"
      >
        <div style="text-align: center">
          <svg t="1585901382243" class="icon" icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="3417" width="200" height="200">
            <path
              d="M116 255.296c0-54.928 44.656-99.296 99.52-99.296h592.96c54.864 0 99.52 44.368 99.52 99.296v342.96c0 54.944-44.656 99.312-99.52 99.312H543.952V808h196.32a32 32 0 1 1 0 64H290.4a32 32 0 1 1 0-64h189.536v-110.432H215.52c-54.864 0-99.52-44.368-99.52-99.312V255.296z m99.52-35.296c-19.712 0-35.52 15.904-35.52 35.296v342.96c0 19.408 15.808 35.312 35.52 35.312h592.96c19.712 0 35.52-15.904 35.52-35.312V255.296a35.408 35.408 0 0 0-35.52-35.296H215.52z m444.48 32a32 32 0 0 1 29.92 20.64l92 241.984a32 32 0 1 1-59.84 22.752l-25.6-67.376h-72.96l-25.6 67.36a32 32 0 1 1-59.84-22.72l92-242.016a32 32 0 0 1 29.92-20.624z m-12.16 154h24.32l-12.16-31.952-12.16 31.952zM384 336a80 80 0 1 0 0 160 80 80 0 0 0 0-160z m-144 80a144 144 0 1 1 288 0 144 144 0 0 1-288 0z"
              p-id="3418" fill="#409EFF"></path>
          </svg>
        </div>
        <h2 class="login-title color-main">注册账号</h2>
        <el-form-item prop="username">
          <el-input v-model="registerQuery.username" autoComplete="off"  placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerQuery.password" autoComplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="registerQuery.phone" autoComplete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-col :span="10">
            <el-input v-model="registerQuery.code" autoComplete="off" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :span="14" >
            <el-button type="primary" size="middle" @click="getRegiestCodeFun" :disabled="!sendAuthCode" style="float: right">
              <span  v-show="!sendAuthCode">{{auth_time}}秒过期</span>
              <span v-show="sendAuthCode">获取验证码</span>
            </el-button>
          </el-col>
        </el-form-item>

        <el-form-item style="margin-bottom: 20px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="registerUserFunc">
            注册
          </el-button>
        </el-form-item>
        <el-button style="float: right; margin-bottom: 10px;color: #9fa2a8"
                   type="text"
                   @click = 'registerFormFlagFun'
        >登录</el-button>
      </el-form>
      <!--注册账号end-->
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>
<script>
  import {Message,MessageBox} from 'element-ui'
  import {validmobile} from '@/utils/validate';
  import {setCookie,getCookie} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png'
  import code_bg from '@/assets/images/code.png'
  import refresh_bg from '@/assets/images/refresh.png'
  import codephone from '@/assets/images/codephone.png'
  import {getPassCode,ForgetPW,getPhoneCode,getRegiestCode,registerUser,handQRCode} from '@/api/login'
  import md5 from 'js-md5';
  export default {
    name: 'login',
    data() {
      const checkphone = (rule, value, callback) => {
        if (!validmobile(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: '',
          password: '',
          code:''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', message: '请输入用户名或者手机号'}],
          password: [{required: true, trigger: 'blur', message: '请输入密码'}],
          code: [{required: true, trigger: 'blur', message: '请输入验证码'}]
        },
        PasswordRules:{
          phone: [{required: true, trigger: 'blur',validator:checkphone, message: '请输入正确的手机号'}],
          code: [{required: true, trigger: 'blur', message: '请输入验证码'}],
          password: [{required: true, trigger: 'blur', message: '请输入新密码'}]
        },
        registerQueryRules:{
          username: [{required: true, trigger: 'blur', message: '请输入用户名'}],
          password: [{required: true, trigger: 'blur', message: '请输入密码'}],
          phone: [{required: true, trigger: 'blur',validator:checkphone, message: '请输入正确的手机号'}],
          code: [{required: true, trigger: 'blur', message: '请输入验证码'}]
        },
        loading: false,
        pwdType: 'password',
        loginFormFlag: true,
        registerFormFlag:false,
        passFormFlag:false,
        ForgetPasswordQuery:{
          phone:'',
          code:'',
          password:''
        },
        registerQuery:{
          username:'',
          password:'',
          phone:'',
          code:''
        },
        sendAuthCode:true,
        auth_time:0,
        imgCode:this.baseURL+'/sys/getValidateCode',
        uuids:'',
        loginCode:'',
        login_center_bg,
        code_bg,
        refresh_bg,
        codephone,
        CodeFlag:true,
        timeCode:'',
        refreshFlag:false
      }
    },
    created() {
      this.loginForm.username = getCookie("username");
      this.loginForm.password = getCookie("password");
      if(this.loginForm.username === undefined||this.loginForm.username==null||this.loginForm.username===''){
        this.loginForm.username = '';
        this.loginForm.password = '';
      }
      if(this.loginForm.password === undefined||this.loginForm.password==null){
        this.loginForm.password = '';
      }
      let that=this
      document.onkeypress = function(e) {
        var keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13) {
          that.handleLogin();// 登录方法名
          return false;
        }
      };

    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      //倒计时
      timeOut(response){
        if(response.status === 0){
          Message({
            message: response.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.sendAuthCode = false;
          this.auth_time = 180;
          var auth_timetimer =  setInterval(()=>{
            this.auth_time--;
            if(this.auth_time<=0){
              this.sendAuthCode = true;
              clearInterval(auth_timetimer);
            }
          }, 1000);
        }else{
          Message({
            message: response.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      },
      changeImgCode () {
        var num=Math.ceil(Math.random()*10);//生成一个随机数（防止缓存）
        this.imgCode = this.imgCode+'?' + num;
      },
      passFormFlagFun(){
        this.loginFormFlag = !this.loginFormFlag
        this.passFormFlag = !this.passFormFlag
       /* this.CodeFlag=!this.CodeFlag*/
       this.$refs.ForgetPasswordQuery.resetFields()
        Object.keys(this.ForgetPasswordQuery).forEach(key => this.ForgetPasswordQuery[key]= '');
      },
      registerFormFlagFun(){
        this.loginFormFlag = !this.loginFormFlag
        this.registerFormFlag = !this.registerFormFlag
       /* this.CodeFlag=!this.CodeFlag*/
        this.$refs.registerQuery.resetFields()
        Object.keys(this.registerQuery).forEach(key => this.registerQuery[key]= '');
      },
      handleLogin() {
        let loginFormMd={
          username:this.loginForm.username,
          password: md5(this.loginForm.password),
          code:this.loginForm.code
        }
        this.$refs.loginForm.validate(valid => {
          if (valid) {
           //this.loading = true;
            this.$store.dispatch('Login', loginFormMd).then((res) => {
              this.loading = false;
              setCookie("username",this.loginForm.username,15);
              setCookie("password",this.loginForm.password,15);
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      //忘记密码验证码
      getCode(){
        if(validmobile(this.ForgetPasswordQuery.phone)){
          getPassCode(this.ForgetPasswordQuery.phone).then(response=>{
            this.timeOut(response)
          })
        }else{
          Message({
            message: '请输入合法手机号',
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      ForgetPassWord(){
        let ForgetPasswordMd={
          phone:this.ForgetPasswordQuery.phone,
          password: md5(this.ForgetPasswordQuery.password),
          code:this.ForgetPasswordQuery.code
        }
        this.$refs.ForgetPasswordQuery.validate(valid => {
          if (valid) {
            ForgetPW(ForgetPasswordMd).then(response=>{
              if(response.status === 0){
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
                Object.keys(this.ForgetPasswordQuery).forEach(key => this.ForgetPasswordQuery[key]= '');
                this.sendAuthCode = true;
                this.loginFormFlag = !this.loginFormFlag
                this.passFormFlag = !this.passFormFlag
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
      //注册验证码
      getRegiestCodeFun(){
        getRegiestCode(this.registerQuery.phone).then(response=>{
          this.timeOut(response)
        })
      },

      //注册
      registerUserFunc(){
        let registerQueryMd = {
          username:this.registerQuery.username,
          password:md5(this.registerQuery.password),
          phone:this.registerQuery.phone,
          code:this.registerQuery.code
        }
        this.$refs.registerQuery.validate(valid => {
          if (valid) {
            registerUser(registerQueryMd)
              .then(response=>{
                if(response.status === 0){
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.loginFormFlag = !this.loginFormFlag
                  this.registerFormFlag = !this.registerFormFlag
                }
              })
          }
        })
      },
      QRCode(){
        handQRCode(this.uuids).then(res=>{
         if(res.status ===0){
           location.reload()
           localStorage.setItem("loginToken", res.datas)
         }else if(res.status===1002){
           this.refreshFlag=true
           clearInterval(this.timeCode) //清理定时任务
         }
        })
      },
      //验证码登录
      handleCode(){
        if(this.CodeFlag){
          this.CodeFlag=false
          let s = [];
          let hexDigits = "0123456789abcdef";
          for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
          }
          s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
          s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
          s[8] = s[13] = s[18] = s[23] = "-";
          this.uuids = s.join("");
          this.loginCode=this.baseURL+'/QRCode/code?uId='+this.uuids
          this.timeCode=setInterval(() => {
            this.QRCode()
          }, 5000)
        }else{
          this.CodeFlag=true
          clearInterval(this.timeCode) //清理定时任务
        }
      },
      refreshCode(){
        this.refreshFlag=false
        this.loginFormFlag=true
        this.CodeFlag=true
        this.handleCode()
      }
    }
  }
</script>

<style scoped>
  .code{
    width:50px;
    height: 50px;
    position: absolute;
    right:0;
    top:0;
    z-index: 10;
    -webkit-transition: all .2s cubic-bezier(0.25,.5,.5,.9);
    transition: all .2s cubic-bezier(0.25,.5,.5,.9);
  }
  .code:hover{
    transform: scale(1.1);
  }
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }
  .login-title {
    text-align: center;
  }
  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
  .codeinfo{
    position: relative;
    width: 215px;
    height: 230px;
    margin:0 auto 56px;
  }
  .refresh{
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;
    width: 215px;
    height: 230px;
    z-index: 35;
  }
  .color-text{
    margin-top:90px;
  }
  .refresh img{
    width:30px;
    height:30px;
  }
</style>
