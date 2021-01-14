import { Pageable } from './base'

export interface JobInfoQueryData extends Pageable {
    jobGroup?: number
    triggerStatus?: number
    jobDesc?: string
    executorHandler?: string
    author?: string
}

export interface JobInfoData {
    id?: number
    jobGroup?: number
    jobCron?: string
    jobDesc?: string
    author?: string
    alarmEmail?: string
    executorRouteStrategy?: string
    executorHandler?: string
    executorParam?: string
    executorBlockStrategy?: string
    executorTimeout?: number
    executorFailRetryCount?: number
    glueType?: string
    glueSource?: string
    glueRemark?: string
    glueUpdatetime?: string
    childJobId?: string
    triggerStatus?: number
    triggerLastTime?: number
    triggerNextTime?: number
    createTime?: string
}
