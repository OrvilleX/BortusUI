import { constantRoutes } from '@/router/routers'
import Layout from '@/layout/Index.vue'
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import store from '@/store';

export interface IPermissonState {
  routers: RouteConfig[]
  addRouters: RouteConfig[]
}

@Module({ dynamic: true, store, name: "permission"})
export default class Permission extends VuexModule implements IPermissonState {
  public routers: RouteConfig[] = []
  public addRouters: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routers = constantRoutes.concat(routes)
    this.addRouters = routes
  }

  @Action
  public GenerateRoutes(roles: RouteConfig[]) {
    this.SET_ROUTES(roles)
  }
}

export const filterAsyncRouter = (routers: RouteConfig[]) => {
  return routers.filter(router => {
    if ("component" in router)
    {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
  }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
}

export const loadView = (view: any) => {
  return (resolve: (...modules: any[]) => void) => require([`@/views/${view}`], resolve)
}

export const PermissionModule = getModule(Permission)