import request from '@/utils/request'
/*我已审批和带我审批*/
export function myApproveLine(params) {
  return request({
    url: '/report_approve_Form/myApproveLine?checkDate='+params,
    method: 'get'
  })
}
export function myApprovePie(params) {
  return request({
    url: '/report_approve_Form/myApproveCake?checkDate='+params,
    method: 'get'
  })
}
export function yearApproveLine(params) {
  return request({
    url: '/approves_report_form/approvesLine?checkDate='+params,
    method: 'get'
  })
}
export function yearApprovePie(params) {
  return request({
    url: '/approves_report_form/approvesCake?checkDate='+params,
    method: 'get'
  })
}
//报表平台

export function reportForm() {
  return request({
    url: '/reportFormList/list',
    method: 'get'
  })
}
