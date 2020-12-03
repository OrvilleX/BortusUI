import request from '@/utils/request';
import { IOnlineUserDtoData, IOnlineUserQueryData } from '@/types/online';

/**
 * 踢出用户
 */
export const del = (keys: string[]) => {
    return request.delete("auth/online", {data: keys});
}