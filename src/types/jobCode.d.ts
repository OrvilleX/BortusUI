import { JobInfoData } from './jobInfo'

export interface JobLogGlueDtoData {
    jobInfo?: JobInfoData
    jobLogGlues?: JobLogGlueData[]
}

export interface JobLogGlueData {
    id?: number
    jobId?: number
    glueType?: string
    glueSource?: string
    glueRemark?: string
}
