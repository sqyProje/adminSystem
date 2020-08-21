import request from '@/utils/request'
import qs from 'qs'
export function login(username, password,code) {
  return request({
    url: '/sys/login',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data:qs.stringify({
      username,
      password,
      code
    })
  })
}

export function getLeftMenuInfo() {
  return request({
    url: '/sys/menu_PerByUserId',
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
export function getLoginUserInfo() {
  return request({
    url: '/sys/userInfo',
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
//修改用户信息
export function editInfo(param) {
  return request({
    url: '/sys/editInfo',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:param
  })
}
//获取验证码
export function getPhoneCode(param) {
  return request({
    url: '/sys/getPhcode?phoneno='+param,
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
//修改手机号
export function editPhone(param) {
  return request({
    url: '/sys/editPhone',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:param
  })
}
//忘记密码获取验证码
export function getPassCode(param) {
  return request({
    url: '/sys/getPWPhCode?phoneno='+param,
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
//忘记密码
export function ForgetPW(param) {
  return request({
    url: '/sys/editPWord',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:param
  })
}
//修改密码
export function editPassWord(param) {
  return request({
    url: '/sys/re_PWord',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:param
  })
}

//注册账号获取验证码
export function getRegiestCode(param) {
  return request({
    url: '/sys/getCode?phone='+param,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
//注册账号
export function registerUser(param) {
  return request({
    url: '/sys/register',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:param
  })
}

//修改头像
export function uploadfile(param) {
  return request({
    url: 'file/getPicPath',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data:param
  })
}

export function logout() {
  return request({
    url: '/sys/loginOut',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
//转换token
var tokenap = localStorage.getItem('loginToken')
export function shiftToken() {
  return request({
    url: '/exchange/getClientToken?Authorization'+tokenap,
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
