import request from '@/utils/request'
import { EmailConfigData, EmailVoData } from '@/types/email'

/**
 * 获取邮箱配置
 */
export const get = () => {
  return request.get<EmailConfigData>('api/email')
}

/**
 * 配置邮箱
 */
export const update = (data: EmailConfigData) => {
  return request.put('api/email', data)
}

/**
 * 发送邮件
 */
export const send = (data: EmailVoData) => {
  return request.post('api/email', data)
}
