var tokenPc = localStorage.getItem('tokenPc')
var token = localStorage.getItem('loginToken')
// console.log(tokenPc);
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
export function newsList(){
  return request({
    url: '/person/news/list',
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
}


//我的会议详情列表 
export function MylistMemories(params){
  return request({
    url: '/person/meeting/list',
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: params
  })
}
//会议详情 /person/meeting/details
export function MylistMemoriesList(params){
  console.log(params);
  return request({
    url: '/person/meeting/details?uId='+params,
    method: 'get',
  })
}
// 待参加会议列表/person/meeting/wait_list
export function ToAttendMeeting(){
  return request({
    url: '/person/meeting/wait_list',
    method: 'get',
  })
}
// 公告列表 /person/notice/list
export function AnnounceList(){
  return request({
    url: '/person/notice/list',
    method: 'get',
  })
}
// 我汇报的 /person/report/myReport
export function myReport(){
  return request({
    url: '/person/report/myReport',
    method: 'get',
  })
}
//我发起的匿名信 /person/letter/myLetter
export function myLetter(){
  return request({
    url: '/person/letter/myLetter',
    method: 'get',
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
export function defaultReport(){
  return request({
    url: '/person/report/defaultReport',
    method: 'get',
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
export function myReportDraft(){
  return request({
    url: '/person/report/myReportDraft',
    method: 'get',
  })
}
//给我的汇报 /person/report/reportMe
export function reportMe(){
  return request({
    url: '/person/report/reportMe',
    method: 'get',
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