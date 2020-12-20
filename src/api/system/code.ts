import request from '@/utils/request'
import { UserPassData } from '@/types/user'

/**
 * 重发校验码
 */
export const resetEmail = (email: string) => {
  return request.post('api/code/resetEmail?email=' + email)
}

/**
 * 重置密码
 */
export const updatePass = (pass: UserPassData) => {
  return request.get('api/users/updatePass' + pass)
}
