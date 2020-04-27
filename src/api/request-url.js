/*
	接口
*/
var api = {
    ADD: '/add', // 
    AGENT_LIST:'/agent/page',//代理商列表
    AGENT_ADD:'/agent/add',//新增代理商
    PLATFORM:'/agent/pagePlatform',//代理商授权平台
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
            axios.post(url,params).then(res=>{
                console.log('====>',url,data,res.data)	 	
           })
        }
    }
}