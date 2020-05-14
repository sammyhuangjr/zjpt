import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

Vue.use(Router)
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    // redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '智建云授权系统',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '智建云授权系统', icon: 'dashboard' }
    }]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   // redirect: '/example/table',
  //   // name: 'Example',
  //   // meta: { title: '代理商授权管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '代理商授权管理', icon: 'table' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: '支持平台列表', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: '设备授权管理',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: '设备授权管理' },
  //     }
  //   ]
  // },

  // {
  //   path: '/sys',
  //   component: Layout,
  //   redirect: '/sys/user',
  //   name: '系统管理',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'systemSet'
  //   },
  //   children: [
  //     {
  //       path: 'user',
  //       component: () => import('@/views/sys/user/index'), 
  //       name: 'user',
  //       meta: { title: '用户管理' },
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/sys/role/index'), 
  //       name: 'role',
  //       meta: { title: '角色管理' },
  //     },
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/sys/menu/index'), 
  //       name: 'menu',
  //       meta: { title: '菜单管理' },
  //     }
  //   ]
  // },


  // // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
