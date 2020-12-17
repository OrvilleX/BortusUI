import { IPageable } from './base';
import { IRoleData } from './role';

/**
 * 导出、查询菜单数据包
 */
export interface IMenuQueryData extends IPageable {
    blurry?: string
    createTime?: string[]
    pidIsNull?: boolean
    pid?: number
}

/**
 * 新增、编辑菜单数据包
 */
export interface IMenuData {
    id?: number
    title?: string
    componentName?: string
    menuSort?: number
    component?: string
    path?: string
    type?: number
    permission?: string
    icon?: string
    cache?: boolean
    hidden?: boolean
    pid?: number
    subCount?: number
    iFrame?: boolean
}

/**
 * 菜单输出数据包
 */
export interface IMenuDtoData {
    id: number
    children?: IMenuDtoData[]
    type?: number
    permission?: string
    title?: string
    menuSort?: number
    path?: string
    component?: string
    pid?: number
    subCount?: number
    iFrame?: boolean
    cache?: boolean
    hidden?: boolean
    componentName?: string
    icon?: string
    leaf?: boolean
    label?: string
}

/**
 * 用于组织菜单结构
 */
export interface IMenuVoData {
    name: string
    path: string
    hidden: boolean
    redirect: string
    component: string
    alwaysShow: boolean
    meta: IMenuMetaVoData
    children: IMenuVoData[]
}

export interface IMenuMetaVoData {
    title: string
    icon: string
    noCache: boolean
}