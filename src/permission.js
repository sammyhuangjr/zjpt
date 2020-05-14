import router from './router'
import store from './store'
import { Message, TabPane } from 'element-ui'
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

var tempRouter = [{
	"id": "0bbcb2f86911fb57f879402d5d15ef67",
	"parentId": "0",
	"children": [{
		"id": "18e8ca67d946fbdf0bcf5bec88d84e0f",
		"parentId": "0bbcb2f86911fb57f879402d5d15ef67",
		"children": [],
		"icon": null,
		"name": "用户管理",
		"url": null,
		"spread": false,
		"path": "/user",
		"component": "sys/user/index",
		"authority": null,
		"redirect": null,
		"code": null,
		"type": "0",
		"label": "用户管理",
		"sort": 1,
		"permission": null,
		"createTime": null,
		"updateTime": null
	}, {
		"id": "6dd0a11d57b2e1c1b69889e2003383c2",
		"parentId": "0bbcb2f86911fb57f879402d5d15ef67",
		"children": [],
		"icon": null,
		"name": "角色管理",
		"url": null,
		"spread": false,
		"path": "role",
		"component": "sys/role/index",
		"authority": null,
		"redirect": null,
		"code": null,
		"type": "0",
		"label": "角色管理",
		"sort": 1,
		"permission": null,
		"createTime": null,
		"updateTime": null
	}, {
		"id": "9d236d90326b4587451ed6505aa84ac3",
		"parentId": "0bbcb2f86911fb57f879402d5d15ef67",
		"children": [],
		"icon": null,
		"name": "菜单管理",
		"url": null,
		"spread": false,
		"path": "menu",
		"component": "sys/menu/index",
		"authority": null,
		"redirect": null,
		"code": null,
		"type": "0",
		"label": "菜单管理",
		"sort": 1,
		"permission": null,
		"createTime": null,
		"updateTime": null
	}],
	"icon": null,
	"name": "系统管理",
	"url": null,
	"spread": false,
	"path": "/sys",
	"component": "Layout",
	"authority": null,
	"redirect": null,
	"code": null,
	"type": "0",
	"label": "系统管理",
	"sort": 1,
	"permission": null,
	"createTime": null,
	"updateTime": null
},{
	"name": "平台列表2",
	"url": null,
	"spread": false,
	"path": "/form",
	"component": "Layout",
	"authority": null,
	"children":[{
		"icon": null,
		"name": "平台列表",
		"url": null,
		"spread": false,
		"path": "index",
		"component": "form/index"
	}]
}]

router.beforeEach((to,from,next)=>{
	console.log(to.path,from.path)
	//如果从首页跳转404(处理F5刷新的问题)
	if(to.path === '/404' && from.path === '/'){
		let lastRouter = localStorage.getItem('lastRouter');
		//1.有缓存页面，表示页面刷新
		if(lastRouter){
			//如果有缓存路由表
			let routers = store.state.app.routers;
			if(routers && routers.length > 0){
				getRouters = filterAsyncRouter(routers) //过滤路由
				router.addRoutes(getRouters) //动态添加路由
				next({
					path:lastRouter
				})
				localStorage.removeItem('lastRouter')
				return;
			}else{
				//否则直接跳首页
				next({path:'/'})
				return;
			}
		}else{
			//否则直接跳首页
			next({path:'/'})
			return;
		}
		// getRouters = filterAsyncRouter(store.state.app.routers) //过滤路由
		// router.addRoutes(getRouters) //动态添加路由
		// next({
		// 	path:'/form/index'
		// })
		// return;
	}
	//如果前往login页，重置路由信息
	if(to.path === '/login'){
		getRouters = null;
	}
	//如果路由信息为空，且不是去往login页，则需请求路由信息
	if(!getRouters && to.path !== '/login'){
		let routers = store.state.app.routers;
		//如果路由为空的话，先去拿缓存的路由加载
		if(routers && routers.length > 0){
		  //如果缓存有，则不用请求路由
		  // filterAsyncRouter(store.routers);
		  console.log('有，不用请求路由',routers)
		  getRouters = routers
		  routerGo(to, next);
		}else{
			//如果缓存没有路由信息,先前往登录页
			// if(!getToken()){
			// 	//未登录
			// 	console.log('未登录')
			// 	next({path:'/login'});
			// 	return;
			// }
		  	console.log('请求路由')
			httpRquest(getURL().GET_ROUTER,'GET',{}).then((res)=>{
			//获取权限列表
			  console.log('666666666',res);
			  getRouters = res.data;
			  store.dispatch('app/setRouters',getRouters);
			  routerGo(to, next)//执行路由跳转方法
			})
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
    if (router.children && router.children.length > 0) {
      router.children = filterAsyncRouter(router.children)
    }else{
		delete router.children
	}
    return true;
  })
  return accessedRouters
}

function routerGo(to, next) {
  getRouters = filterAsyncRouter(getRouters) //过滤路由
  router.addRoutes(getRouters) //动态添加路由
  next({to,replace:true})
}