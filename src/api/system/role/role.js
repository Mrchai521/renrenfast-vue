import httpRequest from '@/utils/httpRequest'

// 查询角色列表
export function getRoleList(query) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/role/list`),
    method: 'get',
    params: httpRequest.adornParams({
      'page': query.pageNum,
      'limit': query.pageSize,
      'roleName': query.roleName,
      'roleKey': query.roleKey,
      'status': query.status,
      'startTime': query.startTime,
      'endTime': query.endTime
    })
  })
}

export function getRoleListNoQuery() {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/role/list`),
    method: 'get',
    params: httpRequest.adornParams()
  })
}

// 查询角色详情
export function getRoleInfo(roleId) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/role/info/${roleId}`),
    method: 'get',
    params: httpRequest.adornParams()
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return httpRequest({
    url: httpRequest.adornUrl('/system/dept/treeselect'),
    method: 'get',
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/dept/roleDeptTreeselect/${roleId}`),
    method: 'get',
  })
}

// 修改角色状态
export function changeRoleStatus(data) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/role/changeRoleStatus`),
    method: 'post',
    data: httpRequest.adornData(data, false)
    //  params: httpRequest.adornParams({
    //    'roleId': data.roleId,
    //    'status': data.status
    //  })
  })
}

// 修改部门
export function updateDept(data) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/dept`),
    method: 'put',
    data: httpRequest.adornData(data, false)
  })
}

// 批量删除角色
export function delRoles(ids) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/role/delete`),
    method: 'post',
    data: httpRequest.adornData(ids, false)
  })
}
