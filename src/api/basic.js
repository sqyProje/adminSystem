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
    url: '/diction/findByParentId?parentId='+params,
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
