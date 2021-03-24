import httpRequest from '@/utils/httpRequest'

// 查询菜单列表
export function getMenuList(query) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/menu/list`),
    method: 'get',
    params: httpRequest.adornParams()
  })
}
