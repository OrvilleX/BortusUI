import request from "@/utils/request";
import { IRoleData, IRoleDtoData } from "@/types/role";

/**
 * 获取所有角色
 */
export const getAll = () => {
    return request.get<IRoleDtoData[]>("api/roles/all");
}

/**
 * 添加角色
 */
export const add = (data: IRoleData) => {
    return request.post("api/roles", data);
}

/**
 * 获取单个角色
 */
export const get = (id: number) => {
    return request.get<IRoleDtoData>("api/roles/" + id);
}

/**
 * 获取用户级别
 */
export const getLevel = () => {
    return request.get<{level:number}>("api/roles/level");
}

/**
 * 删除角色
 */
export const del = (ids: number[]) => {
    return request.delete("api/roles", {data: ids});
}

/**
 * 编辑角色
 */
export const edit = (data: IRoleData) => {
    return request.put("api/roles", data);
}

/**
 * 编辑角色菜单
 */
export const editMenu = (data: IRoleData) => {
    return request.put("api/roles/menu", data);
}
  
export default { add, edit, del, get, editMenu, getLevel }