import { Component, Prop, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component
export default class extends Vue {
  get device() {
    return AppModule.device
  }

  mounted() {
    this.fixBugIniOS()
  }

  fixBugIniOS() {
    const $subMenu = this.$refs.subMenu as any
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave
      $subMenu.handleMouseleave = (e: any) => {
        if (this.device === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }
}
