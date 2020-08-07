import request from '@/utils/request'
export function addressList(params){
  return request({
    url:'/addressBook/employees',
    type:'get',
    params:params
  })
}
export function addressCheckList(params){
  return request({
    url:'/addressBook/checkEmployees',
    type:'get',
    params:params
  })
}
export function letterBoxList(params){
  return request({
    url:'/letterBox/list',
    type:'get',
    params:params
  })
}

export function letterBoxCheck(params){
  return request({
    url:'/letterBox/check?uId='+params,
    type:'get',
  })
}
//工作汇报周期
export function ReportList(params) {
  return request({
    url: '/workReportCycle/list',
    method: 'get',
    params: params
  })
}
export function ReportAdd(params) {
  return request({
    url: '/workReportCycle/add',
    method: 'post',
    data: params
  })
}
export function GetReport(params) {
  return request({
    url: '/workReportCycle/edit?uId='+params,
    method: 'get',
  })
}
export function EditReport(params) {
  return request({
    url: '/workReportCycle/edit',
    method: 'post',
    data: params
  })
}
export function DeleteReport(params) {
  return request({
    url: '/workReportCycle/deletes?array='+params,
    method: 'post'
  })
}
//汇报人员树
//被汇报人员树
export function GetReportUser(params) {
  return request({
    url: '/workReportCycle/getSelectedReportUsers?uId='+params,
    method: 'get',
  })
}
export function GetToReportUser(params) {
  return request({
    url: '/workReportCycle/getSelectedToReportUsers?uId='+params,
    method: 'get',
  })
}
