<template>
  <div v-if="!item.hidden" class="menu-wrapper">
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
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
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
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
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
import Item from './Item.vue'
import AppLink from './Link.vue'
import FixiOSBug from './fixiOSBug'
import { mixins } from 'vue-class-component'
import { RouteConfig } from 'vue-router'

@Component({
  name: 'SidebarItem',
  components: {
    Item,
    AppLink
  }
})
export default class extends mixins(FixiOSBug) {
  @Prop({ required: true }) item!: RouteConfig;
  @Prop({ default: false }) isNest!: boolean;
  @Prop({ default: '' }) basePath!: string;

  onlyOneChild?: RouteConfig;

  hasOneShowingChild(children: RouteConfig[], parent: RouteConfig) {
    const showingChildren = children.filter((item) => {
      if (item.meta.hidden) {
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
      this.onlyOneChild.meta.noShowingChildren = true

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
