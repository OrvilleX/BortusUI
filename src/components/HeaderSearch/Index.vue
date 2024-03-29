<template>
  <div :class="{'show': show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.meta.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script lang="ts">
import Fuse from 'fuse.js'
import path from 'path'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'HeaderSearch'
})
export default class extends Vue {
  private search = ''
  private options: RouteConfig[] = []
  private searchPool: RouteConfig[] = []
  private show = false
  private fuse?: Fuse<RouteConfig>

  get routes() {
    return PermissionModule.routers
  }

  @Watch('routes')
  private onRoutesChange() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  @Watch('searchPool')
  private onSearchPoolChange(value: RouteConfig[]) {
    this.initFuse(value)
  }

  @Watch('show')
  private onShowChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.close)
    } else {
      document.body.removeEventListener('click', this.close)
    }
  }

  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  private click() {
    this.show = !this.show
    if (this.show) {
      this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).focus()
    }
  }

  private close() {
    this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).blur()
    this.options = []
    this.show = false
  }

  private change(val: RouteConfig) {
    if (this.ishttp(val.path)) {
      window.open(val.path, '_blank')
    } else {
      this.$router.push(val.path)
    }
    this.search = ''
    this.options = []
    this.$nextTick(() => {
      this.show = false
    })
  }

  private initFuse(list: RouteConfig[]) {
    this.fuse = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
      keys: [{
        name: 'title',
        weight: 0.7
      }, {
        name: 'path',
        weight: 0.3
      }]
    })
  }

  private generateRoutes(routes: RouteConfig[], basePath = '/', prefixTitle = []) {
    let res: RouteConfig[] = []

    for (const router of routes) {
      if (router.meta && router.meta.hidden) { continue }

      const data: RouteConfig = {
        path: !this.ishttp(router.path) ? path.resolve(basePath, router.path) : router.path,
        meta: {
          title: [...prefixTitle]
        }
      }

      if (router.meta && router.meta.title) {
        if (data.meta) {
          data.meta.title = [...data.meta.title, router.meta.title]
        }

        if (router.redirect !== 'noRedirect') {
          res.push(data)
        }
      }

      if (router.children) {
        const tempRoutes = this.generateRoutes(router.children, data.path, data.meta?.title)
        if (tempRoutes.length >= 1) {
          res = [...res, ...tempRoutes]
        }
      }
    }
    return res
  }

  private querySearch(query: string) {
    if (query !== '') {
      if (this.fuse) {
        this.options = this.fuse.search(query).map(result => result.item)
      }
    } else {
      this.options = []
    }
  }

  ishttp(url: string) {
    return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

   ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
