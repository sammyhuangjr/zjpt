import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true;
// request interceptor
service.interceptors.request.use(
  
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = store.getters.token;
      console.log('-----------<',store.getters.token)
    }
    console.log(config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // let getCookies = function(name){
    //   var v = window.document.cookie.match('^|;?' + name + '=([^;]*)(;|$)');
    //   return v ? v[2] : null;
    // } 
    // let getCookies = function(cookiename) {
    //   var result;
    //   var mycookie = document.cookie;
    //   var start2 = mycookie.indexOf(cookiename + "=");
    //   if (start2 > -1) {
    //   start = mycookie.indexOf("=", start2) + 1;
    //   var end = mycookie.indexOf(";", start);
      
    //   if (end == -1) {
    //   end = mycookie.length;
    //   }
      
    //   result = unescape(mycookie.substring(start, end));
    //   }
      
    //   return result;
    //   }
    // let getCookies = function (cname) {
    //           var name = cname + "=";
    //           var ca = document.cookie.split(';');
    //           console.log("获取cookie,现在循环")
    //           for (var i = 0; i < ca.length; i++) {
    //             var c = ca[i];
    //             console.log(c)
    //             while (c.charAt(0) == ' ') c = c.substring(1);
    //             if (c.indexOf(name) != -1){
    //               return c.substring(name.length, c.length);
    //             }
    //           }
    //           return "";
    //         }
    const res = response.data
    console.log(response);
    // if (response.data.returnCode == 0) {
    //   if (response.data.bean) {
    //      let cookie  = response.headers.cookie;
    //      console.log(cookie);
    //      //校验自定义headers，通过则进行下一步操作
    //     } else {
    //       console.log('失败');
    //     }
    // } else {
    //     console.log(777777)
    // }
    if(res.code == 605){
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      router.push({ path: '/login' })
    }
    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } 
    return res;
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
