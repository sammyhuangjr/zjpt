/*
	接口
*/
var api = {
    LOGIN:'/login',//登录
    GET_CODE:'/public/getVerifyCode',//获取验证码
    GET_PERMISSION:'/sysMenu/getMenuByRole',//获取权限
    MENU:'/sysMenu/getMenuTree',//获取菜单权限列表
    ADD: '/platform/add', // 新增平台
    AGENT_LIST:'/agent/page',//代理商列表
    AGENT_ADD:'/agent/add',//新增代理商
    AGENT_UPDATE:'/agent/update',//代理商编辑
    PLATFORM:'/agent/pagePlatform',//代理商授权平台 弃用
    PLATFORM_NEW:'/platform/getAll',//代理商授权平台
    PAGE:'/platform/page',//平台列表 
    UPDATE:'/platform/update',//平台编辑
    DELETE:'/platform/delete',//平台删除
    AGENT_RECHARGE:'/agent/recharge/add',//代理商充值
    AGENT_RECORD:'/agent/recharge/page', //代理商充值记录
    UPLOAD:'/public/upload',//上传
    DEVICE_ADD:'/device/authRecord/add',//新增设备授权
    DEVICE_READD:'/device/authRecord/repetitionAdd',//设备授权(sn号重复时添加)
    CHECK_SN:'/device/authRecord/isAuthBySn',//校验设备sn
    CHECK_SN_BATCH:'/device/authRecord/isAuthBySnList',//批量校验设备sn
    DEVICE_ADD_BATCH:'/device/authRecord/repetitionAddList',//批量设备授权
    DEVICE_LIST:'/device/authRecord/page',//设备授权管理列表
    DEVICE_DELETE:'/device/authRecord/delete',//设备授权管理删除
    USER_LIST:'/sysUser/page',//获取用户列表
    USER_EDIT:'/sysUser/update',//用户编辑
    USER_ADD:'/sysUser/add',//新建用户
    GET_ROLE:'/role/getAll',//获取角色
    ROLE_ADD:'/role/add',//获取角色管理列表
    ROLE_DELETE:'/role/delete',//角色删除
    ROLE_UPDATE:'/role/update',//角色修改
    AUTH:'/role/insertRoleMenus',//授权
    AUTH_MENU:'/sysMenu/getMenuList',//授权菜单
    MENU_ADD:'/sysMenu/add',//新增资源
    GET_ROUTER:'/sysMenu/getUserMenu',//获取侧边栏
    MENU_UPDATE:'/sysMenu/update',//修改菜单
    MENU_DELETE:'/sysMenu/delete',//删除菜单
    GETPLAT_BYID:'/platform/getListByAgentId',//根据代理商获取平台
    USER_STATUS:'/sysUser/updateStatus',//修改用户状态
    USER_DELETE:'/sysUser/delete',//删除用户
}

import axios from 'axios'
import store from '@/store'
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    config.headers['Access-Control-Allow-Origin'] = true;
    if (store.getters.token) {
        config.headers['token'] = store.getters.token;
    }
    
    return config;
}
);

export function getURL(){
    return api;
}

export default {
    install(Vue, options) {
        Vue.prototype.URL = api;
        Vue.prototype.newPost = function(url,params){
            return axios.post(url,params);
        }

        Vue.prototype.newGet = function(url){
            return axios.get(url);
        }

        Vue.prototype.axios = axios;
    }
}