import { login, logout, getLeftMenuInfo, getLoginUserInfo, shiftToken,taskAlert } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'

const user = {
  state: {
    // 获取token
    token: localStorage.getItem('loginToken'),
    //token: Cookies.get('authorization'),
    name: '',
    avatar: '',
    roles: [],
    loginUserInfo: {},
    btnPermission: [],
    dateInfo:{}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERS: (state, loginUserInfo) => {
      state.loginUserInfo = loginUserInfo
    },
    SET_BUTTON: (state, btnPermission) => {
      state.btnPermission = btnPermission
    },
    SET_DATEINFO:(state,DateInfo)=>{
      state.dateInfo = DateInfo
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.code).then(response => {
          localStorage.setItem("loginToken", response.datas)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取左侧菜单信息
    GetLeftMenuInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getLeftMenuInfo().then(response => {
          const data = response.datas
          const roles = ['admin']
          if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_BUTTON', data.perModels)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //获取用户登录信息
    GetLoginUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getLoginUserInfo().then(response => {
          localStorage.setItem("uid", response.datas.uId)
          const data = response.datas
          commit('SET_NAME', data.realname)
          commit('SET_AVATAR', data.picpath) //上线请打开注释
          commit('SET_USERS', data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //获取人事信息过期数据
    taskAlertInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        taskAlert().then(response => {
          const data = response.datas
          commit('SET_DATEINFO', data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          //removeToken()
          localStorage.removeItem('loginToken')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        // removeToken()
        localStorage.removeItem('loginToken')
        resolve()
      })
    }
  }
}

export default user
