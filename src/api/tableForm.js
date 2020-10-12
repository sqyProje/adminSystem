import qs from 'qs'
import request from '@/utils/request'
/*工作流管理*/
export function InitList(params) {
  return request({
    url: '/tableForm/list',
    method: 'get',
    params: params
  })
}
export function AddInfo(params) {
  return request({
    url: '/tableForm/add',
    method: 'post',
    data: params
  })
}
export function GetInfo(params) {
  return request({
    url: '/tableForm/edit?uId='+params,
    method: 'get',
  })
}
export function EditInfo(params) {
  return request({
    url: '/tableForm/edit',
    method: 'post',
    data: params
  })
}
export function DeleteInfo(params) {
  return request({
    url: '/tableForm/deletes?array='+params,
    method: 'post',
  })
}
//字段管理

export function InitFieldList(params) {
  return request({
    url: '/tableField/list?',
    method: 'get',
    params: params
  })
}
export function AddFieldInfo(params) {
  return request({
    url: '/tableField/add',
    method: 'post',
    data: params
  })
}
export function GetFieldInfo(params) {
  return request({
    url: '/tableField/edit?uId='+params,
    method: 'get',
  })
}
export function EditFieldInfo(params) {
  return request({
    url: '/tableField/edit',
    method: 'post',
    data: params
  })
}
export function DeleteFieldInfo(params) {
  return request({
    url: '/tableField/deletes?array='+params,
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
//表单流程
export function FlowByID(params) {
  return request({
    url: '/qdFlow/edit?tableFormId='+params,
    method: 'get',
  })
}

export function EditQDFlowInfo(params) {
  return request({
    url: '/qdFlow/edit',
    method: 'post',
    data: params

  })
}
//流程节点管理
export function InitFlowNodeList(params) {
  return request({
    url: '/qdFlowNode/list',
    method: 'get',
    params: params
  })
}

export function AddFlowNodeInfo(params) {
  return request({
    url: '/qdFlowNode/add',
    method: 'post',
    data: params

  })
}
export function GetFlowNodeInfo(params) {
  return request({
    url: '/qdFlowNode/edit?uId='+params,
    method: 'get',
  })
}
export function EditFlowNodeInfo(params) {
  return request({
    url: '/qdFlowNode/edit',
    method: 'post',
    data: params

  })
}
export function DeleteFlowNodeInfo(params) {
  return request({
    url: '/qdFlowNode/deletes?array='+params,
    method: 'post'
  })
}
//流程连线管理
export function InitFlowLineList(params) {
  return request({
    url: '/qdFlowLine/list',
    method: 'get',
    params: params
  })
}

export function AddFlowLineInfo(params) {
  return request({
    url: '/qdFlowLine/add',
    method: 'post',
    data: params

  })
}
export function GetFlowLineInfo(params) {
  return request({
    url: '/qdFlowLine/edit?uId='+params,
    method: 'get',
  })
}
export function EditFlowLineInfo(params) {
  return request({
    url: '/qdFlowLine/edit',
    method: 'post',
    data: params
  })
}
export function DeleteFlowLineInfo(params) {
  return request({
    url: '/qdFlowLine/deletes?array='+params,
    method: 'post'
  })
}
//条件下拉选择器
export function FlowElseDrop(params) {
  return request({
    url: '/tableField/IfElseDrop?tableFormId='+params,
    method: 'get',
  })
}
//节点下拉
export function FlowNodeDrop(params) {
  return request({
    url: '/qdFlowNode/drop?qdFlowId='+params,
    method: 'get',
  })
}
//全部节点
export function FlowNodeLine(params) {
  return request({
    url: '/qdFlowNode/listAll?qdFlowId='+params,
    method: 'get',
  })
}
//全部线
export function FlowLineAll(params) {
  return request({
    url: '/qdFlowLine/listAll?qdFlowId='+params,
    method: 'get',
  })
}

export function GetFlowUserDrop(params) {
  return request({
    url: '/tableForm/userTree',
    method: 'get',
  })
}
