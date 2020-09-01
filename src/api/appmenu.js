import request from '@/utils/request'
export function AppRoleList(params){
  return request({
    url:'/appRole/list',
    method:'get',
    params:params
  })
}
export function AppRoleGet(params){
  return request({
    url:'/appRole/edit?uId='+params,
    type:'get',
  })
}
export function AddAppRole(params) {
  return request({
    url: '/appRole/add',
    method: 'post',
    data: params
  })
}
export function EditAppRole(params) {
  return request({
    url: '/appRole/edit',
    method: 'post',
    data: params
  })
}
export function DeleteappRole(params) {
  return request({
    url: '/appRole/deletes?array='+params,
    method: 'post'
  })
}
//当前用户角色
export function AppRole(params) {
  return request({
    url: '/appRole_Per/getPerByRoleId?roleId='+params,
    method: 'get'
  })
}

export function updateAppRole(roleId,perIds) {
  return request({
    url: '/appRole_Per/updatePerByRoleId?roleId='+roleId+'&perIds='+perIds,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
//APP菜单管理

export function AppMenuList(params){
  return request({
    url:'/appPermission/list',
    method:'get',
    params:params
  })
}
export function AppMenuGet(params){
  return request({
    url:'/appPermission/edit?uId='+params,
    method:'get',
  })
}
export function AddAppMenu(params) {
  return request({
    url: '/appPermission/add',
    method: 'post',
    data: params
  })
}
export function EditAppMenu(params) {
  return request({
    url: '/appPermission/edit',
    method: 'post',
    data: params
  })
}
export function DeleteAppMenu(params) {
  return request({
    url: '/appPermission/deletes?array='+params,
    method: 'post'
  })
}

export function UserAppRoleGet(params){
  return request({
    url:'/user_appRole/listByUserId?userId='+params,
    method:'get',
  })
}


export function UserAppRoleUpdate(userId,roleIds){
  return request({
    url:'/user_appRole/updateByUserId?userId='+userId+'&roleIds='+roleIds,
    method: 'post'
  })
}
