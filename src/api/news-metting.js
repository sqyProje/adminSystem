import request from '@/utils/request'
/*新闻管理*/
export function NewsList(params) {
  return request({
    url: '/newsMsg/list',
    method: 'get',
    params: params
  })
}
export function NewsAdd(params) {
  return request({
    url: '/newsMsg/add',
    method: 'post',
    data: params
  })
}
export function GetNews(params) {
  return request({
    url: '/newsMsg/edit?uId='+params,
    method: 'get',
  })
}
export function EditNews(params) {
  return request({
    url: '/newsMsg/edit',
    method: 'post',
    data: params
  })
}
export function DeleteNews(params) {
  return request({
    url: '/newsMsg/deletes?array='+params,
    method: 'post'
  })
}
export function StateNews(params) {
  return request({
    url: '/newsMsg/toState?array='+params,
    method: 'post'
  })
}
/*公告管理*/
export function NoticeList(params) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: params
  })
}
export function NoticeAdd(params) {
  return request({
    url: '/notice/add',
    method: 'post',
    data: params
  })
}
export function GetNotice(params) {
  return request({
    url: '/notice/edit?uId='+params,
    method: 'get',
  })
}
export function EditNotice(params) {
  return request({
    url: '/notice/edit',
    method: 'post',
    data: params
  })
}
export function DeleteNotice(params) {
  return request({
    url: '/notice/deletes?array='+params,
    method: 'post'
  })
}
export function StateNotice(params) {
  return request({
    url: '/notice/toState?array='+params,
    method: 'post'
  })
}
/*会议室管理*/
export function RoomList(params) {
  return request({
    url: '/meetingRoom/list',
    method: 'get',
    params: params
  })
}
export function RoomAdd(params) {
  return request({
    url: '/meetingRoom/add',
    method: 'post',
    data: params
  })
}
export function GetRoom(params) {
  return request({
    url: '/meetingRoom/edit?uId='+params,
    method: 'get',
  })
}
export function EditRoom(params) {
  return request({
    url: '/meetingRoom/edit',
    method: 'post',
    data: params
  })
}
export function DeleteRoom(params) {
  return request({
    url: '/meetingRoom/deletes?array='+params,
    method: 'post'
  })
}

export function GetRoomDrop() {
  return request({
    url: '/meetingRoom/drop',
    method: 'get',
  })
}
/*会议管理*/
export function MeetList(params) {
  return request({
    url: '/meeting/list',
    method: 'get',
    params: params
  })
}
export function MeetAdd(params) {
  return request({
    url: '/meeting/add',
    method: 'post',
    data: params
  })
}
export function GetMeet(params) {
  return request({
    url: '/meeting/edit?uId='+params,
    method: 'get',
  })
}
export function CheckMeet(params) {
  return request({
    url: '/meeting/check?uId='+params,
    method: 'get',
  })
}

export function EditMeet(params) {
  return request({
    url: '/meeting/edit',
    method: 'post',
    data: params
  })
}
export function DeleteMeet(params) {
  return request({
    url: '/meeting/deletes?array='+params,
    method: 'post'
  })
}

export function GetMeetDrop(params) {
  return request({
    url: '/meeting_user/getUsersById?meetingId='+params,
    method: 'get',
  })
}
/*轮播图管理*/
export function BannerList(params) {
  return request({
    url: '/carousel/list',
    method: 'get',
    params: params
  })
}
export function BannerAdd(params) {
  return request({
    url: '/carousel/add',
    method: 'post',
    data: params
  })
}
export function GetBanner(params) {
  return request({
    url: '/carousel/edit?uId='+params,
    method: 'get',
  })
}
export function EditBanner(params) {
  return request({
    url: '/carousel/edit',
    method: 'post',
    data: params
  })
}
export function DeleteBanner(params) {
  return request({
    url: '/carousel/deletes?array='+params,
    method: 'post'
  })
}
/*报表平台分类*/
export function ReportList(params) {
  return request({
    url: '/reportType/list',
    method: 'get',
    params: params
  })
}
export function ReportAdd(params) {
  return request({
    url: '/reportType/add',
    method: 'post',
    data: params
  })
}
export function GetReport(params) {
  return request({
    url: '/reportType/edit?uId='+params,
    method: 'get',
  })
}
export function EditReport(params) {
  return request({
    url: '/reportType/edit',
    method: 'post',
    data: params
  })
}
export function DeleteReport(params) {
  return request({
    url: '/reportType/deletes?array='+params,
    method: 'post'
  })
}
