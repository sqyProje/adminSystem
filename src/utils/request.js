import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { setToken,getToken } from '@/utils/auth'
// 创建axios实例

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true
})
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = localStorage.getItem('loginToken') // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  //console.log(error) // for debug
  Promise.reject(error)
})

// respone响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if(response.headers.authorization)
    {
      store.commit('SET_TOKEN', response.headers.authorization)
      localStorage.setItem('loginToken',response.headers.authorization)
    }
    if(response.status !== 200){
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject('error')
    }else if(response.data.type === 'application/vnd.ms-excel'){
      return response
    }else{
      if(response.config.url.indexOf('/QRCode/handQRCode')>-1){
        if(res.status !==0){
           return response.data
       //   return Promise.reject('error')
        }else{
          return response.data

        }
      }
      if(res.status !==0){
        Message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
        return Promise.reject('error')
      }else{
        return response.data

      }
    }
  },
  error => {
   // console.log(error)// for debug
    if(error.response.data.status === 1005){
      /*MessageBox.confirm('登录信息过期，请重新登录', '确定登出', {//error.response.data.msg
        confirmButtonText: '重新登录',
        cancelButtonText: false,
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      })*/
      MessageBox.alert('登录信息过期，请重新登录', '确定登出', {//error.response.data.msg
        confirmButtonText: '重新登录',
        type: 'warning',
        callback:action=>{
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      })
    }

    return Promise.reject(error)
  }
)

export default service
