import axios from '@/libs/api.request'

export const getChargeListRequest = (param) => {
    const url = '/trade/charge/list'
    return axios.request({  // 这里返回的是一个Promise，request方法传入一个配置对象，配置项可参考axios
        url: url,
        method: 'get',
        params: param
    })
}