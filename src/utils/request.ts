import axios from 'axios'
import router from '@/router/routers'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken } from './auth'
import Config from '@/settings'
import Cookies from 'js-cookie'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/',
  timeout: Config.timeout
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers.Authorization = getToken()
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error(response.data.message)
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  (error) => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '错误',
          message: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (code) {
      if (code === 401) {
        store.dispatch('LogOut').then(() => {
          Cookies.set('point', '401')
          location.reload()
        })
      } else if (code === 403) {
        router.push({ path: '/401' })
      } else {
        const errorMsg: string = error.response.data.message
        if (errorMsg) {
          Notification.error({
            title: '错误',
            message: errorMsg,
            duration: 5000
          })
        }
      }
    }
    return Promise.reject(error)
  }
)

export default service
