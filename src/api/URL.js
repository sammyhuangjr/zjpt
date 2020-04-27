import request from '@/utils/request'

export function httpRquest(url,method,params){
    return request({
        url: url,
        method: method,
        params: params
    })
}