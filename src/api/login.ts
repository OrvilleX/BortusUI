import request from '@/utils/request'
import { JwtUserDtoData } from '../types/login'

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 */
export const login = (username: string, password: string, code: string, uuid: string) => {
  return request.post<{token: string, user: JwtUserDtoData}>(
    'auth/login',
    {
      username,
      password,
      code,
      uuid
    }
  )
}

/**
 * 获取当前登录用户信息
 */
export const getInfo = () => {
  return request.get<JwtUserDtoData>('auth/info')
}

/**
 * 获取验证码图片
 */
export const getCodeImg = () => {
  return request.get<{img: string, uuid: string}>('auth/code')
}

/**
 * 退出登录
 */
export const logout = () => {
  return request.delete('auth/logout')
}
