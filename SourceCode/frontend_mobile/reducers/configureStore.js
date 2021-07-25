import {createStore, combineReducers} from 'redux';
import {applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {alertReducer} from './alerts';
import {
  userInfoReducer,
  userRegisterReducer,
  userForgotPasswordReducer,
  userProfileReducer,
  userActionReducer,
  userAddressReducer,
} from './user';
import {citiesReducer, districtsReducer} from './location';
import {
  productsReducer,
  productDetailReducer,
  productHomepagesReducer,
  recommendedProductsReducer,
} from './products';
import {productOptionsReducer} from './productOptions';
import {brandReducer, brandsReducer} from './brands';
import {commentsReducer} from './comments';
import {ratesReducer} from './rates';
import {cartsReducer} from './carts';
import {
  createOrderReducer,
  orderReducer,
  orderDetailReducer,
  payReducer,
} from './orders';
import {notificationsReducer} from './notifications';
import {categoryGroupsReducer} from './categoryGroups';
import {allUserReducer} from './users';
import {messengersReducer} from './messengers';
import {composeWithDevTools} from 'redux-devtools-extension';

const rootReducer = combineReducers({
  alertReducer,
  userInfoReducer,
  userRegisterReducer,
  userForgotPasswordReducer,
  userProfileReducer,
  userActionReducer,
  userAddressReducer,
  citiesReducer,
  districtsReducer,
  productsReducer,
  productDetailReducer,
  productHomepagesReducer,
  productOptionsReducer,
  recommendedProductsReducer,
  brandReducer,
  brandsReducer,
  commentsReducer,
  ratesReducer,
  cartsReducer,
  notificationsReducer,
  createOrderReducer,
  orderReducer,
  orderDetailReducer,
  payReducer,
  categoryGroupsReducer,
  allUserReducer,
  messengersReducer,
});

const middleware = applyMiddleware(thunk);
const configureStore = () => {
  return createStore(rootReducer, {}, composeWithDevTools(middleware));
};
export default configureStore;
