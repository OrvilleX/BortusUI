import Vue from "vue";
import Vuex from "vuex";
import { IApiState } from "./modules/api";
import { IAppState } from "./modules/app";
import { IPermissonState } from "./modules/permission";
import { ISettingsState } from "./modules/settings";
import { ITagsViewState } from "./modules/tagsView";
import { IUserState } from './modules/user';

Vue.use(Vuex);

export interface IRootState {
  user: IUserState
  app: IAppState
  tagsView: ITagsViewState
  api: IApiState
  permission: IPermissonState
  settings: ISettingsState
}

export default new Vuex.Store<IRootState>({});
