import { IPageable } from './base';
import { IDictSmallDtoData } from './dict';

/**
 * 查询字典详情
 */
export interface IDictDetailQueryData extends IPageable {
    label?: string
    dictName?: string
}

/**
 * 新增、编辑字典详情
 */
export interface IDictDetailData {
    id: number
    dict: object
    label: string
    value: string
    dictSort: number
}

/**
 * 字典明细输出
 */
export interface IDictDetailDtoData {
    id: number
    dict: IDictSmallDtoData
    label: string
    value: string
    dictSort: number
}