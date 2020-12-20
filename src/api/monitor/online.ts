import request from "@/utils/request";

/**
 * 踢出用户
 */
export const del = (keys: string[]) => {
    return request.delete("auth/online", {data: keys});
}