<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="$store.state.settings.uniqueOpened"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import Logo from "./SidebarLogo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/assets/styles/variables.scss";
import { AppModule } from "@/store/modules/app";
import { PermissionModule } from "@/store/modules/permission";
import { SettingsModule } from "@/store/modules/settings";

@Component({ components: { SidebarItem, Logo } })
export default class extends Vue {
  get permission_routers() {
    return PermissionModule.routers;
  }

  get sidebar() {
    return AppModule.sidebar;
  }

  get activeMenu() {
    const route = this.$route;
    const { meta, path } = route;
    if (meta.activeMenu) {
      return meta.activeMenu;
    }
    return path;
  }

  get showLogo() {
    return SettingsModule.sidebarLogo;
  }

  get variables() {
    return variables;
  }

  get isCollapse() {
    return !this.sidebar.opened;
  }
}
</script>
