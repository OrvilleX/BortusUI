import {IUserDtoData} from "./user";

export interface IJwtUserDtoData {
    username: string
    roles: string[]
    //user: IUserDtoData
    dataScopee: number[]
}