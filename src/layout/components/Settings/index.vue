<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">系统布局设置</h3>

      <div class="drawer-item">
        <span>主题颜色</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>显示标签</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定头部</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示LOGO</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>菜单UniqueOpened</span>
        <el-switch v-model="uniqueOpened" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import ThemePicker from '@/components/ThemePicker/Index.vue'

@Component({ name: 'Settings', components: { ThemePicker } })
export default class extends Vue {
  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  set fixedHeader(value) {
    SettingsModule.ChangeSetting({
      key: 'fixedHeader',
      value
    })
  }

  get tagsView() {
    return SettingsModule.tagsView
  }

  set tagsView(value) {
    SettingsModule.ChangeSetting({
      key: 'tagsView',
      value
    })
  }

  get sidebarLogo() {
    return SettingsModule.sidebarLogo
  }

  set sidebarLogo(value) {
    SettingsModule.ChangeSetting({
      key: 'sidebarLogo',
      value
    })
  }

  get uniqueOpened() {
    return SettingsModule.uniqueOpened
  }

  set uniqueOpened(value) {
    SettingsModule.ChangeSetting({
      key: 'uniqueOpened',
      value
    })
  }

  private themeChange(value: string) {
    SettingsModule.ChangeSetting({
      key: 'theme',
      value
    })
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
