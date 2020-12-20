import request from '@/utils/request'
import { DeptData, DeptDtoData, DeptQueryData } from '@/types/dept'
import { PageableBody } from '@/types/base'

/**
 * 查询部门
 */
export const getDepts = (params: DeptQueryData) => {
  return request.get<PageableBody<DeptDtoData>>('api/dept', { params })
}

/**
 * 获取同级或上级部门
 */
export const getDeptSuperior = (ids: number[]) => {
  return request.post<DeptDtoData[]>('api/dept/superior', ids)
}

/**
 * 新增部门
 */
export const add = (data: DeptData) => {
  return request.post('api/dept', data)
}

/**
 * 删除部门
 */
export const del = (ids: number[]) => {
  return request.delete('api/dept', { data: ids })
}

/**
 * 编辑部门
 */
export const edit = (data: DeptData) => {
  return request.put('api/dept', data)
}

export default { add, edit, del, getDepts, getDeptSuperior }
