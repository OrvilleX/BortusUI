import {IUserDtoData} from "./user";

export interface IJwtUserDtoData {
    id: number
    username: string
    nickName: string
    gender: string
    phone: string
    roles: string[]
    //user: IUserDtoData
    dataScopee: number[]
}