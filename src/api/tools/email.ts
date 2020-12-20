import request from "@/utils/request";
import { IEmailConfigData, IEmailVoData } from "@/types/email";

/**
 * 获取邮箱配置
 */
export const get = () => {
    return request.get<IEmailConfigData>("api/email");
}

/**
 * 配置邮箱
 */
export const update = (data: IEmailConfigData) => {
    return request.put("api/email", data);
}

/**
 * 发送邮件
 */
export const send = (data: IEmailVoData) => {
    return request.post("api/email", data);
}