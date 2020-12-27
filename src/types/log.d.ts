import { Pageable } from './base'

export interface LogErrorDTOData {
    id: number
    username: string
    description: string
    method: string
    params: string
    browser: string
    requestIp: string
    address: string
    createTime: string
}

export interface LogQueryData extends Pageable {
    blurry?: string
    logType?: string
    createTime?: string
}

export interface LogSmallDTOData {
    description: string
    requestIp: string
    time: number
    address: string
    browser: string
    createTime: string
}

export interface LogData {
    id?: number
    username?: string
    description?: string
    method?: string
    params?: string
    logType?: string
    requestIp?: string
    address?: string
    browser?: string
    time?: number
    exceptionDetail?: string
    createTime?: string
}
