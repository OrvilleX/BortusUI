import { IRoleData } from './role'
import { IPageable } from './base'

/**
 * 查询、导出部门数据包
 */
export interface IDeptQueryData extends IPageable {
    name?: string
    enabled?: boolean
    pid?: number
    pidIsNull?: number
    createTime?: string[]
}

/**
 * 新增、修改部门数据包
 */
export interface IDeptData {
    id?: number
    roles?: IRoleData[]
    deptSort?: number
    name?: string
    enabled?: boolean
    pid?: number
    subCount?: number
    createTime?: string
}

export interface IDeptDtoData {
    id: number
    name: string
    enabled: boolean
    deptSort: number
    children: IDeptDtoData[]
    pid: number
    subCount: number
    createTime: string
}

export interface IDeptSmallDtoData {
    id: number
    name: string
}