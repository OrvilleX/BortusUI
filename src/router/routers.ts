import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Layout from '../layout/Index.vue'

Vue.use(VueRouter);

export const constantRoutes: Array<RouteConfig> = [
  {
    path: "/login",
    meta: { title: "登录", noCache: true, hidden: true },
    component: () => import('@/views/Login.vue')
  },
  {
    path: "/404",
    meta: { hidden: true },
    component: () => import('@/views/features/404.vue')
  },
  {
    path: "/401",
    meta: { hidden: true },
    component: () => import('@/views/features/401.vue')
  },
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path',
        component: () => import('@/views/features/Redirect.vue')
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Home.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/Center.vue'),
        meta: { title: '个人中心' }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: constantRoutes
});

export default router;
