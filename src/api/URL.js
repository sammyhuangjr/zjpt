import request from '@/utils/request'

export function httpRquest(url,method,params,dataType = 'json'){
    let req = {
        url:url,
        method:method,
        dataType:dataType
    }
    // req[method == 'GET' ? 'params' : 'data'] = params
    req[method == 'GET' ? 'params' : 'data'] = params
    return request(req);
}