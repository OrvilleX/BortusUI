import router from './routers'
import { UserModule } from '@/store/modules/user'
import { PermissionModule, filterAsyncRouter } from '@/store/modules/permission'
import Config from '@/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { buildMenus } from '@/api/system/menu'

import { Route } from 'vue-router'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

export const loadMenus = (next: any, to: Route) => {
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRouter(res.data)
    asyncRouter.push({
      path: '*',
      redirect: '/404',
      meta: {
        hidden: true
      }
    })
    PermissionModule.GenerateRoutes(asyncRouter)
    router.addRoutes(asyncRouter)
    next({ ...to, replace: true })
  })
}

router.beforeEach(async (to: Route, _: Route, next: any) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()

  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (UserModule.roles.length === 0) {
        try {
          await UserModule.GetInfo()
          loadMenus(next, to)
        } catch (err) {
          await UserModule.LogOut()
          location.reload()
        }
      } else if (UserModule.loadMenus) {
        await UserModule.UpdateLoadMenus()
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
