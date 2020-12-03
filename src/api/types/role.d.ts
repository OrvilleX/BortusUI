import { Form } from 'element-ui';
import { IPageable } from './base';
import { IUserData } from './user';
import { IDeptData } from './dept'

/**
 * 导出、查询角色数据包
 */
export interface IRoleQueryData extends IPageable {
    blurry?: string
    createTime?: number[]
}

/**
 * 新增、修改角色数据包
 */
export interface IRoleData {
    id?: number
    users?: IUserData[]
    menus?: object[]
    depts?: IDeptData[]
    name?: string
    dataScope?: string
    level?: number
    description?: string
}

/**
 * 角色输出数据包
 */
export interface IRoleDtoData {
    id?: number
    menus?: object[]
    depts?: object[]
    name?: string
    dataScope?: string
    level?: number
    description?: string
}

/**
 * 角色精简数据包
 */
export interface IRoleSmallDtoData {
    id?: number
    name?: string
    level?: number
    dataScope?: string
}