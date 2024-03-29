<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noredirect' || index === levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { compile } from 'path-to-regexp'
import { RouteRecord, Route } from 'vue-router'

@Component({ name: 'Breadcrumb' })
export default class extends Vue {
  levelList: RouteRecord[] = [];

  public created() {
    this.getBreadcrumb()
  }

  @Watch('$route')
  onRouteChanged(route: Route) {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    this.getBreadcrumb()
  }

  private getBreadcrumb() {
    let matched = this.$route.matched.filter(
      (item) => item.meta && item.meta.title
    )
    const first = matched[0]
    if (!this.isDashboard(first)) {
      matched = [
        { path: '/dashboard', meta: { title: '首页' } } as any
      ].concat(matched)
    }
    this.levelList = matched.filter(
      (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
    )
  }

  private isDashboard(route: RouteRecord) {
    const name = route && route.name
    if (!name) {
      return false
    }
    return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
  }

  private pathCompile(path: string) {
    const { params } = this.$route
    const toPath = compile(path)
    return toPath(params)
  }

  private handleLink(item: any) {
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect)
      return
    }
    this.$router.push(this.pathCompile(path))
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
