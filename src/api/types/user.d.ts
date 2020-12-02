import { Form } from "element-ui";
import { IDeptData } from "./dept"

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
export interface IUserQueryData {
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