import request from '@/utils/request'

/**
 * 获取具体错误信息
 */
export const getErrDetail = (id: number) => {
  return request.get<{exception: string}>('api/logs/error/' + id)
}

/**
 * 清除所有error日志
 */
export const delAllError = () => {
  return request.delete('api/logs/del/error')
}

/**
 * 清除所有info日志
 */
export const delAllInfo = () => {
  return request.delete('api/logs/del/info')
}
