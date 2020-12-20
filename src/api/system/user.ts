import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'
import { UserData, UserPassData } from '@/types/user'

/**
 * 新增用户
 */
export const add = (data: UserData) => {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 */
export const del = (ids: number[]) => {
  return request({
    url: '/api/users',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑用户
 */
export const edit = (data: UserData) => {
  return request({
    url: '/api/users',
    method: 'put',
    data
  })
}

/**
 * 个人中心修改用户
 */
export const editUser = (data: UserData) => {
  return request({
    url: '/api/users/center',
    method: 'put',
    data
  })
}

/**
 * 修改密码
 */
export const updatePass = (user: UserPassData) => {
  user.oldPass = encrypt(user.oldPass)
  user.newPass = encrypt(user.newPass)
  return request({
    url: '/api/users/updatePass/',
    method: 'post',
    data: user
  })
}

/**
 * 修改邮箱
 */
export const updateEmail = (form: {pass: string, email: string, code: string}) => {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: '/api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export default { add, edit, del }
