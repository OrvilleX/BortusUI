<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script lang="ts">
import screenfull from 'screenfull'
import { Component, Vue } from 'vue-property-decorator'

const sf = screenfull

@Component({
  name: 'Screenfull'
})
export default class extends Vue {
  private isFullscreen = false;

  mounted() {
    this.init()
  }

  beforeDestroy() {
    this.destroy()
  }

  private click() {
    if (!sf.isEnabled) {
      this.$message({
        message: 'you browser can not work',
        type: 'warning'
      })
      return false
    }
    sf.toggle()
  }

  private change() {
    if (sf.isEnabled) {
      this.isFullscreen = sf.isFullscreen
    }
  }

  private init() {
    if (sf.isEnabled) {
      sf.on('change', this.change)
    }
  }

  private destroy() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.change)
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
