<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noredirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import pathToRegexp from "path-to-regexp";
import { RawLocation, RedirectOption, Route } from "vue-router";

interface RouteInfo {
  name?: string;
  path: string;
  meta: any;
  redirect?: RedirectOption;
}

@Component
export default class Breadcrumb extends Vue {
  levelList: RouteInfo[] = [];

  public created() {
    this.getBreadcrumb();
  }

  @Watch("$route")
  onRouteChanged(route: Route) {
    if (route.path.startsWith("/redirect/")) {
      return;
    }
    this.getBreadcrumb();
  }

  @Emit()
  getBreadcrumb() {
    let matched = this.$route.matched.filter(
      (item) => item.meta && item.meta.title
    ) as RouteInfo[];
    const first = matched[0];

    if (!this.isDashboard(first)) {
      matched = [{ path: "/dashboard", meta: { title: "首页" } }].concat(
        matched
      );
    }
    this.levelList = matched.filter(
      (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
    );
  }

  @Emit()
  isDashboard(route: RouteInfo) {
    const name = route && route.name;
    if (!name) {
      return false;
    }
    return name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase();
  }

  @Emit()
  pathCompile(path: string) {
    const { params } = this.$route;
    var toPath = pathToRegexp.compile(path);
    return toPath(params);
  }

  @Emit()
  handleLink(item: RouteInfo) {
    const { redirect, path } = item;
    if (redirect) {
      this.$router.push(redirect as RawLocation);
      return;
    }
    this.$router.push(this.pathCompile(path));
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
