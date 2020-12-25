import request from '@/utils/request'
import { PageableBody } from '@/types/base'
import { JobData, JobDtoData } from '@/types/job'

/**
 * 获取所有岗位
 */
export const getAllJob = () => {
  const params = {
    page: 0,
    size: 9999,
    enabled: true
  }
  return request.get<PageableBody<JobDtoData>>('api/job', { params })
}

/**
 * 添加岗位
 */
export const add = (data: JobData) => {
  return request.post('api/job', data)
}

/**
 * 删除岗位
 */
export const del = (ids: number[]) => {
  return request.delete('api/job', { data: ids })
}

/**
 * 编辑岗位
 */
export const edit = (data: JobData) => {
  return request.put('api/job', data)
}

export default { add, edit, del }
