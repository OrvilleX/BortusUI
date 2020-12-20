import { Pageable } from './base'

/**
 * 岗位导出、列表查询数据包
 */
export interface JobQueryData extends Pageable {
    name?: string
    enabled?: boolean
    createTime?: string[]
}

/**
 * 新增、编辑岗位
 */
export interface JobData {
    id?: number
    name?: string
    jobSort?: number
    enabled?: boolean
    createTime?: string
}
