import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home',affix: true}
    }]
  },
]

export const asyncRouterMap = [
  /*{
    path: '',
    component: Layout,
    meta: {title: '通讯录', icon: 'product'},
    children:[{
      path: '/address',
      name: 'addressBook',
      component: () => import('@/views/address/index'),
      meta: {title: '通讯录', icon: 'home',}
    }]
  },*/
  {
    path: '/menu_pers',
    component: Layout,
    redirect: '/menu_pers/userInfo',
    name: 'menu_pers',
    meta: {title: '权限管理', icon: 'product'},
    children: [{
        path: 'userInfo',
        name: 'user',
        component: () => import('@/views/menu_pers/userInfo'),
        meta: {title: '用户列表', icon: 'product-list',noCache: true}
      },
      {
        path: 'approveRole',
        name: 'approveRole',
        component: () => import('@/views/menu_pers/approveRole'),
        meta: {title: '审批角色', icon: 'product-add'}
      },
      {
        path: 'roleInfo',
        name: 'role',
        component: () => import('@/views/menu_pers/roleInfo'),
        meta: {title: '角色管理', icon: 'product-add'}
      },
      {
        path: 'menuInfo',
        name: 'menu_per',
        component: () => import('@/views/menu_pers/menuInfo'),
        meta: {title: '权限管理', icon: 'product-add'}
      },
      {
        path: 'loginUser',
        name: '个人信息',
        hidden:true,
        component: () => import('@/views/menu_pers/loginUser'),
        meta: {title: '个人信息', icon: 'home'}
      }
    ]
  },
  {
    path: '/personnel',
    component: Layout,
    redirect: '/personnel/depart',
    name: 'personnel',
    meta: {title: '人事管理', icon: 'product'},
    children: [
      {
        path: 'depart',
        name: 'depart',
        component: () => import('@/views/personnel/depart'),
        meta: {title: '部门管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'station',
        name: 'station',
        component: () => import('@/views/personnel/station'),
        meta: {title: '岗位管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'duty',
        name: 'duty',
        component: () => import('@/views/personnel/duty'),
        meta: {title: '职务管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'record',
        name: 'record',
        component: ()=> import('@/views/personnel/record/index'),
        meta: {title: '档案管理', icon: 'product-list',noCache: true},
        redirect:'/personnel/record/employee',
        children:[{
          path: 'employee',
          name: 'employee',
          component: () => import('@/views/personnel/record/employee'),
          meta: {title: '人员管理', icon: 'product-list',noCache: true},
        },
        {
          path: 'msgApprove',
          name: 'msgApprove',
          component: () => import('@/views/personnel/record/employee/msgApprove'),
          meta: {title: '信息审核', icon: 'product-list',noCache: true},
        },
        {
          path: 'detail',
          name: 'detail',
          component: () => import('@/views/personnel/record/employee/detail'),
          meta: {title: '详细信息'},
          hidden: true
        },
        ]
      },
      {
        path: 'salary',
        name: 'salary',
        component: () => import('@/views/personnel/salary'),
        meta: {title: '薪资管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'e_weal',
        name: 'e_weal',
        component: ()=> import('@/views/personnel/e_weal/index'),
        meta: {title: '福利管理',  icon: 'product-list',noCache: true},
        redirect:'/personnel/e_weal/weal',
        children:[
          {
            path: 'wealName',
            name: 'wealName',
            component: () => import('@/views/personnel/e_weal/weal/wealName'),
            meta: {title: '福利表管理',noCache: true},
          },
          {
            path: 'weal',
            name: 'weal',
            component: () => import('@/views/personnel/e_weal/weal/index'),
            meta: {title: '福利管理',noCache: true},
          },
        ]
      },
    ]
  },
  {
    path:'/news',
    name:'newsMsg',
    component:Layout,
    redirect:'news/newsType',
    meta:{title:'新闻分类',icon:'product'},
    children:[
      {
        path: 'newsType',
        name: 'newsMsgType',
        component: () => import('@/views/news/newsType'),
        meta: {title: '流程表单分类', icon: 'product-list',noCache: true}
      },
      {
        path: 'keyWord',
        name: 'keyWord',
        component: () => import('@/views/news/keyWord'),
        meta: {title: '文章关键词', icon: 'product-list',noCache: true}
      },
      {
        path: 'newsMsg',
        name: 'newsMsg',
        component: () => import('@/views/news/newsMsg'),
        meta: {title: '新闻管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'notice',
        name: 'notice',
        component: () => import('@/views/news/notice'),
        meta: {title: '公告管理', icon: 'product-list',noCache: true}
      },
    ]
  },
  {
    path:'/meet',
    name:'meeting',
    component:Layout,
    redirect:'meet/meetroom',
    meta:{title:'会议管理',icon:'product'},
    children:[
      {
        path: 'meetroom',
        name: 'meetingRoom',
        component: () => import('@/views/meet/meetroom'),
        meta: {title: '会议室管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'meetType',
        name: 'meetingType',
        component: () => import('@/views/meet/meetType'),
        meta: {title: '会议分类', icon: 'product-list',noCache: true}
      },
      {
        path: 'meeting',
        name: 'meeting',
        component: () => import('@/views/meet/index'),
        meta: {title: '会议管理', icon: 'product-list',noCache: true}
      },
    ]
  },
  {
    path:'/tableForm',
    name:'tableForm',
    component:Layout,
    redirect:'tableForm/act_form_type/act_form_type',
    meta:{title:'会议管理',icon:'product'},
    children:[
      {
        path: 'act_form_type',
        name: 'act_form_type',
        component: () => import('@/views/tableForm/act_form_type/act_form_type'),
        meta: {title: '流程表单分类', icon: 'product-list',noCache: true}
      },
      {
        path: 'form',
        name: 'form',
        component: () => import('@/views/tableForm/form/form'),
        meta: {title: '表单管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'FormFields',
        name: 'FormFields',
        component: () => import('@/views/tableForm/form/components/fields'),
        meta: {title: '字段管理'},
        hidden: true
      },{
        path: 'FlowNode',
        name: 'qdFlow',
        component: () => import('@/views/tableForm/form/components/FlowNode'),
        meta: {title: '表单流程'},
        hidden: true
      }
    ]
  },
  {
    path:'/approve',
    component:Layout,
    redirect:'/approve/sub_approve',
    name:'approve',
    meta:{title:'审批管理',icon:'product'},
    children:[
      {
        path:'sub_approve',
        name:'sub_approve',
        component:()=>import('@/views/approve/sub_approve'),
        meta:{title:'提交审批',icon: 'product-list',noCache: true}
      },
      {
        path: 'sub_approve_fields',
        name: 'sub_approve_fields',
        component: () => import('@/views/approve/sub_approve/fields'),
        meta: {title: '提交表单信息'},
        hidden: true
      },
      {
        path:'my_approve',
        name:'my_approve',
        component:()=>import('@/views/approve/my_approve'),
        meta:{title:'我的审批',icon: 'product-list',noCache: true}
      },
      {
        path: 'flowInfo',
        name: 'my_approve_fields',
        component: () => import('@/views/approve/components/flowInfo'),
        meta: {title: '审批'},
        hidden: true
      },
      {
        path: 'see',
        name: 'see',
        component: () => import('@/views/approve/components/see'),
        meta: {title: '查看'},
        hidden: true
      },
      {
        path: 'workflow',
        name: 'workflow',
        component: () => import('@/views/approve/components/workflow'),
        meta: {title: '审批过程'},
        hidden: true
      },
      {
        path:'wait_approve',
        name:'wait_approve',
        component:()=>import('@/views/approve/wait_approve'),
        meta:{title:'待我审批',icon: 'product-list',noCache: true}
      },
      {
        path:'complete_approve',
        name:'complete_approve',
        component:()=>import('@/views/approve/complete_approve'),
        meta:{title:'我已审批',icon: 'product-list',noCache: true}
      },
      {
        path:'copy_approve',
        name:'copy_approve',
        component:()=>import('@/views/approve/copy_approve'),
        meta:{title:'抄送我的',icon: 'product-list',noCache: true}
      }

    ]
  },
  {
    path: '/basic',
    component: Layout,
    redirect: '/basic/diction',
    name: 'basic',
    meta: {title: '基本设置', icon: 'product'},
    children: [{
      path: 'diction',
      name: 'diction',
      component: () => import('@/views/basic/diction'),
      meta: {title: '字典管理', icon: 'product-list',noCache: true}
    }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

