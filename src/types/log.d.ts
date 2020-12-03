import { login } from '@/api/login';
import { IPageable } from './base';

export interface ILogErrorDTOData {
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

export interface ILogQueryData extends IPageable {
    blurry: string
    logType: string
    createTime: string[]
}

export interface ILogSmallDTOData {
    description: string
    requestIp: string
    time: number
    address: string
    browser: string
    createTime: string
}

export interface ILogData {
    id: number
    username: string
    description: string
    method: string
    params: string
    logType: string
    requestIp: string
    address: string
    browser: string
    time: number
    exceptionDetail: string
    createTime: string
}