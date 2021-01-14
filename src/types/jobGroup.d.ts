import { Pageable } from './base'

export interface JobGroupQueryData extends Pageable {
    appName?: string
    title?: string
}

export interface JobGroupData {
    id?: number
    appName?: string
    title?: string
    addressType?: number
    addressList?: string
    registryList?: string[]
    createTime?: string
}