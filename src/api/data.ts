import { PageableBody } from '@/types/base'
import request from '@/utils/request'
import { AxiosResponse } from 'axios'
import qs from 'qs'

export const initData = <K, T>(url: string, params: K): Promise<AxiosResponse<PageableBody<T>>> => {
  return request.get<PageableBody<T>>(url + '?' + qs.stringify(params, { indices: false }))
}

export const download = (url: string, params: any) => {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
