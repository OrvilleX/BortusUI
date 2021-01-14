import request from '@/utils/request'
import { JobLogGlueDtoData, JobLogGlueData } from '@/types/jobCode'

export const get = (id: number) => {
    return request.get<JobLogGlueDtoData>('scheduler/code/' + id)
}

export const edit = (data: JobLogGlueData) => {
    return request.put('scheduler/code', data)
}

export default {get, edit}