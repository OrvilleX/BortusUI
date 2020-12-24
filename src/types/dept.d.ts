import { RoleData } from './role'
import { Pageable } from './base'

/**
 * 查询、导出部门数据包
 */
export interface DeptQueryData extends Pageable {
    name?: string
    enabled?: boolean
    pid?: number
    pidIsNull?: number
    createTime?: string[]
}

/**
 * 新增、修改部门数据包
 */
export interface DeptData {
    id?: number
    roles?: RoleData[]
    deptSort?: number
    name?: string
    enabled?: boolean
    pid?: number
    subCount?: number
    createTime?: string
    isTop?: string
}

export interface DeptDtoData {
    id?: number
    name?: string
    enabled?: boolean
    deptSort?: number
    children?: DeptDtoData[]
    pid?: number
    subCount?: number
    createTime?: string
    hasChildren?: boolean
}

export interface DeptSmallDtoData {
    id: number
    name: string
}
