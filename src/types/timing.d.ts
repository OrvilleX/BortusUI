import { Pageable } from './base'

/**
 * 下载、查询调度任务与日志数据包
 */
export interface JobQueryData extends Pageable {
    jobName?: string
    isSuccess?: boolean
    createTime?: string[]
}

/**
 * 新增、编辑调度任务数据包
 */
export interface QuartzJobData {
    id?: number
    uuid?: string
    jobName?: string
    beanName?: string
    methodName?: string
    params?: string
    cronExpression?: string
    isPause?: boolean
    personInCharge?: string
    email?: string
    subTask?: string
    pauseAfterFailure?: boolean
    description?: string
}
