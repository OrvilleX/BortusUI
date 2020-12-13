import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule, DeviceType } from '@/store/modules/app'

const WIDTH = 992

@Component({
  name: 'ResizeHandler'
})
export default class extends Vue {
  get device() {
    return AppModule.device
  }

  get sidebar() {
    return AppModule.sidebar
  }

  @Watch('$route')
  private onRouteChange() {
    if (this.device === DeviceType.Mobile && this.sidebar.opened) {
      AppModule.closeSideBar(false)
    }
  }

  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  mounted() {
    const isMobile = this.isMobile()
    if (isMobile) {
      AppModule.toggleDevice(DeviceType.Mobile)
      AppModule.closeSideBar(true)
    }
  }

  private isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  private resizeHandler() {
    if (!document.hidden) {
      const isMobile = this.isMobile()
      AppModule.toggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
      if (isMobile) {
        AppModule.closeSideBar(true)
      }
    }
  }
}
