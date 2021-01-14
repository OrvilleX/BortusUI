import request from '@/utils/request'
import { JobInfoData, JobInfoQueryData } from '@/types/jobInfo'
import { PageableBody } from '@/types/base'

export const getAll = (params: JobInfoQueryData) => {
  return request.get<PageableBody<JobInfoData>>('scheduler/info', { params })
}

/**
 * 添加任务
 */
export const add = (data: JobInfoData) => {
  return request.post('scheduler/info', data)
}

/**
 * 删除任务
 */
export const del = (ids: number[]) => {
  return request.delete('scheduler/info', { data: ids })
}

/**
 * 编辑任务
 */
export const edit = (data: JobInfoData) => {
  return request.put('scheduler/info', data)
}

/**
 * 获取任务
 */
export const get = (id: number) => {
  return request.get<JobInfoData>('scheduler/info/' + id)
}

/**
 * 暂停任务
 */
export const pause = (id: number) => {
  return request.put('scheduler/info/pause/' + id)
}

/**
 * 开始任务
 */
export const start = (id: number) => {
  return request.put('scheduler/info/start/' + id)
}

/**
 * 触发任务
 */
export const trigger = (id: number, executorParam: string, addressList: string) => {
  return request.put(`scheduler/info/trigger?=id${id}&executorParam=${executorParam}&addressList=${addressList}`)
}

/**
 * 获取表达式下一次任务执行时间
 */
export const nextTriggerTime = (cron: string) => {
  return request.get<string[]>('scheduler/info/nextTriggerTime?cron=' + cron)
}

/**
 * 根据执行器获取任务
 */
export const getJobsByGroup = (group: number) => {
  return request.get<JobInfoData[]>('scheduler/info/group/' + group)
}

export default { getAll, add, del, edit, get, pause, start, trigger, nextTriggerTime, getJobsByGroup }
