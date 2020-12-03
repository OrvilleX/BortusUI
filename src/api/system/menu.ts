import request from '@/utils/request'
import { IMenuData, IMenuQueryData, IMenuDtoData, IMenuVoData } from '@/types/menu';
import { IPageableBody } from '@/types/base';

/**
 * 获取所有菜单数据
 */
export const getMenusTree = (pid: number) => {
    return request.get<IMenuDtoData[]>("api/menus/lazy?pid" + pid);
}

/**
 * 查询菜单
 */
export const getMenus = (params: IMenuQueryData) => {
    return request.get<IPageableBody<IMenuDtoData>>("api/menus", {params});
}

/**
 * 查询同级与上级菜单
 */
export const getMenuSuperior = (ids: number[]) => {
    return request.post<IMenuDtoData[]>("api/menus/superior", ids);
}

/**
 * 构建菜单
 */
export const buildMenus = () => {
    return request.get<IMenuVoData[]>("api/menus/build");
}

/**
 * 添加菜单
 */
export const add = (data: IMenuData) => {
    return request.post("api/menus", data);
}

/**
 * 删除菜单
 */
export const del = (ids: number[]) => {
    return request.delete("api/menus", {data: ids});
}

/**
 * 编辑菜单
 */
export const edit = (data: IMenuData) => {
    return request.put("api/menus", data);
}
  
export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus }