import request from '@/utils/request'
import qs from 'qs'
/*用户*/
export function UserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}
export function AddUser(params) {
  return request({
    url: '/user/add',
    method: 'post',
    data: params
  })
}
export function GetUser(params) {
  return request({
    url: '/user/edit?u_id='+params,
    method: 'get',
  })
}
export function EditUser(params) {
  return request({
    url: '/user/edit',
    method: 'post',
    data: params,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
}
export function DeleteUser(params) {
  return request({
    url: '/user/deletes?array='+params,
    method: 'post'
  })
}
//当前用户角色
export function UserRole(params) {
  return request({
    url: '/user_role/listByUserId?userId='+params,
    method: 'get'
  })
}

export function updateRole(userId,roleIds) {
  return request({
    url: '/user_role/updateByUserId?userId='+userId+'&roleIds='+roleIds,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}
//部门列表
export function departDrop() {
  return request({
    url: '/depart/drop',
    method: 'GET',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
  })
}
/*用户end*/
/*角色列表*/

export function RoleList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}
export function AddRole(params) {
  return request({
    url: '/role/add',
    method: 'post',
    data: params
  })
}
export function GetRole(params) {
  return request({
    url: '/role/edit?r_id='+params,
    method: 'get',
  })
}
export function EditRole(params) {
  return request({
    url: '/role/edit',
    method: 'post',
    data: params,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
}
export function DeleteRole(params) {
  return request({
    url: '/role/deletes?array='+params,
    method: 'post'
  })
}
export function RoleMenu(params) {
  return request({
    url: '/role_menu/getTreeMenuByRoleId?roleId='+params,
    method: 'get'
  })
}


export function UploadRoleMenu(roleId,perIds) {
  return request({
    url: '/role_menu/updateTreeMenuByRoleId?roleId='+roleId+'&perIds='+perIds,
    method: 'post'
  })
}
/*菜单权限*/

export function MenuLists(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: params
  })
}

export function AddMenu(params) {
  return request({
    url: '/menu/add',
    method: 'post',
    data: params
  })
}
export function GetMenu(params) {
  return request({
    url: '/menu/edit?m_id='+params,
    method: 'get',
  })
}
export function EditMenu(params) {
  return request({
    url: '/menu/edit',
    method: 'post',
    data: params
  })
}
export function DeleteMenu(params) {
  return request({
    url: '/menu/deletes?array='+params,
    method: 'post'
  })
}
export function GetMenuInfoArray() {
  return request({
    url: '/menu/getByTree',
    method: 'get',
  })
}
//审批角色
export function ApproveList(params) {
  return request({
    url: '/approveRole/list',
    method: 'get',
    params: params
  })
}
export function AddApprove(params) {
  return request({
    url: '/approveRole/add',
    method: 'post',
    data: params
  })
}
export function GetApprove(params) {
  return request({
    url: '/approveRole/edit?uId='+params,
    method: 'get',
  })
}
export function EditApprove(params) {
  return request({
    url: '/approveRole/edit',
    method: 'post',
    data: params
  })
}
export function DeleteApprove(params) {
  return request({
    url: '/approveRole/deletes?array='+params,
    method: 'post'
  })
}
export function ApproveMenu(params) {
  return request({
    url: '/user_ApproveRole/getUsersById?approveRoleId='+params,
    method: 'get'
  })
}
export function UploadApproveMenu(roleId,perIds) {
  return request({
    url: '/user_ApproveRole/usersById?approveRoleId='+roleId+'&array='+perIds,
    method: 'post'
  })
}
//用户下拉框
export function userDrop(params) {
  return request({
    url: '/user/drop',
    method: 'get'
  })
}
//审批角色下拉框
export function approveRoleDrop(params) {
  return request({
    url: '/approveRole/drop',
    method: 'get'
  })
}
