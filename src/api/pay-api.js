import axios from '@/libs/api.request'

export const getChargeListRequest = (param) => {
    const url = '/trade/charge/list'
    return axios.request({
        url: url,
        method: 'get',
        params: param
    })
}

export const getRefundListRequest = (param) => {
    const url = '/trade/refund/list'
    return axios.request({
        url: url,
        method: 'get',
        params: param
    })
}