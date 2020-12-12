import request from '@/utils/request'
import qs from 'qs'

export const initData = (url: string, params: any) => {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export const download = (url: string, params: any) => {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
