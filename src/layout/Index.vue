<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
    <Theme v-show="false" ref="theme" />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { DeviceType, AppModule } from "@/store/modules/app";
import { SettingsModule } from "@/store/modules/settings";
import RightPanel from "@/components/RightPanel/Index.vue";
import {
  AppMain,
  Navbar,
  Settings,
  Sidebar,
  TagsView,
} from "./components/Index";
import ResizeMixin from "./mixin/ResizeHandler";
import Theme from "@/components/ThemePicker/Index.vue";
import Cookies from "js-cookie";

@Component({
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Theme,
  },
})
export default class extends mixins(ResizeMixin) {
  get showSettings() {
    return SettingsModule.showSettings;
  }

  get needTagsView() {
    return SettingsModule.tagsView;
  }

  get fixedHeader() {
    return SettingsModule.fixedHeader;
  }

  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile,
    };
  }

  mounted() {
    let theme = Cookies.get("theme");
    if (theme) {
      (this.$refs.theme as Theme).theme = theme;
      SettingsModule.ChangeSetting({
        key: "theme",
        value: theme,
      });
    }
  }

  private handleClickOutside() {
    AppModule.closeSideBar(false);
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  padding: 0;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
