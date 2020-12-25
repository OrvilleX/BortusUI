import { DeptData, DeptDtoData } from './dept'
import { JobData } from './job'
import { Pageable } from './base'
import { RoleData, RoleSmallDtoData } from './role'

/**
 * 新增、修改用户数据包
 */
export interface UserData {
    id?: number
    roles?: RoleData[]
    jobs?: JobData[]
    dept?: DeptData
    username?: string
    nickName?: string
    email?: string
    phone?: string
    gender?: string
    avatarName?: string
    avatarPath?: string
    enabled?: boolean
    isAdmin?: boolean
}

/**
 * 导出、查询用户数据包
 */
export interface UserQueryData extends Pageable {
    id?: number
    deptIds?: number[]
    blurry?: string
    enabled?: boolean
    deptId?: number
    createTime?: string[]
}

/**
 * 修改用户密码数据包
 */
export interface UserPassData {
    oldPass: string
    newPass: string
}

/**
 * 列表、详情输出数据包
 */
export interface UserDtoData {
    id?: number
    createBy?: string
    updatedBy?: string
    updateTime?: string
    createTime?: string
    roles?: RoleSmallDtoData[]
    jobs?: JobData[]
    dept?: DeptDtoData
    deptId?: number
    username?: string
    nickName?: string
    email?: string
    phone?: string
    gender?: string
    avatarName?: string
    avatarPath?: string
    enabled?: boolean
    pwdResetTime?: string
}
