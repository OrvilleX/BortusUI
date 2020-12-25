import { Pageable } from './base'
import { DictSmallDtoData, DictData } from './dict'

/**
 * 查询字典详情
 */
export interface DictDetailQueryData extends Pageable {
    label?: string
    dictName?: string
}

/**
 * 新增、编辑字典详情
 */
export interface DictDetailData {
    id?: number
    dict?: DictData
    label?: string
    value?: string
    dictSort?: number
}

/**
 * 字典明细输出
 */
export interface DictDetailDtoData {
    id?: number
    createTime?: string
    dict: DictSmallDtoData
    label?: string
    value?: string
    dictSort?: number
}
