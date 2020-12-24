import { UserDtoData } from './user'

export interface JwtUserDtoData {
    id: number
    user: UserDtoData
    roles: string[]
    dataScopee: number[]
}
