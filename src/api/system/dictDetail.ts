import request from '@/utils/request';
import { IDictDetailData, IDictDetailQueryData, IDictDetailDtoData } from '@/types/dictDetail';

interface DictMap {
    [index: string]: IDictDetailDtoData[]
}

/**
 * 查询字典明细
 */
export const get = (params: IDictDetailQueryData) => {
    params.page = 0;
    params.size = 9999;
    return request.get<IDictDetailDtoData[]>("api/dictDetail", {params});
}

/**
 * 获取字典明细映射
 */
export const getDictMap = (dictName: string) => {
    const params = {
      dictName
    }
    return request.get<DictMap>("api/dictDetail/map", {params});
}

/**
 * 添加字典明细
 */
export const add = (data: IDictDetailData) => {
    return request.post("api/dictDetail", data);
}

/**
 * 删除字典明细
 */
export const del = (id: string) => {
    return request.delete("api/dictDetail" + id);
}

/**
 * 编辑字典明细
 */
export const edit = (data: IDictDetailData) => {
    return request.put("api/dictDetail", data);
}

export default { add, edit, del }