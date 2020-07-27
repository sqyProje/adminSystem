import request from '@/utils/request'
import qs from 'qs'
/*部门管理*/

export function DepartList(params) {
  return request({
    url: '/depart/list',
    method: 'get',
    params: params
  })
}

export function AddDepart(params) {
  return request({
    url: '/depart/add',
    method: 'post',
    data: params
  })
}
export function GetDepart(params) {
  return request({
    url: '/depart/edit?p_Id='+params,
    method: 'get',
  })
}
export function EditDepart(params) {
  return request({
    url: '/depart/edit',
    method: 'post',
    data: params
  })
}
export function DeleteDepart(params) {
  return request({
    url: '/depart/deletes?array='+params,
    method: 'post'
  })
}
export function GetDepartInfoArray() {
  return request({
    url: '/depart/drop',
    method: 'get',
  })
}
//岗位管理
export function StationList(params) {
  return request({
    url: '/station/list',
    method: 'get',
    params: params
  })
}

export function AddStation(params) {
  return request({
    url: '/station/add',
    method: 'post',
    data: params
  })
}
export function GetStation(params) {
  return request({
    url: '/station/edit?uId='+params,
    method: 'get',
  })
}
export function EditStation(params) {
  return request({
    url: '/station/edit',
    method: 'post',
    data: params
  })
}
export function DeleteStation(params) {
  return request({
    url: '/station/deletes?array='+params,
    method: 'post'
  })
}
//岗位下拉框
export function GetStationDrop(params) {
  return request({
    url: '/station/drop',
    method: 'get',
  })
}
//职务管理
export function DutyList(params) {
  return request({
    url: '/duty/list',
    method: 'get',
    params: params
  })
}

export function AddDuty(params) {
  return request({
    url: '/duty/add',
    method: 'post',
    data: params
  })
}
export function GetDuty(params) {
  return request({
    url: '/duty/edit?uId='+params,
    method: 'get',
  })
}
export function EditDuty(params) {
  return request({
    url: '/duty/edit',
    method: 'post',
    data: params
  })
}
export function DeleteDuty(params) {
  return request({
    url: '/duty/deletes?array='+params,
    method: 'post'
  })
}
export function GetDutyInfoArray() {
  return request({
    url: '/duty/tree',
    method: 'get',
  })
}
//人员管理
export function EmployeeList(params) {
  return request({
    url: '/employee/list',
    method: 'get',
    params: params
  })
}

export function AddEmployee(params) {
  return request({
    url: '/employee/add',
    method: 'post',
    data: params
  })
}
export function GetEmployee(params) {
  return request({
    url: '/employee/edit?uId='+params,
    method: 'get',
  })
}
export function EditEmployee(params) {
  return request({
    url: '/employee/edit',
    method: 'post',
    data: params
  })
}
export function DeleteEmployee(params) {
  return request({
    url: '/employee/deletes?array='+params,
    method: 'post'
  })
}
//岗位调动
export function StationMoveList(params) {
  return request({
    url: '/stationMove/list',
    method: 'get',
    params: params
  })
}
export function DeleteStationMove(params) {
  return request({
    url: '/stationMove/deletes?array='+params,
    method: 'post'
  })
}
//员工详情
export function GetEmployeeInfo(params) {
  return request({
    url: '/employeeInfo/edit?e_id='+params,
    method: 'get',
  })
}
export function EditEmployeeInfo(params) {
  return request({
    url: '/employeeInfo/edit',
    method: 'post',
    data: params
  })
}
export function GetIdCardInfo(params) {
  return request({
    url: '/IdCard/edit?e_id='+params,
    method: 'get',
  })
}
export function EditIdCardInfo(params) {
  return request({
    url: '/IdCard/edit',
    method: 'post',
    data: params
  })
}
//教育背景
export function EduList(params) {
  return request({
    url: '/education/listByEid?e_id='+params,
    method: 'get',
  })
}

export function AddEdu(params) {
  return request({
    url: '/education/add',
    method: 'post',
    data: params
  })
}
export function GetEdu(params) {
  return request({
    url: '/education/edit?uId='+params,
    method: 'get',
  })
}
export function EditEdu(params) {
  return request({
    url: '/education/edit',
    method: 'post',
    data: params
  })
}
export function DeleteEdu(params) {
  return request({
    url: '/education/deletes?array='+params,
    method: 'post'
  })
}
//家庭成员
export function FamilyList(params) {
  return request({
    url: '/family/listByEid?e_id='+params,
    method: 'get',
  })
}

export function AddFamily(params) {
  return request({
    url: '/family/add',
    method: 'post',
    data: params
  })
}
export function GetFamily(params) {
  return request({
    url: '/family/edit?uId='+params,
    method: 'get',
  })
}
export function EditFamily(params) {
  return request({
    url: '/family/edit',
    method: 'post',
    data: params
  })
}
export function DeleteFamily(params) {
  return request({
    url: '/family/deletes?array='+params,
    method: 'post'
  })
}
//工作履历
export function JobList(params) {
  return request({
    url: '/jobRecord/listByEid?e_id='+params,
    method: 'get',
  })
}

export function AddJob(params) {
  return request({
    url: '/jobRecord/add',
    method: 'post',
    data: params
  })
}
export function GetJob(params) {
  return request({
    url: '/jobRecord/edit?uId='+params,
    method: 'get',
  })
}
export function EditJob(params) {
  return request({
    url: '/jobRecord/edit',
    method: 'post',
    data: params
  })
}
export function DeleteJob(params) {
  return request({
    url: '/jobRecord/deletes?array='+params,
    method: 'post'
  })
}
//证书证件
export function CredentialList(params) {
  return request({
    url: '/credential/listByEid?e_id='+params,
    method: 'get',
  })
}

export function AddCredential(params) {
  return request({
    url: '/credential/add',
    method: 'post',
    data: params
  })
}
export function GetCredential(params) {
  return request({
    url: '/credential/edit?uId='+params,
    method: 'get',
  })
}
export function EditCredential(params) {
  return request({
    url: '/credential/edit',
    method: 'post',
    data: params
  })
}
export function DeleteCredential(params) {
  return request({
    url: '/credential/deletes?array='+params,
    method: 'post'
  })
}
//员工合同
export function GetContractInfo(params) {
  return request({
    url: '/contract/edit?e_id='+params,
    method: 'get',
  })
}
export function EditContractInfo(params) {
  return request({
    url: '/contract/edit',
    method: 'post',
    data: params
  })
}
export function ContractPathInfo(params) {
  return request({
    url: '/file/getFileContractPath',
    method: 'post',
    headers:{
      'Content-type': 'multipart/form-data'
    },
    data: params
  })
}
//薪资管理
export function SalaryList(params) {
  return request({
    url: '/salary/list',
    method: 'get',
    params: params
  })
}
export function ExportModel() {
  return request({
    url: '/salary/exportModel',
    method: 'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    responseType: 'blob',
  })
}
/*{
      payDate:params.payData,
      name:params.name,
      sketch:params.sketch,
      file:params.file
    }*/
export function ExcelImport(params) {
  return request({
    url: '/salary/excelImport',
    method: 'post',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data:params
  })
}
export function PayName() {
  return request({
    url: '/payName/drop',
    method: 'get',
  })
}
//导出工资报表
export function ExportDatas(params) {
  return request({
    url:'/salary/exportDatas',
    method:'get',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:params,
    responseType: 'blob',
  })
}
