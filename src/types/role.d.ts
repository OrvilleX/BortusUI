import { Form } from 'element-ui';
import { IPageable } from './base';
import { IUserData } from './user';
import { IDeptData, IDeptDtoData } from './dept';
import { IMenuData, IMenuDtoData } from "./menu";

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
    menus?: IMenuData[]
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
    menus?: IMenuDtoData[]
    depts?: IDeptDtoData[]
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