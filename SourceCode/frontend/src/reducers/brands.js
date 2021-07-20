import * as Types from "../constants/BrandActTypes";
import { findIndexById } from "./../extentions/ArrayEx";

function brandsReducer(state = { loading: true }, action) {
    switch (action.type) {
        case Types.BRANDS_REQUEST:
            return { loading: true }
        case Types.BRANDS_SUCCESS:
            return { loading: false, brands: action.payload.data };
        case Types.BRANDS_FAIL:
            return { loading: false, message: action.payload.message };
        case Types.BRAND_CREATE_REQUEST:
            state.message = '';
            state.updateStatus = undefined;
            state.createStatus = undefined;
            state.createLoading = true;
            return { ...state };
        case Types.BRAND_CREATE_SUCCESS:
            state.createStatus = true;
            state.createLoading = false;
            state.brands.push(action.payload.data);
            return { ...state };
        case Types.BRAND_CREATE_FAIL:
            state.createLoading = false;
            state.createStatus = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.BRAND_UPDATE_REQUEST:
            state.message = '';
            state.updateLoading = true;
            state.updateStatus = undefined;
            state.createStatus = undefined;
            return { ...state };
        case Types.BRAND_UPDATE_SUCCESS:
            var brand = action.payload.data;
            var index = findIndexById(state.brands, brand._id);
            if (index >= 0)
                state.brands[index] = brand;
            state.updateLoading = false;
            state.updateStatus = true;
            return { ...state };
        case Types.BRAND_UPDATE_FAIL:
            state.updateLoading = false;
            state.updateStatus = false;
            state.message = action.payload.message;
            return { ...state };
        default: return state;
    }
}

export { brandsReducer }