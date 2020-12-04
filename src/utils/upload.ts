import axios from 'axios'
import { getToken } from '@/utils/auth'

export const upload = (api: string, file: Blob) => {
  var data = new FormData()
  data.append('file', file)
  const config = {
    headers: { 'Authorization': getToken() }
  }
  return axios.post(api, data, config)
}
