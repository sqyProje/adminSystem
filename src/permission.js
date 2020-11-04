import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import {getCookie} from '@/utils/support';
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()

  if (localStorage.getItem('loginToken')) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
    //  const fromPath = GetUrlRelativePath(window.location.href)
      if (store.getters.roles.length === 0) {
        store.dispatch('GetLeftMenuInfo').then(res => { // 拉取左侧菜单信息*/
          let menus=res.datas.menuModels;
          store.dispatch('GenerateRoutes', { menus }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to, replace: true })
          //  next({path:fromPath})
          })
          store.dispatch('GetLoginUserInfo').then(res => {
          //  console.log(4)
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
