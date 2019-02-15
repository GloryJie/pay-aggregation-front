import axios from '@/libs/api.request'

/**
 * 获取支付单
 * @param {*} param 
 */
export const getChargeListRequest = (param) => {
    const url = '/trade/charge/list'
    return axios.request({
        url: url,
        method: 'get',
        params: param
    })
}

/**
 * 获取退款单数据
 * @param {查询参数} param 
 */
export const getRefundListRequest = (param) => {
    const url = '/trade/refund/list'
    return axios.request({
        url: url,
        method: 'get',
        params: param
    })
}

/**
 * 获取所有已开通的渠道配置
 * @param {*} appId 
 */
export const getOpenedChannelConfigRequest = (appId) => {
    const url = `/app/${appId}/channel`
    return axios.request({
        url: url,
        method: 'get'
    })
}

/**
 * 添加新的渠道配置
 * @param {*} appId 
 * @param {*} param 
 */
export const addNewChannelConfigRequest = (appId, param) => {
    const url = `/app/${appId}/channel`
    return axios.request({
        url,
        method: 'post',
        data: param
    })
}

/**
 * 添加新的渠道配置
 * @param {*} appId 
 * @param {*} param 
 */
export const updateChannelConfigRequest = (appId, param) => {
    const url = `/app/${appId}/channel`
    return axios.request({
        url,
        method: 'put',
        data: param
    })
}

export const deleteChannelConfigRequest = (appId, channel) => {
    const url = `/app/${appId}/channel/${channel}`
    return axios.request({
        url,
        method: 'delete'
    })
}

export const getNotifyLogRecordRequest = (appId, param) => {
    const url = `/app/${appId}/notification/record`
    return axios.request({
        url,
        method: 'get',
        params: param
    })
}


export const getEventSubscriptionRequest = (appId) => {
    const url = `/app/${appId}/notification`
    return axios.request({
        url,
        method: 'get'
    })
}

export const addOrUpdateEventSubscriptionRequest = (appId,param) => {
    const url = `/app/${appId}/notification`
    return axios.request({
        url,
        method: 'post',
        data: param
    })
}

export const deleteEventSubscriptionRequest = (appId,eventType) => {
    const url = `/app/${appId}/notification/${eventType}`
    return axios.request({
        url,
        method: 'delete'
    })
}

