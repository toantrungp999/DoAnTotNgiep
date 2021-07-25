import * as Types from '../constants/UserActTypes';
import * as ServerMessageError from '../constants/ServerMessageError';
import * as Message from '../constants/Message';
import {findIndexById} from '../extentions/ArrayEx';

function userInfoReducer(state = {}, action) {
  switch (action.type) {
    case Types.INITITION:
      return {userInfo: action.payload};
    case Types.USER_SIGNIN_REQUEST:
      return {loading: true};
    case Types.USER_SIGNIN_SUCCESS:
      return {loading: false, userInfo: action.payload.data};
    case Types.USER_SIGNIN_FAIL:
      let message = action.payload.message;
      return {loading: false, message};
    case Types.USER_PROFILE_UPDATE_SUCCESS:
      state.userInfo.name = action.payload.data.name;
      state.userInfo.phoneNumber = action.payload.data.phoneNumber;
      return {...state};
    case Types.USER_AVATAR_SUCCESS:
      state.userInfo.image = action.payload.data;
    case Types.USER_LOGOUT:
      return {};
    case Types.USER_INFORM:
      return {loading: false, inform: action.payload.message};
    default:
      return state;
  }
}

function userForgotPasswordReducer(state = {}, action) {
  switch (action.type) {
    case Types.USER_FORGOTPASSWORD_REQUEST:
      return {loading: true};
    case Types.USER_FORGOTPASSWORD_SUCCESS:
      return {
        loading: false,
        statusForgot: true,
        email: action.payload.data.email,
        msgSuccess: action.payload.message,
        timeout: 300,
      };
    case Types.USER_FORGOTPASSWORD_FAIL:
      return {
        loading: false,
        statusForgot: false,
        message: action.payload.message,
      };
    case Types.USER_VERIFY_OTP_REQUEST:
      state.loading = true;
      state.message = '';
      return {...state};
    case Types.TIME_OUT_REQUEST:
      return {loading: false};
    case Types.USER_VERIFY_OTP_SUCCESS:
      return {
        loading: false,
        statusVerify: true,
        accessToken: action.payload.data.accessToken,
      };
    case Types.USER_VERIFY_OTP_FAIL:
      state.loading = false;
      state.message = action.payload.message;
      state.statusVerify = false;
      return {...state};
    case Types.USER_RESET_PASSSWORD_REQUEST:
      state.loading = true;
      state.message = '';
      return {...state};
    case Types.USER_RESET_PASSSWORD_SUCCESS:
      return {loading: false, statusReset: true};
    case Types.USER_RESET_PASSSWORD_FAIL:
      return {
        loading: false,
        statusReset: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
}

function userRegisterReducer(state = {}, action) {
  switch (action.type) {
    case Types.USER_REGISTER_REQUEST:
      return {loading: true};
    case Types.USER_REGISTER_SUCCESS:
      return {loading: false};
    case Types.USER_REGISTER_FAIL:
      let message = action.payload.message;
      if (message === ServerMessageError.EMAIL_ALREADY_EXIST)
        message = Message.EMAIL_ALREADY_EXIST_VN;
      return {loading: false, message};
    default:
      return state;
  }
}

function userProfileReducer(
  state = {loading: false, userProfile: {}, messege: ''},
  action,
) {
  switch (action.type) {
    case Types.USER_PROFLE_REQUEST:
      return {loading: true};
    case Types.USER_PROFILE_SUCCESS:
      return {loading: false, userProfile: action.payload.data};
    case Types.USER_PROFILE_UPDATE_SUCCESS:
      return {loading: false, userProfile: action.payload.data};
    case Types.USER_PROFILE_FAIL:
      return {loading: false, message: action.payload.message};
    case Types.USER_CHANGEPHONE_SUCCESS:
      state.userProfile.phoneNumber = action.payload.data;
      return {...state};
    case Types.USER_AVATAR_SUCCESS:
      state.userProfile.image = action.payload.data.url;
      return {...state};
    case Types.CLEAR_INFORM_PROFILE:
      state.message = '';
      state.updateProfileSuccess = null;
      return {...state};
    default:
      return state;
  }
}

function userActionReducer(state = {loading: false}, action) {
  let message = '';
  switch (action.type) {
    case Types.USER_PROFLE_UPDATE_REQUEST:
      return {loading: false};
    case Types.USER_PROFILE_UPDATE_SUCCESS:
      return {loading: false, updateProfileSuccess: true};
    case Types.USER_PROFILE_UPDATE_FAIL:
      return {loading: false, updateProfileMessage: action.payload.message};
    case Types.USER_AVATAR_REQUEST:
      return {loading: false};
    case Types.USER_AVATAR_SUCCESS:
      return {loading: false, changeAvatarSuccess: true};
    case Types.USER_AVATAR_FAIL:
      return {loading: false, changeAvatarMessage: action.payload.message};
    case Types.USER_CHANGEPASSWORD_REQUEST:
      return {loading: true};
    case Types.USER_CHANGEPASSWORD_SUCCESS:
      return {loading: false, changePasswordSuccess: true};
    case Types.USER_CHANGEPASSWORD_FAIL:
      message = action.payload.message;
      // if (message === ServerMessageError.PASSWORD_NOT_CORRECT)
      //   message = Message.PASSWORD_NOT_CORRECT_VN;
      return {loading: false, changePasswordMessage: message};
    case Types.USER_CHANGEPHONE_REQUEST:
      return {loading: true};
    case Types.USER_CHANGEPHONE_SUCCESS:
      return {loading: false, changePhoneSuccess: true};
    case Types.USER_CHANGEPHONE_FAIL:
      message = action.payload.message;
      // if (message === ServerMessageError.PASSWORD_NOT_CORRECT)
      //   message = Message.PASSWORD_NOT_CORRECT_VN;
      return {loading: false, changePhoneMessage: message};
    case Types.CLEAR_INFORM_CHANHEPHONE:
      state.changePhoneMessage = '';
      state.changePhoneSuccess = null;
      return {...state};
    case Types.CLEAR_INFORM_CHANGEPASSWORD:
      state.changePasswordMessage = '';
      state.changePasswordSuccess = null;
      return {...state};
    case Types.CLEAR_INFORM_PROFILE:
      state.changeAvatarMessage = '';
      state.changeAvatarSuccess = null;
      return {...state};
    default:
      return state;
  }
}

function userAddressReducer(state = {loading: false}, action) {
  var index = -1;
  switch (action.type) {
    case Types.USER_ADDRESSES_REQUEST:
      return {loading: true};
    case Types.USER_ADDRESSES_SUCCESS:
      return {loading: false, addresses: action.payload.data};
    case Types.USER_ADDRESSES_FAIL:
      return {loading: false, message: action.payload.message};
    ///
    case Types.USER_ADD_ADDRESS_REQUEST:
      state.message = '';
      state.messageAction = '';
      state.loadingAddAddress = true;
      state.statusAddAddress = false;
      state.statusUpdateAddress = false;
      state.statusDeleteAddress = false;
      return {...state};
    case Types.USER_ADD_ADDRESS_SUCCESS:
      state.loadingAddAddress = false;
      state.statusAddAddress = true;
      state.addresses = action.payload.data;
      return {...state};
    case Types.USER_ADD_ADDRESS_FAIL:
      state.loadingAddAddress = false;
      state.messageAction = action.payload.message;
      return {...state};
    ///
    case Types.USER_UPDATE_ADDRESS_REQUEST:
      state.message = '';
      state.messageAction = '';
      state.loadingUpdateAddress = true;
      state.statusAddAddress = false;
      state.statusUpdateAddress = false;
      state.statusDeleteAddress = false;
      return {...state};
    case Types.USER_UPDATE_ADDRESS_SUCCESS:
      state.loadingUpdateAddress = false;
      state.statusUpdateAddress = true;
      var address = action.payload.data;
      index = findIndexById(state.addresses, address._id);
      if (index >= 0) {
        if (address.isDefault !== state.addresses[index].isDefault)
          for (var i = state.addresses.length - 1; i >= 0; i--)
            state.addresses[i].isDefault = false;
        state.addresses[index] = address;
      }
      return {...state};
    case Types.USER_UPDATE_ADDRESS_FAIL:
      state.loadingUpdateAddress = false;
      state.messageAction = action.payload.message;
      return {...state};
    ///
    case Types.USER_DELETE_ADDRESS_REQUEST:
      state.message = '';
      state.messageAction = '';
      state.loadingDeleteAddress = true;
      state.statusAddAddress = false;
      state.statusUpdateAddress = false;
      state.statusDeleteAddress = false;
      return {...state};
    case Types.USER_DELETE_ADDRESS_SUCCESS:
      state.loadingDeleteAddress = false;
      state.statusDeleteAddress = true;
      var addressId = action.payload.data;
      index = findIndexById(state.addresses, addressId);
      if (index >= 0) state.addresses.splice(index, 1);
      return {...state};
    case Types.USER_DELETE_ADDRESS_FAIL:
      state.loadingDeleteAddress = false;
      state.message = action.payload.message;
      return {...state};
    default:
      return state;
  }
}

export {
  userInfoReducer,
  userForgotPasswordReducer,
  userRegisterReducer,
  userProfileReducer,
  userActionReducer,
  userAddressReducer,
};
