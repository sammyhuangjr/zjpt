import request from '@/utils/request'

export function httpRquest(url,method,params){
    let req = {
        url:url,
        method:method
    }
    req[method == 'GET' ? 'params' : 'data'] = params
    return request(req);
}