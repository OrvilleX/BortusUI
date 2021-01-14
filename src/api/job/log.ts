import request from '@/utils/request'
import { JobLogData, LogResultData } from '@/types/jobLog'

export const del = (ids: number[]) => {
  return request.delete('scheduler/log', { data: ids })
}

export const get = (id: number) => {
  return request.get<JobLogData>('scheduler/log/' + id)
}

export const getFromExecutor = (executorAddress?: string, triggerTime?: string, logId?: number) => {
  return request.get<LogResultData>(`scheduler/log/executor?executorAddress=${executorAddress}&triggerTime=${triggerTime}&logId=${logId}`)
}

export default { del, get, getFromExecutor }
