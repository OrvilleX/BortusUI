import request from '@/utils/request'
import { DictDetailData, DictDetailQueryData, DictDetailDtoData } from '@/types/dictDetail'

export interface DictMap {
    [index: string]: DictDetailDtoData[]
}

/**
 * 查询字典明细
 */
export const get = (params: DictDetailQueryData) => {
  params.page = 0
  params.size = 9999
  return request.get<DictDetailDtoData[]>('api/dictDetail', { params })
}

/**
 * 获取字典明细映射
 */
export const getDictMap = (dictName: string) => {
  const params = {
    dictName
  }
  return request.get<DictMap>('api/dictDetail/map', { params })
}

/**
 * 添加字典明细
 */
export const add = (data: DictDetailData) => {
  return request.post('api/dictDetail', data)
}

/**
 * 删除字典明细
 */
export const del = (ids: number | number[]) => {
  return request.delete('api/dictDetail' + ids)
}

/**
 * 编辑字典明细
 */
export const edit = (data: DictDetailData) => {
  return request.put('api/dictDetail', data)
}

export default { add, edit, del }
