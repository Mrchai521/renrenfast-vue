// import request from '@/utils/request'
import httpRequest from '@/utils/httpRequest'
// 查询字典类型列表
export function listType(query) {
  return httpRequest({
    url: httpRequest.adornUrl("/system/type/listByPage"),
    method: "get",
    // data: httpRequest.adornData(query, false)
    params: httpRequest.adornParams({
      'page': query.pageNum,
      'limit': query.pageSize,
      'dictName': query.dictName,
      'dictType': query.dictType,
      'status': query.status
    })
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/type/${dictId}`),
    method: "get",
  })
}

// 新增字典类型
export function addType(data) {
  return httpRequest({
    url: httpRequest.adornUrl("/system/type"),
    method: "post",
    data: httpRequest.adornData(data, false)
  })
}

// 修改字典类型
export function updateType(data) {
  return httpRequest({
    url: httpRequest.adornUrl("/system/type"),
    method: "put",
    data: httpRequest.adornData(data, false)
  })
}

// 删除字典类型
export function delType(dictId) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/type/${dictId}`),
    method: "delete",
  })
}

// 导出字典类型
export function exportType(query) {
  return httpRequest({
    url: httpRequest.adornUrl("/system/type/export"),
    method: "get",
    data: httpRequest.adornData(query, false)
  })
}
