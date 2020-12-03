import { IPageable } from './base';

export interface IOnlineUserQueryData extends IPageable {
    filter: string
}

export interface IOnlineUserDtoData {
    userName: string
    nickName: string
    dept: string
    browser: string
    ip: string
    address: string
    key: string
    loginTime: string
}