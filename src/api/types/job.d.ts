import { IPageable } from './base'

/**
 * 岗位导出、列表查询数据包
 */
export interface IJobQueryData extends IPageable {
    name?: string
    enabled?: boolean
    createTime?: string[]
}

/**
 * 新增、编辑岗位
 */
export interface IJobData {
    id?: number
    name?: string
    jobSort?: number
    enabled?: boolean
}