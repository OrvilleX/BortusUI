import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';

const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API

export interface IApiState {
  socketApi: string
  imagesUploadApi: string
  updateAvatarApi: string
  qiNiuUploadApi: string
  sqlApi: string
  swaggerApi: string
  fileUploadApi: string
  baseApi: string
}

@Module({ dynamic: true, store, name: 'api' })
export class Api extends VuexModule implements IApiState {
  public socketApi = baseUrl + '/websocket?token=kl'
  public imagesUploadApi = baseUrl + '/api/localStorage/pictures'
  public updateAvatarApi = baseUrl + '/api/users/updateAvatar'
  public qiNiuUploadApi = baseUrl + '/api/qiNiuContent'
  public sqlApi = baseUrl + '/druid/index.html'
  public swaggerApi = baseUrl + '/swagger-ui.html'
  public fileUploadApi = baseUrl + '/api/localStorage'
  public baseApi = baseUrl!
}

export const ApiModule = getModule(Api)
