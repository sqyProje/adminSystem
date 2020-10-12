import qs from 'qs'
import request from '@/utils/request'
/*工作流管理*/
export function InitList(params) {
  return request({
    url: '/form/list',
    method: 'get',
    params: params
  })
}
export function AddInfo(params) {
  return request({
    url: '/form/add',
    method: 'post',
    data: params
  })
}
export function GetInfo(params) {
  return request({
    url: '/form/edit?a_Id='+params,
    method: 'get',
  })
}
export function EditInfo(params) {
  return request({
    url: '/form/edit',
    method: 'post',
    data: params
  })
}
export function DeleteInfo(params) {
  return request({
    url: '/form/deletes?array='+params,
    method: 'post'
  })
}
//字段管理

export function InitFieldList(params) {
  return request({
    url: '/field/list?form_id='+params,
    method: 'get'
  })
}
export function AddFieldInfo(params) {
  return request({
    url: '/field/add',
    method: 'post',
    data: params
  })
}
export function GetFieldInfo(params) {
  return request({
    url: '/field/edit?f_id='+params,
    method: 'get',
  })
}
export function EditFieldInfo(params) {
  return request({
    url: '/field/edit',
    method: 'post',
    data: params
  })
}
export function DeleteFieldInfo(params) {
  return request({
    url: '/field/deletes?array='+params,
    method: 'post'
  })
}
//字段类型
export function findByParentId() {
  return request({
    url: '/diction/findAllByParentId?parentId=0',
    method: 'get'
  })
}
//流程模型

export function InitModelList(params) {
  return request({
    url: '/act_model/modelList',
    method: 'get',
    params: params
  })
}
export function AddModelInfo(params) {
  return request({
    url: '/act_model/createModel',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:params
  })
}
//部署
export function DeployModelInfo(model_id,type_id) {
  return request({
    url: '/act_model/deploy?model_id='+model_id+'&type_id='+type_id,
    method: 'post',
  })
}
//部署列表
export function InitDeployList(params) {
  return request({
    url: '/act_model/processList',
    method: 'get',
    params: params
  })
}
//部署详情
export function GetDeployInfo(params) {
  return request({
    url: '/act_model/deployImg?deploy_id='+params,
    method: 'get',
  })
}
//流程管理
export function InitFlowList(params) {
  return request({
    url: '/act_flow_mag/list',
    method: 'get',
    params: params
  })
}

export function AddFlowInfo(params) {
  return request({
    url: '/act_flow_mag/add',
    method: 'post',
    data: params

  })
}
export function GetFlowInfo(params) {
  return request({
    url: '/act_flow_mag/edit?m_id='+params,
    method: 'get',
  })
}
export function EditFlowInfo(params) {
  return request({
    url: '/act_flow_mag/edit',
    method: 'post',
    data: params

  })
}
//根据类型获取表单下拉
export function FindByID(params) {
  return request({
    url: '/form/findByT_Id?type_id='+params,
    method: 'get',
  })
}
//根据类型获取部署下拉
export function FindByDeployID() {
  return request({
    url: '/act_model/deployListByTypeId',
    method: 'get',
  })
}
//获取权限信息
export function GetFlowRoleInfo() {
  return request({
    url: '/act_flow_mag/add',
    method: 'get',
  })
}
