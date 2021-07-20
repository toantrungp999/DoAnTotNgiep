const ONLINE_ORDER = {
    ORDER_TYPE: "Đặt hàng online",
    PAYMENT_TYPE: {
        VNPAY: "Thanh toán qua VNPAY",
        OFFLINE: "Thanh toán khi nhận hàng"
    },
    RECEIVE_TYPE: {
        SHIP: "Giao hàng đến địa chỉ của tôi",
        IN_STORE: "Nhận hàng tại của hàng"
    }
}

const IN_STORE_ORDER = {
    ORDER_TYPE: "Đặt tại của hàng",
    PAYMENT_TYPE: {
        CASH: "Thanh toán tiền mặt",
        VNPAY: "Thanh toán qua VNPAY",
    },
    RECEIVE_TYPE: {
        IN_STORE: "Nhận hàng tại của hàng"
    }
}

module.exports = {
    ONLINE_ORDER: ONLINE_ORDER,
    IN_STORE_ORDER: IN_STORE_ORDER,
}