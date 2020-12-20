import request from "@/utils/request";
import { IQuartzJobData } from "@/types/timing";

/**
 * 新增调度任务
 */
export const add = (data: IQuartzJobData) => {
    return request.post("api/jobs", data);
}

/**
 * 删除调度任务
 */
export const del = (ids: number[]) => {
    return request.delete("api/jobs", {data: ids});
}

/**
 * 编辑调度任务
 */
export const edit = (data: IQuartzJobData) => {
    return request.put("api/jobs", data);
}

/**
 * 修改调度任务状态
 */
export const updateIsPause = (id: number) => {
    return request.put("api/jobs/" + id);
}

/**
 * 立即执行调度任务
 */
export const execution = (id: number) => {
    return request.put("api/jobs/exec/" + id);
}
  
export default { del, updateIsPause, execution, add, edit }