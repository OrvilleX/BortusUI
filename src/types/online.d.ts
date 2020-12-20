import { Pageable } from './base'

export interface OnlineUserQueryData extends Pageable {
    filter: string
}

export interface OnlineUserDtoData {
    userName: string
    nickName: string
    dept: string
    browser: string
    ip: string
    address: string
    key: string
    loginTime: string
}
