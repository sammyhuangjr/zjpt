import router from './router'
import store from './store'
import { Message } from 'element-ui'
import Vue from 'vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
const _import = require('./router/_import_' + process.env.NODE_ENV) //获取组件的方法
import Layout from '@/layout'
import { httpRquest } from '@/api/URL'
import { getURL } from './api/request-url'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })


//获取动态路由
var getRouters;   //储存动态的路由

var tempRouter = [
    {
        path: '/example',
        component: 'Layout',
        children: [
        {
            path: 'table',
            name: 'Table',
            component: 'table/index',
            meta: { title: '代理商授权管理', icon: 'table' }
        }
        ]
    },

    {
        path: '/form',
        component: 'Layout',
        children: [
        {
            path: 'index',
            name: 'Form',
            component: 'form/index',
            meta: { title: '支持平台列表', icon: 'form' }
        }
        ]
    },

    {
        path: '/nested',
        component: 'Layout',
        redirect: '/nested/menu1',
        name: 'Nested',
        meta: {
        title: '设备授权管理',
        icon: 'nested'
        },
        children: [
        {
            path: 'menu1',
            component: 'nested/index', // Parent router-view
            name: 'Menu1',
            meta: { title: '设备授权管理' },
        }
        ]
    },

    {
        path: '/sys',
        component: 'Layout',
        redirect: '/sys/user',
        name: '系统管理',
        meta: {
        title: '系统管理',
        icon: 'systemSet'
        },
        children: [
        {
            path: 'user',
            component: 'sys/user/index', 
            name: 'user',
            meta: { title: '用户管理' },
        },
        {
            path: 'role',
            component: 'sys/role/index', 
            name: 'role',
            meta: { title: '角色管理' },
        },
        {
            path: 'menu',
            component: 'sys/menu/index', 
            name: 'menu',
            meta: { title: '菜单管理' },
        }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }
]



router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    getRouters = null;
  }
  if(!getRouters){
    let routers = store.state.app.routers;
    //如果路由为空的话，先去拿缓存的路由加载
    if(routers && routers.length > 0){
      //如果缓存有，则不用请求路由
      // filterAsyncRouter(store.routers);
      console.log('有，不用请求路由',routers)
      getRouters = routers
      routerGo(to, next);
    }else{
      console.log('请求路由')
      if(to.path === '/login'){
        next();
      }else{
        httpRquest(getURL().GET_ROUTER,'GET',{}).then((res)=>{
          //获取权限列表
          console.log('666666666',res);
          getRouters = res.data;
          store.dispatch('app/setRouters',getRouters);
          routerGo(to, next)//执行路由跳转方法
        })
      }
      //temp
      // getRouters = tempRouter;
      // store.dispatch('app/setRouters',getRouters);
      // routerGo(to, next)//执行路由跳转方法
    }
  }else{
    next();
  }
})

//解析数据，添加路由
function filterAsyncRouter(asyncRouterMap){
  const accessedRouters = asyncRouterMap.filter(router=>{
    if(router.component){       //如果该路由组件不为空
      if(router.component === 'Layout'){    //Layout组件
        router.component = Layout;
      }else{
        router.component = _import(router.component);
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true;
  })
  return accessedRouters
}

function routerGo(to, next) {
  getRouters = filterAsyncRouter(getRouters) //过滤路由
  router.addRoutes(getRouters) //动态添加路由
  next({ ...to, replace: true })
}