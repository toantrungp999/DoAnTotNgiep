import * as Types from "../constants/ProductOptionActTypes";

function findIndexById(array, _id) {
  for (let i = array.length - 1; i >= 0; i--)
    if (array[i]._id === _id) return i;
  return -1;
}
function productOptionsReducer(state = {}, action) {
  let index = -1;
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
    case Types.COLOR_OPTION_CREATE_REQUEST:
      state.message = "";
      state.actionColorLoading = true;
      state.actionColorStatus = null;
      return { ...state };
    case Types.SIZE_OPTION_CREATE_REQUEST:
      state.message = "";
      state.actionSizeLoading = true;
      state.actionSizeStatus = null;
      return { ...state };
    case Types.QUANTITY_OPTION_CREATE_REQUEST:
      state.message = "";
      state.actionQuantityLoading = true;
      state.actionQuantityStatus = null;
      return { ...state };
    case Types.COLOR_OPTION_UPDATE_REQUEST:
      state.message = "";
      state.actionColorLoading = true;
      state.actionColorStatus = null;
      return { ...state };
    case Types.SIZE_OPTION_UPDATE_REQUEST:
      state.message = "";
      state.actionSizeLoading = true;
      state.actionSizeStatus = null;
      return { ...state };
    case Types.QUANTITY_OPTION_UPDATE_REQUEST:
      state.message = "";
      state.actionQuantityLoading = true;
      state.actionQuantityStatus = null;
      return { ...state };
    case Types.COLOR_OPTION_CREATE_SUCCESS:
      state.colorOptions.push(action.payload.data);
      state.actionColorLoading = false;
      state.actionColorStatus = true;
      return { ...state };
    case Types.SIZE_OPTION_CREATE_SUCCESS:
      state.sizeOptions.push(action.payload.data);
      state.actionSizeLoading = false;
      state.actionSizeStatus = true;
      return { ...state };
    case Types.QUANTITY_OPTION_CREATE_SUCCESS:
      state.quantityOptions.push(action.payload.data);
      state.actionQuantityLoading = false;
      state.actionQuantityStatus = true;
      return { ...state };
    case Types.COLOR_OPTION_CREATE_FAIL:
      state.actionColorLoading = false;
      state.actionColorStatus = false;
      state.message = action.payload.message;
      return { ...state };
    case Types.SIZE_OPTION_CREATE_FAIL:
      state.actionSizeLoading = false;
      state.actionSizeStatus = false;
      state.message = action.payload.message;
      return { ...state };
    case Types.QUANTITY_OPTION_CREATE_FAIL:
      state.actionQuantityLoading = false;
      state.actionQuantityStatus = false;
      state.message = action.payload.message;
      return { ...state };
    case Types.COLOR_OPTION_UPDATE_FAIL:
      state.actionColorLoading = false;
      state.actionColorStatus = false;
      state.message = action.payload.message;
      return { ...state };
    case Types.SIZE_OPTION_UPDATE_FAIL:
      state.actionSizeLoading = false;
      state.actionSizeStatus = false;
      state.message = action.payload.message;
      return { ...state };
    case Types.QUANTITY_OPTION_UPDATE_FAIL:
      state.actionQuantityLoading = false;
      state.actionQuantityStatus = false;
      state.message = action.payload.message;
      return { ...state };
    case Types.COLOR_OPTION_UPDATE_SUCCESS:
      const colorOption = action.payload.data;
      index = findIndexById(state.colorOptions, colorOption._id);
      if (index >= 0) state.colorOptions[index] = colorOption;
      state.actionColorLoading = false;
      state.actionColorStatus = true;
      return { ...state };
    case Types.QUANTITY_OPTION_UPDATE_SUCCESS:
      const quantityOption = action.payload.data;
      index = findIndexById(state.quantityOptions, quantityOption._id);
      if (index >= 0) {
        state.quantityOptions[index].quantity = quantityOption.quantity;
      }
      state.actionQuantityLoading = false;
      state.actionQuantityStatus = true;
      return { ...state };
    case Types.SIZE_OPTION_UPDATE_SUCCESS:
      var sizeOption = action.payload.data;
      index = findIndexById(state.sizeOptions, sizeOption._id);
      if (index > -1) state.sizeOptions[index].size = sizeOption.size;
      state.actionSizeLoading = false;
      state.actionSizeStatus = true;
      return { ...state };
    default:
      return state;
  }
}

export { productOptionsReducer };
