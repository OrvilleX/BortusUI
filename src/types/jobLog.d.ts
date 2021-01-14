import { Pageable } from './base'

export interface JobLogQueryData extends Pageable {
    jobGroup?: number
    jobId?: number
    triggerTime?: string[]
    logStatus?: number
}

export interface JobLogData {
    id?: number
    jobGroup?: number
    jobId?: number
    executorAddress?: string
    executorHandler?: string
    executorParam?: string
    executorShardingParam?: string
    executorFailRetryCount?: number
    triggerTime?: string
    triggerCode?: number
    triggerMsg?: string
    handleTime?: string
    handleCode?: number
    handleMsg?: string
    alarmStatus?: number
}

export interface LogResultData {
    fromLineNum: number
    toLineNum: number
    logContent: string
    isEnd: boolean
}
