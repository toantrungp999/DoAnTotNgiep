import * as Types from "../constants/CartActTypes";
import { findIndexById } from "../extentions/ArrayEx";

function cartsReducer(state = { loading: true }, action) {
    let cart, index;
    switch (action.type) {
        case Types.CARTS_REQUEST:
            return { loading: true }
        case Types.CARTS_SUCCESS:
            return { loading: false, carts: action.payload.data };
        case Types.CARTS_FAIL:
            return { loading: false, message: action.payload.message };

        case Types.RE_CARTS_SUCCESS:
            state.carts = action.payload.data;
            return { ...state };
        case Types.RE_CARTS_FAIL:
            state.message = action.payload.message;
            return { ...state };

        case Types.CART_CREATE_REQUEST:
            state.message = '';
            state.messageCreate = '';
            state.createStatus = false;
            state.createLoading = true;
            return { ...state };
        case Types.CART_CREATE_SUCCESS:
            state.createStatus = true;
            state.createLoading = false;
            state.cartId = action.payload.data._id;
            if (state.carts !== undefined) {
                index = findIndexById(state.carts, action.payload.data._id);
                if (index >= 0)
                    state.carts[index] = action.payload.data;
                else
                    state.carts.push(action.payload.data);
            }

            return { ...state };
        case Types.CART_CREATE_FAIL:
            state.createLoading = false;
            state.createStatus = false;
            state.messageCreate = action.payload.message;
            return { ...state };

        case Types.CART_UPDATE_REQUEST:
            state.message = '';
            state.messageCreate = '';
            state.updateLoading = true;
            state.updateStatus = false;
            state.updateTypeStatus = false;
            state.deleteStatus = false;
            return { ...state };
        case Types.CART_UPDATE_SUCCESS:
            cart = action.payload.data;
            index = findIndexById(state.carts, cart._id);
            if (index >= 0)
                state.carts[index].quantity = cart.quantity;
            state.updateLoading = false;
            state.updateStatus = true;
            return { ...state };
        case Types.CART_UPDATE_FAIL:
            state.updateLoading = false;
            state.updateStatus = false;
            state.message = action.payload.message;
            return { ...state };

        case Types.CART_UPDATE_TYPE_REQUEST:
            state.message = '';
            state.messageCreate = '';
            state.updateTypeLoading = true;
            state.updateStatus = false;
            state.updateTypeStatus = false;
            state.deleteStatus = false;
            return { ...state };
        case Types.CART_UPDATE_TYPE_SUCCESS:
            cart = action.payload.data.cart;
            let cartId = action.payload.data.cartId;
            if (cartId !== cart._id) {
                index = findIndexById(state.carts, cartId);
                if (index >= 0)
                    state.carts.splice(index, 1);
            }
            index = findIndexById(state.carts, cart._id);
            if (index >= 0)
                state.carts[index] = cart;
            state.updateTypeLoading = false;
            state.updateTypeStatus = true;
            return { ...state };
        case Types.CART_UPDATE_TYPE_FAIL:
            state.updateTypeLoading = false;
            state.updateTypeStatus = false;
            state.message = action.payload.message;
            return { ...state };

        case Types.CART_DELETE_REQUEST:
            state.message = '';
            state.messageCreate = '';
            state.deleteLoading = true;
            state.updateStatus = false;
            state.deleteStatus = false;
            state.updateTypeStatus = false;
            return { ...state };
        case Types.CART_DELETE_SUCCESS:
            let _id = action.payload.data;
            index = findIndexById(state.carts, _id);
            if (index >= 0)
                state.carts.splice(index, 1);
            state.deleteLoading = false;
            state.deleteStatus = true;
            return { ...state };
        case Types.CART_DELETE_FAIL:
            state.deleteLoading = false;
            state.deleteStatus = false;
            state.message = action.payload.message;
            return { ...state };
        default: return state;
    }
}

export { cartsReducer }