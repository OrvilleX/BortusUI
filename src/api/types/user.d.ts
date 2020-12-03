import { IDeptData } from "./dept";
import { IJobData } from './job';
import { IPageable } from './base';
import { IRoleSmallDtoData } from './role';

/**
 * 新增、修改用户数据包
 */
export interface IUserData {
    id?: number
    roles?: string[]
    jobs?: string[]
    dept?: IDeptData
    username?: string
    nickname?: string
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
export interface IUserQueryData extends IPageable {
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
export interface IUserPassData {
    oldPass: string
    newPass: string
}

/**
 * 列表、详情输出数据包
 */
export interface IUserDtoData {
    id: number
    roles: IRoleSmallDtoData[]
    jobs: IJobData[]
    dept: object
    deptId: number
    username: string
    nickName: string
    email: string
    phone: string
    gender: string
    avatarName: string
    avatarPath: string
    enabled: boolean
    pwdResetTime: string
}