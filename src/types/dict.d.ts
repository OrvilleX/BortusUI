import { IDictDetailData, IDictDetailDtoData } from "./dictDetail";
import { IPageable } from './base'

export interface IDictSmallDtoData {
    id: number
}

export interface IDictData {
    id?: number
    dictDetails?: IDictDetailData[]
    name?: string
    description?: string
}

export interface IDictQueryData extends IPageable {
    blurry?: string
}

export interface IDictDtoData {
    id: number
    dictDetails: IDictDetailDtoData
    name: string
    description: string
}