import * as Types from "../constants/ProductOptionActTypes";

function productOptionsReducer(state = {}, action) {
    switch (action.type) {
        case Types.COLOR_OPTIONS_REQUEST:
            state.colorLoading = true;
            return { ...state };
        case Types.SIZE_OPTIONS_REQUEST:
            state.sizeLoading = true;
            return { ...state };
        case Types.QUANTITY_OPTIONS_REQUEST:
            state.quantityLoading = true;
            return { ...state };
        ///
        case Types.COLOR_OPTIONS_SUCCESS:
            state.colorLoading = false;
            state.colorOptions = action.payload.data;
            return { ...state };
        case Types.SIZE_OPTIONS_SUCCESS:
            state.sizeLoading = false;
            state.sizeOptions = action.payload.data;
            return { ...state };
        case Types.QUANTITY_OPTIONS_SUCCESS:
            state.quantityLoading = false;
            state.quantityOptions = action.payload.data;
            return { ...state };
        ///
        case Types.COLOR_OPTIONS_FAIL:
            state.colorLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.SIZE_OPTIONS_FAIL:
            state.sizeLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.QUANTITY_OPTIONS_FAIL:
            state.quantityLoading = false;
            state.message = action.payload.message;
            return { ...state };
        default: return state;
    }
}

export { productOptionsReducer }