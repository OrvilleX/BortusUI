import { IDictDetailData, IDictDetailDtoData } from "./dictDetail";

export interface IDictSmallDtoData {
    id: number
}

export interface IDictData {
    id: string
    dictDetails: IDictDetailData[]
    name: string
    description: string
}

export interface IDictQueryData {
    blurry: string
}

export interface IDictDtoData {
    id: number
    dictDetails: IDictDetailDtoData
    name: string
    description: string
}