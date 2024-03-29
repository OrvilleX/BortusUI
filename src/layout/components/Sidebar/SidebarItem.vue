<template>
  <div v-if="!item.meta.hidden" class="menu-wrapper">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown': !isNest}"
        >
        <svg-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"/>
        <span slot='title'>{{onlyOneChild.meta.title}}</span>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <svg-icon v-if="item.meta" :icon-class="item.meta && item.meta.icon" />
        <span v-if="item.meta" slot='title'>{{item.meta.title}}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'
import FixiOSBug from './fixiOSBug'
import { mixins } from 'vue-class-component'
import { RouteConfig } from 'vue-router'

@Component({
  name: 'SidebarItem',
  components: {
    AppLink
  }
})
export default class extends mixins(FixiOSBug) {
  @Prop({ required: true }) item!: RouteConfig;
  @Prop({ default: false }) isNest!: boolean;
  @Prop({ default: '' }) basePath!: string;

  onlyOneChild?: RouteConfig;

  hasOneShowingChild(children: RouteConfig[] = [], parent: RouteConfig) {
    const showingChildren = children.filter((item) => {
      if (item.meta?.hidden) {
        return false
      } else {
        this.onlyOneChild = item
        return true
      }
    })

    if (showingChildren.length === 1) {
      return true
    }

    if (showingChildren.length === 0) {
      this.onlyOneChild = {
        ...parent,
        path: ''
      }
      if (this.onlyOneChild.meta) {
        this.onlyOneChild.meta.noShowingChildren = true
      }
      return true
    }
    return false
  }

  resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }
}
</script>
