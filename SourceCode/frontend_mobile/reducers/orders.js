import * as Types from '../constants/OrdersActTypes';

function createOrderReducer(state = {loading: true}, action) {
  switch (action.type) {
    case Types.ORDER_CREATE_REQUEST:
      state.createSuccess = null;
      return {...state};
    case Types.ORDER_CREATE_SUCCESS:
      state.createSuccess = true;
      state.orderInfo = action.payload.data.orderInfo;
      return {...state};
    case Types.ORDER_CREATE_FAIL:
      state.createSuccess = false;
      state.message = action.payload.message;
      return {...state};

    case Types.ORDER_FETCH_PRODUCT_REQUEST:
      return {loading: true};
    case Types.ORDER_FETCH_PRODUCT_SUCCESS:
      state.loading = false;
      state.carts = action.payload.data;
      return {...state};
    case Types.ORDER_FETCH_PRODUCT_FAIL:
      state.loading = false;
      state.message = action.payload.message;
      return {...state};

    case Types.SHIPPING_FEE_REQUEST:
      state.shipInfos = null;
      return {...state};
    case Types.SHIPPING_FEE_SUCCESS:
      state.shipInfos = action.payload.data.shippingFees;
      return {...state};
    case Types.SHIPPING_FEE_FAIL:
      state.shipInfos = 'fail';
      return {...state};

    case Types.STORE_ADDRESSES_REQUEST:
      return {...state};
    case Types.STORE_ADDRESSES_SUCCESS:
      state.storeAddress = action.payload.data;
      return {...state};
    case Types.STORE_ADDRESSES_FAIL:
      state.storeAddress = null;
      return {...state};

    case Types.CLEAR_STATE:
      return {loading: true};

    default:
      return state;
  }
}

function orderReducer(state = {loading: true}, action) {
  switch (action.type) {
    case Types.ORDERS_REQUEST:
      return {loading: true};
    case Types.ORDERS_VIEW_MORE_REQUEST:
      state.viewMoreloading = true;
      return {...state};
    case Types.ORDERS_SUCCESS:
      var orders = action.payload.data.orders;
      if (state.viewMoreloading) orders = state.orders.concat(orders);
      return {
        loading: false,
        viewMoreloading: false,
        orders,
        pageInfo: action.payload.data.pageInfo,
        currentStatus: action.payload.data.currentStatus,
        currentSearch: action.payload.data.currentSearch,
      };
    case Types.ORDERS_FAIL:
      return {loading: false, message: action.payload.message};

    default:
      return state;
  }
}

function orderDetailReducer(state = {loading: true}, action) {
  switch (action.type) {
    case Types.ORDER_REQUEST:
      return {loading: true};
    case Types.ORDER_SUCCESS:
      return {loading: false, order: action.payload.data};
    case Types.ORDER_FAIL:
      return {loading: false, message: action.payload.message};

    case Types.ORDER_CHANGE_TYPE_REQUEST:
      state.loading = true;
      state.changeTypeSuccess = null;
      state.dulicationIndexs = null;
      state.updateSerialsSuccess = null;
      return {...state};
    case Types.ORDER_UPDATE_SERIALS_REQUEST:
      state.loading = true;
      state.dulicationIndexs = null;
      state.changeTypeSuccess = null;
      state.updateSerialsSuccess = null;
      return {...state};
    case Types.ORDER_CHANGE_TYPE_SUCCESS:
      state.loading = false;
      state.changeTypeSuccess = true;
      state.order.orderInfo.status = action.payload.data.status;
      state.order.orderInfo.actionLog = action.payload.data.actionLog;
      state.message = action.payload.message;
      return {...state};
    case Types.ORDER_UPDATE_SERIALS_SUCCESS:
      state.loading = false;
      state.updateSerialsSuccess = true;
      state.order.orderDetails = action.payload.data;
      return {...state};
    case Types.ORDER_CHANGE_TYPE_FAIL:
      state.changeTypeSuccess = false;
      state.loading = false;
      state.message = action.payload.message;
      return {...state};
    case Types.ORDER_APPROVE_FAIL:
      state.changeTypeSuccess = false;
      state.loading = false;
      state.message = action.payload.message;
      state.dulicationIndexs = action.payload.data.dulicationIndexs;
      return {...state};
    case Types.ORDER_UPDATE_SERIALS_FAIL:
      state.loading = false;
      state.updateSerialsSuccess = false;
      if (action.payload.data.dulicationIndexs) {
        state.message = action.payload.message;
        state.dulicationIndexs = action.payload.data.dulicationIndexs;
      }
      state.message = action.payload.message;
      return {...state};
    case Types.CLEAR_STATE:
      return {loading: true};

    default:
      return state;
  }
}

function payReducer(state = {loading: false}, action) {
  switch (action.type) {
    case Types.PAY_URL_REQUEST:
      return {loading: true};
    case Types.PAY_URL_SUCCESS:
      return {
        loading: false,
        vnpUrl: action.payload.data.vnpUrl,
      };
    case Types.PAY_URL_FAIL:
      return {loading: false, message: action.payload.message};

    default:
      return state;
  }
}
export {createOrderReducer, orderReducer, orderDetailReducer, payReducer};
