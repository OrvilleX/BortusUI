import request from "@/utils/request";
import { IDeptData, IDeptDtoData, IDeptQueryData } from "@/types/dept";
import { IPageableBody } from "@/types/base";

/**
 * 查询部门
 */
export const getDepts = (params: IDeptQueryData) => {
    return request.get<IPageableBody<IDeptDtoData>>("api/dept", {params});
}

/**
 * 获取同级或上级部门
 */
export const getDeptSuperior = (ids: number[]) => {
    return request.post<IDeptDtoData[]>("api/dept/superior", ids);
}

/**
 * 新增部门
 */
export const add = (data: IDeptData) => {
    return request.post("api/dept", data);
}

/**
 * 删除部门
 */
export const del = (ids: number[]) => {
    return request.delete("api/dept", {data: ids});
}

/**
 * 编辑部门
 */
export const edit = (data: IDeptData) => {
    return request.put("api/dept", data);
}
  
export default { add, edit, del, getDepts, getDeptSuperior }