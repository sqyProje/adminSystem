<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left"
               v-show="loginFormFlag"
      >
        <div style="text-align: center">
          <svg t="1585901382243" class="icon" icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="3417" width="200" height="200">
            <path
              d="M116 255.296c0-54.928 44.656-99.296 99.52-99.296h592.96c54.864 0 99.52 44.368 99.52 99.296v342.96c0 54.944-44.656 99.312-99.52 99.312H543.952V808h196.32a32 32 0 1 1 0 64H290.4a32 32 0 1 1 0-64h189.536v-110.432H215.52c-54.864 0-99.52-44.368-99.52-99.312V255.296z m99.52-35.296c-19.712 0-35.52 15.904-35.52 35.296v342.96c0 19.408 15.808 35.312 35.52 35.312h592.96c19.712 0 35.52-15.904 35.52-35.312V255.296a35.408 35.408 0 0 0-35.52-35.296H215.52z m444.48 32a32 32 0 0 1 29.92 20.64l92 241.984a32 32 0 1 1-59.84 22.752l-25.6-67.376h-72.96l-25.6 67.36a32 32 0 1 1-59.84-22.72l92-242.016a32 32 0 0 1 29.92-20.624z m-12.16 154h24.32l-12.16-31.952-12.16 31.952zM384 336a80 80 0 1 0 0 160 80 80 0 0 0 0-160z m-144 80a144 144 0 1 1 288 0 144 144 0 0 1-288 0z"
              p-id="3418" fill="#409EFF"></path>
          </svg>
        </div>
        <h2 class="login-title color-main">OA管理系统</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
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
            <el-input name="code"
                      type="text"
                      v-model="loginForm.code"
                      autoComplete="off"
                      placeholder="请输入验证码">
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
        <el-button style="float: left; margin-bottom: 10px;color: #9fa2a8"
                   type="text"
                   @click = 'registerFormFlagFun'
        >注册账号</el-button>
        <el-button style="float: right; margin-bottom: 10px;color: #9fa2a8"
                   type="text"
                   @click = 'passFormFlagFun'
        >忘记密码</el-button>
      </el-form>
      <!--忘记密码start-->
      <el-form
        v-show="passFormFlag"
        :rules="PasswordRules"
        ref="ForgetPasswordQuery"
        :model="ForgetPasswordQuery"
        label-width="80px"
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
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="ForgetPasswordQuery.phone" ></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-col :span="10">
            <el-input v-model="ForgetPasswordQuery.code"></el-input>
          </el-col>
          <el-col :span="14" >
            <el-button type="primary" size="middle" @click="getCode" :disabled="!sendAuthCode" style="float: right">
              <span  v-show="!sendAuthCode">{{auth_time}}秒过期</span>
              <span v-show="sendAuthCode">获取验证码</span>
            </el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input type="password" v-model="ForgetPasswordQuery.password"></el-input>
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
        label-width="80px"
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
        <el-form-item prop="username" label="用户名">
          <el-input v-model="registerQuery.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="registerQuery.password"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="registerQuery.phone"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-col :span="10">
            <el-input v-model="registerQuery.code"></el-input>
          </el-col>
          <el-col :span="14" >
            <el-button type="primary" size="middle" @click="getRegiestCodeFun" :disabled="!sendAuthCode" style="float: right">
              <span  v-show="!sendAuthCode">{{auth_time}}秒过期</span>
              <span v-show="sendAuthCode">获取验证码</span>
            </el-button>
          </el-col>
        </el-form-item>

        <el-form-item style="margin-bottom: 60px;text-align: center">
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
  import {Message} from 'element-ui'
  import {isvalidUsername} from '@/utils/validate';
  import {setCookie,getCookie} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png'
  import {getPassCode,ForgetPW,getPhoneCode,getRegiestCode,registerUser} from '@/api/login'
  import md5 from 'js-md5';
  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
          code:''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', message: '请输入用户名'}],
          password: [{required: true, trigger: 'blur', message: '请输入密码'}],
          code: [{required: true, trigger: 'blur', message: '请输入验证码'}]
        },
        PasswordRules:{
          phone: [{required: true, trigger: 'blur', message: '请输入手机号'}],
          password: [{required: true, trigger: 'blur', message: '请输入密码'}],
          code: [{required: true, trigger: 'blur', message: '请输入验证码'}]
        },
        registerQueryRules:{
          username: [{required: true, trigger: 'blur', message: '请输入用户名'}],
          password: [{required: true, trigger: 'blur', message: '请输入密码'}],
          phone: [{required: true, trigger: 'blur', message: '请输入手机号'}],
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
        login_center_bg
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
      },
      changeImgCode () {
        var num=Math.ceil(Math.random()*10);//生成一个随机数（防止缓存）
        this.imgCode = this.imgCode+'?' + num;
      },
      passFormFlagFun(){
        this.loginFormFlag = !this.loginFormFlag
        this.passFormFlag = !this.passFormFlag
      },
      registerFormFlagFun(){
        this.loginFormFlag = !this.loginFormFlag
        this.registerFormFlag = !this.registerFormFlag
      },
      handleLogin() {
        let loginFormMd={
          username:this.loginForm.username,
          password: md5(this.loginForm.password),
          code:this.loginForm.code
        }
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', loginFormMd).then(() => {
              this.loading = false;
              setCookie("username",this.loginForm.username,15);
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      },
      //忘记密码验证码
      getCode(){
        getPassCode(this.ForgetPasswordQuery.phone).then(response=>{
          this.timeOut(response)
        })
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
                this.loginFormFlag = !this.loginFormFlag
                this.passFormFlag = !this.passFormFlag
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
      }
    }
  }
</script>

<style scoped>
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
</style>
