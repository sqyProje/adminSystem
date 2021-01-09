
var uidd = localStorage.getItem("uid")
import request from '@/utils/request'
import qs from 'qs'
import { json } from 'd3'
//轮播图 /person/carousel/list
export function slideshow(){
  return request({
    url: '/person/carousel/list',
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
}
//新闻分类 /person/news/type
export function newsType(){
  return request({
    url: '/person/news/type',
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
}
// 新闻列表 /person/news/list
export function newsList(params) {
  return request({
    url: '/person/news/list',
    method: 'get',
    params: params
  })
}
// 新闻详情 
export function newsdetails(params){
  return request({
    url: '/person/news/details?uId='+params,
    method: 'get',
    params: params
  })
}



//我的会议详情列表 
export function MylistMemories(params){
  return request({
    url: '/person/meeting/list',
    method: 'get',
    params: params
  })
}
//会议详情 /person/meeting/details
export function MylistMemoriesList(params){
  
  return request({
    url: '/person/meeting/details?uId='+params,
    method: 'get',
  })
}
// 待参加会议列表/person/meeting/wait_list
export function ToAttendMeeting(params){
  return request({
    url: '/person/meeting/wait_list',
    method: 'get',
    params: params
  })
}
// 公告列表 /person/notice/list
export function AnnounceList(params){
  return request({
    url: '/person/notice/list',
    method: 'get',
    params: params
  })
}
// 我汇报的 /person/report/myReport
export function myReport(params){
  return request({
    url: '/person/report/myReport',
    method: 'get',
    params: params
  })
}
//我发起的匿名信 /person/letter/myLetter
export function myLetter(params){
  return request({
    url: '/person/letter/myLetter',
    method: 'get',
    params: params
  })
}
// 写匿名信 /person/letter/toLetter 未使用
export function toLetter(param) {
  return request({
    url: '/person/letter/toLetter',
    method: 'POST',
    data:param
  })
}
//  /person/letter/details  匿名信详情
export function details(params){
  return request({
    url: '/person/letter/details?uId='+params,
    method: 'get',
    
  })
}
// 选择收件人 /person/report/getToReport
export function getToReport(){
  return request({
    url: '/person/report/getToReport',
    method: 'get',
  })
}
//  是否拖欠汇报 /person/report/defaultReport
export function defaultReport(params){
  return request({
    url: '/person/report/defaultReport',
    method: 'get',
    params: params
  })
}
// 去汇报 /person/report/addReport
export function addReport(param) {
  return request({
    url: '/person/report/addReport',
    method: 'POST',
    data:param
  })
}
// 我的草稿列表 /person/report/myReportDraft
export function myReportDraft(params){
  return request({
    url: '/person/report/myReportDraft',
    method: 'get',
    params: params
  })
}
//给我的汇报 /person/report/reportMe
export function reportMe(params){
  return request({
    url: '/person/report/reportMe',
    method: 'get',
    params: params
  })
}
// /person/report/editReport 获取编辑
export function editReport(params){
  return request({
    url: '/person/report/editReport?uId='+params,
    method: 'get',
  })
}
// /person/report/editReport  编辑汇报
export function editReports(param) {
  return request({
    url: '/person/report/editReport',
    method: 'POST',
    data:param
  })
}
// 详情列表  /person/report/details
export function detailsList(params){
  return request({
    url: '/person/report/details?uId='+params,
    method: 'get',
    params: params
  })
}
// 公告详情
export function noticedetails(params){
  return request({
    url: '/person/notice/details?uId='+params,
    method: 'get',
    params: params
  })
}
// 匿名信信池 /person/letter/letters
export function AnonymousLetterPool(params){
  return request({
    url: '/person/letter/letters',
    method: 'get',
    params: params
  })
}
//主持会议列表
export function HostList(params){
  return request({
    url: '/meeting_summary/list',
    method: 'get',
    params: params
  })
}
export function HostAdd(param) {
  return request({
    url: '/meeting_summary/summary',
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data:qs.stringify({
      uId:param.uId,
      summary:param.summary
    })
  })
}
export function HostRmAdd(param) {
  return request({
    url: '/meeting_summary/reSummary',
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data:qs.stringify({
      uId:param.uId,
      summary:param.summary
    })
  })
}
export function HostEdit(param) {
  return request({
    url: '/meeting_summary/details?uId='+param,
    method: 'get',
  })
}

