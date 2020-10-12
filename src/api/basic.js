import request from '@/utils/request'
/*字典管理*/
export function InitList(params) {
  return request({
    url: '/diction/list',
    method: 'get',
    params: params
  })
}
export function AddInfo(params) {
  return request({
    url: '/diction/add',
    method: 'post',
    data: params
  })
}
export function GetInfo(params) {
  return request({
    url: '/diction/edit?d_Id='+params,
    method: 'get',
  })
}
export function EditInfo(params) {
  return request({
    url: '/diction/edit',
    method: 'post',
    data: params
  })
}
export function DeleteInfo(params) {
  return request({
    url: '/diction/deletes?array='+params,
    method: 'post'
  })
}
//diction type parentId
export function dictionType(params) {
  return request({
    url: '/diction/findAllByParentId?parentId='+params,
    method: 'get',
  })
}
//枚举方法
export function enumeration(urlInfo) {
  return request({
    url: urlInfo,
    method: 'get',
  })
}
//删除文件
export function DeleteFileUrl(filePath) {
  return request({
    url: '/file/deleteFile?filePath='+filePath,
    method: 'post',
  })
}
//文件excel下载
export function importExcel(res) {
  const content = res.data;
  const disposition =decodeURI(res.headers['content-disposition'].split('=')[1]);
  let url = window.URL.createObjectURL(new Blob([content]));
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", disposition);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link)
}
/*操作日志*/
export function LogList(params) {
  return request({
    url: '/operation/list',
    method: 'get',
    params: params
  })
}

export function GetLog(params) {
  return request({
    url: '/operation/details?uId='+params,
    method: 'get',
  })
}
/*版本控制*/

export function VersionList(params) {
  return request({
    url: '/appVersion/list',
    method: 'get',
    params: params
  })
}

export function GetVersion(params) {
  return request({
    url: '/appVersion/edit?uId='+params,
    method: 'get',
  })
}
export function EditVersion(params) {
  return request({
    url: '/appVersion/edit',
    method: 'post',
    data: params
  })
}
