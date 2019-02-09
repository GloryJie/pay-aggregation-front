

export const CHARGE_STATUS_ENUM = {
    // WAIT_PAY(10, "待支付"),
    // SUCCESS(20, "支付成功"),
    // EXISTS_REFUND(30, "存在退款"),
    // REFUND_COMPLETED(40, "全部退款"),
    // CLOSED(50, "交易关闭"),
    // FAILURE(60, "交易失败");
    'WAIT_PAY': '待支付',
    'SUCCESS': '支付成功',
    'EXISTS_REFUND': '存在退款',
    'REFUND_COMPLETED': '全部退款',
    'CLOSED': '交易关闭',
    'FAILURE': '交易失败',
}

export const CHANNEL_ENUM = {
    // ALIPAY_PAGE(1, "GATEWAY", "FAST_INSTANT_TRADE_PAY", "支付宝网页支付"),
    // ALIPAY_WAP(2, "GATEWAY", "QUICK_WAP_WAY", "支付宝手机网站支付"),
    // ALIPAY_SCAN_CODE(3, "GATEWAY", "", "支付宝扫码支付"),
    // ALIPAY_BAR_CODE(4, "NON_GATEWAY", "FACE_TO_FACE_PAYMENT", "支付宝条码支付");

    'ALIPAY_PAGE': '支付宝PC网页支付',
    'ALIPAY_WAP': '支付宝手机H5支付',
    'ALIPAY_SCAN_CODE': '支付宝扫码支付',
    'ALIPAY_BAR_CODE': '支付宝条码支付'
}

const REFUND_STATUS_ENUM = {
    PROCESSING: "退款处理中",
    SUCCESS: "退款成功",
    FAILURE: "退款失败"
}



/**
 * @description 讲英文状态的支付状态转换为中文
 * @param {String} status 英文状态
 */
export const transformChargeStatus = (status) => {
    return CHARGE_STATUS_ENUM[status];
}

export const transformChannel = (channel) => {
    return CHANNEL_ENUM[channel];
}

export const transformRefundStatus = (status) => {
    return REFUND_STATUS_ENUM[status];
}


