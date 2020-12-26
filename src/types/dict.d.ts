import { DictDetailData, DictDetailDtoData } from './dictDetail'
import { Pageable } from './base'

export interface DictSmallDtoData {
    id: number
}

export interface DictData {
    id?: number
    dictDetails?: DictDetailData[]
    name?: string
    description?: string
}

export interface DictQueryData extends Pageable {
    blurry?: string
}

export interface DictDtoData {
    id: number
    createTime?: string
    dictDetails: DictDetailDtoData[]
    name: string
    description: string
}
