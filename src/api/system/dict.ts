import request from '@/utils/request'
import { DictData, DictDtoData } from '@/types/dict'

/**
 * 获取所有字典
 */
export const getDicts = () => {
  return request.get<DictDtoData[]>('api/dict/all')
}

/**
 * 添加字典
 */
export const add = (data: DictData) => {
  return request.post('api/dict', data)
}

/**
 * 删除字典
 */
export const del = (ids: number[]) => {
  return request.delete('api/dict/', { data: ids })
}

/**
 * 编辑字典
 */
export const edit = (data: DictData) => {
  return request.put('api/dict', data)
}

export default { add, edit, del }
