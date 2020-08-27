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
    noCache:false                if set true, the page will no be cached(default is false)
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
  {
    path: '/address',
    redirect: '/address',
    component: Layout,
    name: 'addressBook',
    meta: {title: '通讯录', icon: 'product'},
    children: [{
      path: 'address',
      name: 'addressBook',
      component: () => import('@/views/address/index'),
      meta: {title: '通讯录', icon: 'home'}
    }]
  },
  {
    path:'/personalDoor',
    component: Layout,
    name: 'personalDoor',
    meta: {title: '个人门户', icon: 'product'},
    children: [
      {
        path:'approve',
        component: ()=> import('@/views/personalDoor/approve/index'),
        redirect:'/personalDoor/approve/sub_approve',
        name:'approve',
        meta:{title:'审批管理',icon:'product'},
        children:[
          {
            path:'sub_approve',
            name:'sub_approve',
            component:()=>import('@/views/personalDoor/approve/sub_approve'),
            meta:{title:'提交审批',icon: 'product-list',noCache: true}
          },
          {
            path: 'sub_approve_fields',
            name: 'sub_approve_fields',
            component: () => import('@/views/personalDoor/approve/sub_approve/fields'),
            meta: {title: '提交表单信息'},
            hidden: true
          },
          {
            path:'my_approve',
            name:'my_approve',
            component:()=>import('@/views/personalDoor/approve/my_approve'),
            meta:{title:'我的审批',icon: 'product-list',noCache: true}
          },
          {
            path: 'flowInfo',
            name: 'my_approve_fields',
            component: () => import('@/views/personalDoor/approve/components/flowInfo'),
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
            component: () => import('@/views/personalDoor/approve/components/workflow'),
            meta: {title: '审批过程'},
            hidden: true
          },
          {
            path:'wait_approve',
            name:'wait_approve',
            component:()=>import('@/views/personalDoor/approve/wait_approve'),
            meta:{title:'待我审批',icon: 'product-list',noCache: true}
          },
          {
            path:'complete_approve',
            name:'complete_approve',
            component:()=>import('@/views/personalDoor/approve/complete_approve'),
            meta:{title:'我已审批',icon: 'product-list',noCache: true}
          },
          {
            path:'copy_approve',
            name:'copy_approve',
            component:()=>import('@/views/personalDoor/approve/copy_approve'),
            meta:{title:'抄送我的',icon: 'product-list',noCache: true}
          }
        ]
      },
      {
        path:'webNews',
        name:'webNews',
        component:()=>import('@/views/personalDoor/webNews'),
        meta:{title:'新闻公告',icon: 'product-list',noCache: true}
      },
      {
        path:'AnnouncementNewsDetails',
        name:'AnnouncementNewsDetails',
        component:()=>import('@/views/personalDoor/AnnouncementNewsDetails'),
        meta:{title:'公告详情'},
        hidden: true
      },
      {
        path:'NewsDetails',
        name:'NewsDetails',
        component:()=>import('@/views/personalDoor/NewsDetails'),
        meta:{title:'新闻详情'},
        hidden: true
      },
      {
        path:'webMeeting',
        component: ()=> import('@/views/personalDoor/webMeeting/index'),
        redirect:'/personalDoor/webMeeting/mymeetting',
        name:'webMyMeeting',
        meta:{title:'我的会议',icon:'product'},
        children:[
          {
            path:'mymeetting',
            name:'webMyMeeting',
            component:()=>import('@/views/personalDoor/webMeeting/mymeetting'),
            meta:{title:'我的会议',noCache: true}
          },
          {
            path: 'waitmeetting',
            name: 'webMyWaitMeeting',
            component: () => import('@/views/personalDoor/webMeeting/waitmeetting'),
            meta: {title:'待参加会议'},
          },
          {
            path: 'AboutICCCAS',
            name: 'AboutICCCAS',
            component: () => import('@/views/personalDoor/webMeeting/AboutICCCAS'),
            meta: {title:'会议详情'},
            hidden: true
          },
        ]
      },
      {
        path:'letterbox',
        component: ()=> import('@/views/personalDoor/letterbox/index'),
        redirect:'/personalDoor/letterbox/anonletter',
        name:'webLetterbox',
        meta:{title:'我的信箱',icon:'product'},
        children:[
          {
            path:'anonletter',
            name:'webAnonLetterbox',
            component:()=>import('@/views/personalDoor/letterbox/anonletter'),
            meta:{title:'发起的匿名信',noCache: true}
          },
          {
            path:'personletters',
            name:'person_letter/s',
            component:()=>import('@/views/personalDoor/letterbox/personletters'),
            meta:{title:'匿名信池',noCache: true}
          },
          {
            path:'myReport',
            name:'person_report_myReport',
            component:()=>import('@/views/personalDoor/letterbox/myReport'),
            meta:{title:'我的汇报',noCache: true}
          },
          {
            path: 'worksummarys',
            name: 'person_report_reportMe',
            component: () => import('@/views/personalDoor/letterbox/worksummarys'),
            meta: {title: '汇报给我的',noCache: true},
          },
          {
            path: 'myReportDraft',
            name: 'person_report_myReportDraft',
            component: () => import('@/views/personalDoor/letterbox/myReportDraft'),
            meta: {title: '我的汇报草稿',noCache: true},
          },
          {
            path: 'gohuibao',
            name: 'gohuibao',
            component: () => import('@/views/personalDoor/letterbox/gohuibao'),
            meta: {title: '去汇报工作页',noCache: true},
            hidden: true
          },
         
          {
            path: 'worksummarys',
            name: 'webMyWorkSummary',
            component: () => import('@/views/personalDoor/letterbox/worksummarys'),
            meta: {title: '工作汇报',noCache: true},
          },
          {
            path: 'detailsList',
            name: 'detailsList',
            component: () => import('@/views/personalDoor/letterbox/detailsList'),
            meta: {title: '汇报工作详情'},
            hidden: true
          },
          {
            path:'newanonletter',
            name:'newanonletter',
            component:()=>import('@/views/personalDoor/letterbox/newanonletter'),
            meta:{title:'发起新的的匿名信',noCache: true},
            hidden: true
          },
          {
            path:'anonletterDetails',
            name:'anonletterDetails',
            component:()=>import('@/views/personalDoor/letterbox/anonletterDetails'),
            meta:{title:'我的匿名信详情',noCache: true},
            hidden: true
          },
          {
            path:'bianjihuibao',
            name:'bianjihuibao',
            component:()=>import('@/views/personalDoor/letterbox/bianjihuibao'),
            meta:{title:'编辑汇报',noCache: true},
            hidden: true
          },
        ],
      },
     
    ]
  },
  {
    path: '/hrDoor',
    component: Layout,
    redirect: '/hrDoor/depart',
    name: 'HRDoor',
    meta: {title: '人事管理', icon: 'product'},
    children: [
      {
        path: 'depart',
        name: 'depart',
        component: () => import('@/views/hrDoor/depart'),
        meta: {title: '部门管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'station',
        name: 'station',
        component: () => import('@/views/hrDoor/station'),
        meta: {title: '岗位管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'duty',
        name: 'duty',
        component: () => import('@/views/hrDoor/duty'),
        meta: {title: '职务管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'record',
        name: 'record',
        component: ()=> import('@/views/hrDoor/record/index'),
        meta: {title: '档案管理', icon: 'product-list',noCache: true},
        redirect:'/hrDoor/record/employee',
        children:[{
          path: 'employee',
          name: 'employee',
          component: () => import('@/views/hrDoor/record/employee'),
          meta: {title: '人员管理', icon: 'product-list',noCache: true},
        },
          {
            path: 'msgApprove',
            name: 'msgApprove',
            component: () => import('@/views/hrDoor/record/employee/msgApprove'),
            meta: {title: '信息审核', icon: 'product-list',noCache: true},
          },
          {
            path: 'detail',
            
            name: 'detail',
            component: () => import('@/views/hrDoor/record/employee/detail'),
            meta: {title: '详细信息'},
            hidden: true
          },
        ]
      },
      {
        path: 'salary',
        name: 'salary',
        component: () => import('@/views/hrDoor/salary'),
        meta: {title: '薪资管理', icon: 'product-list',noCache: true}
      },
      {
        path: 'e_weal',
        name: 'e_weal',
        component: ()=> import('@/views/hrDoor/e_weal/index'),
        meta: {title: '福利管理',  icon: 'product-list',noCache: true},
        redirect:'/hrDoor/e_weal/weal',
        children:[
          {
            path: 'wealName',
            name: 'wealName',
            component: () => import('@/views/hrDoor/e_weal/weal/wealName'),
            meta: {title: '福利表管理',noCache: true},
          },
          {
            path: 'weal',
            name: 'weal',
            component: () => import('@/views/hrDoor/e_weal/weal/index'),
            meta: {title: '福利管理',noCache: true},
          },
        ]
      },
    ]
  },
  {
    path: '/reportDoor',
    component: Layout,
    redirect: '/reportDoor/yearReport',
    name: 'reportDoor',
    meta: {title: '报表门户', icon: 'product'},
    children: [
      {
        path: 'yearReport',
        name: 'yearApproveReport',
        component: () => import('@/views/reportDoor/yearReport'),
        meta: {title: '年度审批报表', icon: 'product-list', noCache: true}
      },
      {
        path: 'checkReport',
        name: 'checkReport',
        component: () => import('@/views/reportDoor/checkReport'),
        meta: {title: '核算报表', icon: 'product-list', noCache: true}
      },
      {
        path: 'financeReport',
        name: 'financeReport',
        component: () => import('@/views/reportDoor/financeReport'),
        meta: {title: '财务报表', icon: 'product-list', noCache: true}
      },
    ]
  },
  {
    path:'/systemDoor',
    component: Layout,
    name: 'systemDoor',
    meta: {title: '系统门户', icon: 'product'},
    children: [
      {
      path: 'menuInfo',
      name: 'menu_per',
      component: () => import('@/views/systemDoor/menuInfo'),
      meta: {title: '菜单管理', noCache: true}
      },
      {
        path: 'appmenu',
        name: 'appPermission',
        component: () => import('@/views/systemDoor/appmenu'),
        meta: {title: 'APP菜单管理', noCache: true}
      },
      {
        path: 'log',
        name: 'logDetails',
        component: () => import('@/views/systemDoor/log'),
        meta: {title: '日志管理'}
      },
      {
        path: 'diction',
        name: 'diction',
        component: () => import('@/views/systemDoor/diction'),
        meta: {title: '字典管理'}
      },
     {
        path: 'version',
        name: 'versionControl',
        component: () => import('@/views/systemDoor/version'),
        meta: {title: 'APP版本控制'}
      }
    ]
  },
  {
    path:'/manageDoor',
    name: 'manageDoor',
    component: Layout,
    redirect: '/manageDoor/news/keyWord',
    meta: {title: '管理门户', icon: 'product'},
    children:[
      {
        path:'news',
        name:'newsMsg',
        component:()=> import('@/views/manageDoor/index'),
        redirect:'/manageDoor/news/newsType',
        meta:{title:'新闻公告管理' ,icon: 'product'},
        children:[
          {
            path: 'newsType',
            name: 'newsMsgType',
            component: () => import('@/views/manageDoor/news/newsType'),
            meta: {title: '流程表单分类',noCache: true}
          },
          {
            path: 'keyWord',
            name: 'keyWord',
            component: () => import('@/views/manageDoor/news/keyWord'),
            meta: {title: '文章关键词',noCache: true}
          },
          {
            path: 'newsMsg',
            name: 'newsMsg',
            component: () => import('@/views/manageDoor/news/newsMsg'),
            meta: {title: '新闻管理',noCache: true}
          },
          {
            path: 'notice',
            name: 'notice',
            component: () => import('@/views/manageDoor/news/notice'),
            meta: {title: '公告管理',noCache: true}
          },
        ]
      },
      {
        path:'meet',
        name:'meeting',
        component:()=> import('@/views/manageDoor/index'),
        redirect:'/manageDoormeet/meetroom',
        meta:{title:'会议管理',icon:'product'},
        children:[
          {
            path: 'meetroom',
            name: 'meetingRoom',
            component: () => import('@/views/manageDoor/meet/meetroom'),
            meta: {title: '会议室管理', icon: 'product-list',noCache: true}
          },
          {
            path: 'meetType',
            name: 'meetingType',
            component: () => import('@/views/manageDoor/meet/meetType'),
            meta: {title: '会议分类', icon: 'product-list',noCache: true}
          },
          {
            path: 'meeting',
            name: 'meeting',
            component: () => import('@/views/manageDoor/meet/index'),
            meta: {title: '会议管理', icon: 'product-list',noCache: true}
          },
        ]
      },
      {
        path: 'menu_pers',
        component:()=> import('@/views/manageDoor/index'),
        redirect: '/manageDoor/menu_pers/userInfo',
        name: 'menu_pers',
        meta: {title: '权限管理', icon: 'product'},
        children: [
          {
            path: 'userInfo',
            name: 'user',
            component: () => import('@/views/manageDoor/menu_pers/userInfo'),
            meta: {title: '用户管理',noCache: true}
          },
          {
            path: 'approveRole',
            name: 'approveRole',
            component: () => import('@/views/manageDoor/menu_pers/approveRole'),
            meta: {title: '审批角色'}
          },
          {
            path: 'roleInfo',
            name: 'role',
            component: () => import('@/views/manageDoor/menu_pers/roleInfo'),
            meta: {title: '角色管理'}
          },
          {
            path: 'approle',
            name: 'appRole',
            component: () => import('@/views/manageDoor/menu_pers/approle'),
            meta: {title: 'App角色管理'}
          },
          {
            path: 'loginUser',
            name: '个人信息',
            hidden:true,
            component: () => import('@/views/manageDoor/menu_pers/loginUser'),
            meta: {title: '个人信息', icon: 'home'}
          }
        ]
      },
      {
        path:'tableForm',
        name:'tableForm',
        component:()=> import('@/views/manageDoor/index'),
        redirect:'/manageDoortableForm/act_form_type/act_form_type',
        meta:{title:'表单管理',icon:'product'},
        children:[
          {
            path: 'act_form_type',
            name: 'act_form_type',
            component: () => import('@/views/manageDoor/tableForm/act_form_type/act_form_type'),
            meta: {title: '流程表单分类', icon: 'product-list',noCache: true}
          },
          {
            path: 'form',
            name: 'form',
            component: () => import('@/views/manageDoor/tableForm/form/form'),
            meta: {title: '表单管理', icon: 'product-list',noCache: true}
          },
          {
            path: 'FormFields',
            name: 'FormFields',
            component: () => import('@/views/manageDoor/tableForm/form/components/fields'),
            meta: {title: '字段管理'},
            hidden: true
          },{
            path: 'FlowNode',
            name: 'qdFlow',
            component: () => import('@/views/manageDoor/tableForm/form/components/FlowNode'),
            meta: {title: '表单流程'},
            hidden: true
          }
        ]
      },
      {
        path: 'work',
        component:()=> import('@/views/manageDoor/index'),
        redirect: '/manageDoor/work/oweuser',
        name: 'workReport',
        meta: {title: '工作汇报管理', icon: 'product'},
        children: [
          {
            path: 'oweuser',
            name: 'oweUsers',
            component: () => import('@/views/manageDoor/work/oweuser'),
            meta: {title: '拖欠汇报人员'}
          },{
            path: 'reportCycle',
            name: 'workReportCycle',
            component: () => import('@/views/manageDoor/work/reportCycle'),
            meta: {title: '汇报周期管理',noCache: true}
          }
          ]
      }
    ]
  }
]
/*export const asyncRouterMap = [
  {
    path: '/address',
    component: Layout,
    meta: {title: '通讯录', icon: 'product'},
    children:[{
      path: '/address',
      name: 'addressBook',
      component: () => import('@/views/address/index'),
      meta: {title: '通讯录', icon: 'home',}
    }]
  },
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
]*/

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

