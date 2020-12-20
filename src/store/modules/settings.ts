import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
const { tagsView, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber } = defaultSettings

export interface SettingsState {
  theme: string
  showSettings: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
  uniqueOpened: boolean
  showFooter: boolean
  footerTxt: string
  caseNumber: string
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements SettingsState {
  theme = variables.theme
  showSettings = false
  tagsView = tagsView
  fixedHeader = fixedHeader
  sidebarLogo = sidebarLogo
  uniqueOpened = uniqueOpened
  showFooter = showFooter
  footerTxt = footerTxt
  caseNumber = caseNumber

  @Mutation
  private CHANGE_SETTING(payload: { key: string, value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
    }
  }

  @Action
  public ChangeSetting(payload: { key: string, value: any}) {
    this.CHANGE_SETTING(payload)
  }
}

export const SettingsModule = getModule(Settings)
