import request from '@/utils/request'
/*审批管理*/
export function InitSubList() {
  return request({
    url: '/sub_approve/list',
    method: 'get'
  })
}

export function GetSubInfo(form_Id) {
  return request({
    url: '/sub_approve/getForm?tableFormId='+form_Id,
    method: 'get',
  })
}
//提交表单字段并生成审批外加审批人
export function AddFormInfo(params) {
  return request({
    url: '/sub_approve/postForm',
    method: 'post',
    data: params
  })
}
//下级审批人
export function GetApproveUser(params) {
  return request({
    url: '/sub_approve/getApproveUser',
    method: 'post',
    data: params
  })
}
//拒绝之后重复提交接口
export function subReloadApprove(params) {
  return request({
    url: '/sub_approve/rePostForm',
    method: 'post',
    data: params
  })
}
//我的审批
export function InitMyList(params) {
  return request({
    url: '/my_approve/list',
    method: 'get',
    params: params
  })
}
//查看
export function GetMyInfo(params) {
  return request({
    url: '/process_approve/re_check?approveId='+params,
    method: 'get'
  })
}
//审批过程
export function WorkFlow(params){
  return request({
    url: '/process_approve/workFlow?approveId='+params,
    method: 'get'
  })
}
//撤销
export function repeal(params) {
  return request({
    url: '/my_approve/repeal?uId='+params,
    method: 'post',
  })
}
///获取待我审批
export function InitWaitList(params) {
  return request({
    url: '/wait_approve/list',
    method: 'get',
    params: params
  })
}
//去审批
export function ToApprove(params) {
  return request({
    url: '/wait_approve/toApprove',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params: params
  })
}
//流程节点下级审批人
export function GetProcessUser(params) {
  return request({
    url: '/process_approve/getApproveUser?approveStepId='+params,
    method: 'post',
  })
}
//拿起任务
export function GetTask(params) {
  return request({
    url: '/wait_approve/getTask?approveStepId='+params,
    method: 'post',
  })
}
//释放任务
export function DisTask(params) {
  return request({
    url: '/wait_approve/disTask?approveStepId='+params,
    method: 'post',
  })
}
//挂起
export function HangUp(params) {
  return request({
    url: '/wait_approve/hangUp?approveStepId='+params,
    method: 'post',
  })
}
//去除挂起
export function DisHangUp (params) {
  return request({
    url: '/wait_approve/disHangUp?approveStepId='+params,
    method: 'post',
  })
}
//我已审批
export function InitCompleteList(params) {
  return request({
    url: '/complete_approve/list',
    method: 'get',
    params: params
  })
}
//抄送我的
export function InitCopyList(params) {
  return request({
    url: '/copy_approve/list',
    method: 'get',
    params: params
  })
}

//抄送我的
export function InitRelevanceList(params) {
  return request({
    url: '/relevance_approve/list',
    method: 'get',
    params: params
  })
}
//旧版审批相关接口
export function InitOldMyList(params) {
  return request({
    url: '/oldApprove/my_approves',
    method: 'get',
    params: params
  })
}
export function InitOldWaitList(params) {
  return request({
    url: '/oldApprove/wait_approves',
    method: 'get',
    params: params
  })
}
export function InitOldFinishList(params) {
  return request({
    url: '/oldApprove/finish_approves',
    method: 'get',
    params: params
  })
}

export function OldMyApproveDetails(params) {
  return request({
    url: '/oldSupApprove/super_myApprove_details',
    method: 'get',
    params: {
      approveId:params
    }
  })
}
export function OldWaitApproveDetails(params) {
  return request({
    url: '/oldSupApprove/super_waitapprove_details',
    method: 'get',
    params: {
      approveStepId:params
    }
  })
}

export function OldUser(params) {
  return request({
    url: '/oldApprove/usersByrole',
    method: 'get',
    params: {
      approveRoleId:params
    }
  })
}
export function OldApprove(params) {
  return request({
    url: '/oldSupApprove/super_waitapprove_post',
    method: 'post',
    params: {
      approvestepid:params.approvestepid,
      approve_startUserid:params.approve_startUserid,
      approvestatus:params.approvestatus,
      sketch:params.sketch,
    }
  })
}
/*批量打印*/
export function PrintAll(params) {
  return request({
    url: '/process_approve/check_flow',
    method: 'get',
    params: {
      approveId:params
    }
  })
}
