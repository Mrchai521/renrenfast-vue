// import request from '@/utils/request'
import httpRequest from '@/utils/httpRequest'
// 查询字典数据列表
export function listData(query) {
  return httpRequest({
    url: httpRequest.adornUrl('/system/data/listByPage'),
    method: 'get',
    // data: httpRequest.adornData(query, false)
    params: httpRequest.adornParams({
      'page': query.pageNum,
      'limit': query.pageSize,
      'dictLabel': query.dictLabel,
      'dictType': query.dictType,
      'status': query.status
    })
  })
}

// 通过dictType查询字典数据列表
export function findData(dictType) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/data/getListByDictType/${dictType}`),
    method: 'get',
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/data/type/${dictCode}`),
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return httpRequest({
    url: httpRequest.adornUrl('/system/data'),
    method: 'post',
    data: httpRequest.adornData(data, false)
  })
}

// 修改字典数据
export function updateData(data) {
  return httpRequest({
    url: httpRequest.adornUrl('/system/data'),
    method: 'put',
    data: httpRequest.adornData(data, false)
  })
}

// 删除字典数据
export function delData(dictCode) {
  return httpRequest({
    url: httpRequest.adornUrl(`/system/data/${dictCode}`),
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return httpRequest({
    url: httpRequest.adornUrl('/system/data/export'),
    method: 'get',
    data: httpRequest.adornData(query, false)
  })
}
