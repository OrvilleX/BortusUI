import request from '@/utils/request'
import { PageableBody } from '@/types/base'
import { JobGroupData, JobGroupQueryData } from '@/types/jobGroup'

export const getAll = (params: JobGroupQueryData) => {
    return request.get<PageableBody<JobGroupData>>('scheduler/group', { params })
}

/**
 * 新增执行器
 */
export const add = (data: JobGroupData) => {
    return request.post('scheduler/group', data)
}

/**
 * 删除执行器
 */
export const del = (ids: number[]) => {
    return request.delete('scheduler/group', { data: ids })
}

/**
 * 编辑执行器
 */
export const edit = (data: JobGroupData) => {
    return request.put('scheduler/group', data)
}

/**
 * 获取执行器
 */
export const get = (id: number) => {
    return request.get<JobGroupData>('scheduler/group/' + id)
}

export default { add, edit, del, get, getAll }