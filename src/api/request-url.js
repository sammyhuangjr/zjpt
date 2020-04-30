/*
	接口
*/
var api = {
    LOGIN:'/login',//登录
    ADD: '/platform/add', // 新增平台
    AGENT_LIST:'/agent/page',//代理商列表
    AGENT_ADD:'/agent/add',//新增代理商
    AGENT_UPDATE:'/agent/update',//代理商编辑
    PLATFORM:'/agent/pagePlatform',//代理商授权平台
    PAGE:'/platform/page',//平台列表
    UPDATE:'/platform/update',//平台编辑
    DELETE:'/platform/delete',//平台删除
    AGENT_RECHARGE:'/agent/recharge/add',//代理商充值
    AGENT_RECORD:'/agent/recharge/page', //代理商充值记录
    UPLOAD:'/platform/upload',//上传
    DEVICE_ADD:'/device/authRecord/add',//新增设备授权
    CHECK_SN:'/device/authRecord/isAuthBySn',//校验设备sn
    DEVICE_LIST:'/device/authRecord/page',//设备授权管理列表
    DEVICE_DELETE:'/device/authRecord/delete',//设备授权管理删除
}

import axios from 'axios'
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
// axios.interceptors.request.use((config) => {
//     config.headers['Content-Type'] = 'application/json;charset=UTF-8';
//     return config;
// }
// );

export default {
    install(Vue, options) {
        Vue.prototype.URL = api;
        Vue.prototype.newPost = function(url,params){
            return axios.post(url,params);
        }
    }
}