import { combineReducers } from "redux";
import {
  userInfoReducer,
  userRegisterReducer,
  userForgotPasswordReducer,
  userProfileReducer,
  userActionReducer,
  userAddressReducer,
} from "./user";
import { brandsReducer } from "./brands";
import { categoriesReducer } from "./categories";
import { categoryGroupsReducer } from "./categoryGroups";
import { cartsReducer } from "./carts";
import {
  createOrderReducer,
  orderReducer,
  orderDetailReducer,
  payReducer,
} from "./orders";
import { commentsReducer } from "./comments";
import { ratesReducer } from "./rates";
import {
  usersReducer,
  userDetailReducer,
  allUserReducer,
} from "./managerUsers";
import { citiesReducer, districtsReducer, mapReducer } from "./location";
import {
  productsReducer,
  productCreateReducer,
  productDetailReducer,
  productHomepagesReducer,
  searchProductsReducer,
  recommendedProductsReducer,
} from "./products";
import { productOptionsReducer } from "./productOptions";
import { notificationsReducer } from "./notifications";
import { messengersReducer } from "./messengers";
import alertReducer from "./alert";
import { statisticsReducer } from "./statistics";

const appReducers = combineReducers({
  userInfoReducer,
  userRegisterReducer,
  userForgotPasswordReducer,
  userProfileReducer,
  citiesReducer,
  districtsReducer,
  mapReducer,
  userActionReducer,
  userAddressReducer,

  usersReducer,
  userDetailReducer,
  allUserReducer,

  brandsReducer,
  categoriesReducer,
  categoryGroupsReducer,

  productsReducer,
  productCreateReducer,
  productDetailReducer,
  productHomepagesReducer,
  searchProductsReducer,
  recommendedProductsReducer,

  productOptionsReducer,

  commentsReducer,

  ratesReducer,

  cartsReducer,

  createOrderReducer,
  orderReducer,
  orderDetailReducer,
  payReducer,

  notificationsReducer,

  alertReducer,

  messengersReducer,

  statisticsReducer,
});

export default appReducers;
