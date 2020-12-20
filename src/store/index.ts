import Vue from 'vue'
import Vuex from 'vuex'
import { ApiState } from './modules/api'
import { AppState } from './modules/app'
import { PermissonState } from './modules/permission'
import { SettingsState } from './modules/settings'
import { TagsViewState } from './modules/tagsView'
import { UserState } from './modules/user'

Vue.use(Vuex)

export interface RootState {
  user: UserState
  app: AppState
  tagsView: TagsViewState
  api: ApiState
  permission: PermissonState
  settings: SettingsState
}

export default new Vuex.Store<RootState>({})
