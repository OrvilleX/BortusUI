import request from '@/utils/request'
import { MenuData, MenuQueryData, MenuDtoData, MenuVoData } from '@/types/menu'
import { PageableBody } from '@/types/base'

/**
 * 获取所有菜单数据
 */
export const getMenusTree = (pid?: number) => {
  return request.get<MenuDtoData[]>('api/menus/lazy?pid' + pid)
}

/**
 * 查询菜单
 */
export const getMenus = (params: MenuQueryData) => {
  return request.get<PageableBody<MenuDtoData>>('api/menus', { params })
}

/**
 * 查询同级与上级菜单
 */
export const getMenuSuperior = (ids: number[]) => {
  return request.post<MenuDtoData[]>('api/menus/superior', ids)
}

/**
 * 构建菜单
 */
export const buildMenus = () => {
  return request.get<MenuVoData[]>('api/menus/build')
}

/**
 * 添加菜单
 */
export const add = (data: MenuData) => {
  return request.post('api/menus', data)
}

/**
 * 删除菜单
 */
export const del = (ids: number[]) => {
  return request.delete('api/menus', { data: ids })
}

/**
 * 编辑菜单
 */
export const edit = (data: MenuData) => {
  return request.put('api/menus', data)
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus }
