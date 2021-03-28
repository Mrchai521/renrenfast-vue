import httpRequest from '@/utils/httpRequest'

// 查询个人中心详情
export function getUserProfile() {
  return httpRequest({
    url: httpRequest.adornUrl(`/profile/profileInfo`),
    method: 'get'
  })
}

// 修改密码
export function updateUserPwd(password, newPassword) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/user/password`),
    method: 'post',
    data: httpRequest.adornData({
      'password': password,
      'newPassword': newPassword
    })
    // data: httpRequest.adornData(data, false)
  })
}

// 修改个人信息
export function updateUserProfile(data) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/user/password`),
    method: 'post',
    data: httpRequest.adornData(data, false)
  })
}

//修改头像
export function uploadAvatar(data) {
  return httpRequest({
    url: httpRequest.adornUrl(`/sys/user/password`),
    method: 'post',
    data: httpRequest.adornData(data, false)
  })
}
