import { Pageable } from './base'
import { UserData } from './user'
import { DeptData, DeptDtoData } from './dept'
import { MenuData, MenuDtoData } from './menu'

/**
 * 导出、查询角色数据包
 */
export interface RoleQueryData extends Pageable {
    blurry?: string
    createTime?: number[]
}

/**
 * 新增、修改角色数据包
 */
export interface RoleData {
    id?: number
    users?: UserData[]
    menus?: MenuData[]
    depts?: DeptData[]
    name?: string
    dataScope?: string
    level?: number
    description?: string
}

/**
 * 角色输出数据包
 */
export interface RoleDtoData {
    id?: number
    menus?: MenuDtoData[]
    depts?: DeptDtoData[]
    name?: string
    dataScope?: string
    level?: number
    description?: string
}

/**
 * 角色精简数据包
 */
export interface RoleSmallDtoData {
    id?: number
    name?: string
    level?: number
    dataScope?: string
}
