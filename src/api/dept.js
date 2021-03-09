// import request from '@/utils/request'
import httpRequest from '@/utils/httpRequest'

// 查询部门列表
export function listDept(query) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/dept/list`),
    method: 'get',
    // data: httpRequest.adornData(query, false)
    params: httpRequest.adornParams({
      'deptName': query.deptName,
      'status': query.status
    })
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/dept/list/exclude/${deptId}`),
    method: 'get',
  })
}

// 查询部门详细
export function getDept(deptId) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/dept/${deptId}`),
    method: 'get',
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

// 新增部门
export function addDept(data) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/dept`),
    method: 'post',
    data: httpRequest.adornData(data, false)
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

// 删除部门
export function delDept(deptId) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/dept/${deptId}`),
    method: 'delete',
  })
}
