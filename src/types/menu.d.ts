import { Pageable } from './base'

/**
 * 导出、查询菜单数据包
 */
export interface MenuQueryData extends Pageable {
    blurry?: string
    createTime?: string[]
    pidIsNull?: boolean
    pid?: number
}

/**
 * 新增、编辑菜单数据包
 */
export interface MenuData {
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
export interface MenuDtoData {
    id?: number
    createTime?: string
    updateTime?: string
    createBy?: string
    updatedBy?: string
    hasChildren?: boolean
    alwaysShow?: boolean
    redirect?: string
    name?: string
    children?: MenuDtoData[]
    meta?: any
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
export interface MenuVoData {
    name: string
    path: string
    hidden: boolean
    redirect: string
    component: string
    alwaysShow: boolean
    meta: MenuMetaVoData
    children: MenuVoData[]
}

export interface MenuMetaVoData {
    title: string
    icon: string
    noCache: boolean
}
