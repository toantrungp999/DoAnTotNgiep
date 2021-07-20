import * as Types from "../constants/UserActTypes";
import { NOTIFICATION_CLEAR } from "../constants/NotificationActTypes";
import { callApiToken, callApi } from './../utils/apiCaller';
import { SetItemFromStorage, ClearStorage } from './../extentions/Storage';
import { LoginManager } from 'react-native-fbsdk';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import { fectchCartsRequest } from "./cartActions";
import { initialization, login, fectchMessengersRequest } from "./messengerActions";
import { clearNotify, fectchNewNotificationsRequest } from "./notifacationActions";
import { useAlert, showAlertWithTimeout } from './alertActions';

//\\
export const initial = (userInfo, accessToken) => {
  return (dispatch) => {
    dispatch({ type: Types.INITITION, payload: userInfo });
    dispatch(initialization());
    dispatch(fectchCartsRequest());
    dispatch(fectchMessengersRequest());
    if (accessToken)
      login(accessToken, userInfo._id);
  }
}

export const signinRequest = (userInfo) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_SIGNIN_REQUEST });
    callApi('auth/login', 'POST', userInfo).then(response => {
      if (response.status === 0) {
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        dispatch(actLoginSuccess(response.data.userData, accessToken, refreshToken));
      }
      else {
        dispatch({ type: Types.USER_SIGNIN_FAIL, payload: response });
        //dispatch(showAlertWithTimeout('Đăng nhập thất bại', response.message, false));
      }
    });
  };
}

//\\
export const signinByApiRequest = (url, postData) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_SIGNIN_REQUEST });
    callApi('auth/' + url, 'POST', postData).then(response => {
      if (response.status === 0) {
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        dispatch(actLoginSuccess(response.data.userData, accessToken, refreshToken));
        dispatch(fectchMessengersRequest());
        dispatch(fectchCartsRequest());
        dispatch(initialization());
        dispatch(fectchNewNotificationsRequest(5, 1));
        login(accessToken, response.data.userData._id);
      }
      else
        dispatch({ type: Types.USER_SIGNIN_FAIL, payload: response });
    });
  };
}

//\\
export const actLoginSuccess = (userInfo, accessToken, refreshToken) => {
  return (dispatch) => {
    SetItemFromStorage('x-access-token', accessToken);
    SetItemFromStorage('refreshToken', refreshToken);
    SetItemFromStorage('userInfo', userInfo);
    dispatch(showAlertWithTimeout('Đăng nhập thành công', '', true));
    dispatch({
      type: Types.USER_SIGNIN_SUCCESS,
      payload: { status: 0, data: userInfo, message: "Success" }
    });
  }
};

export const registerRequest = (userRegister) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_REGISTER_REQUEST });
    callApi('auth/register', 'POST', userRegister).then(response => {
      if (response.status === 0) {
        dispatch({ type: Types.USER_REGISTER_SUCCESS });
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        dispatch(actLoginSuccess(response.data.userData, accessToken, refreshToken));
      }
      else {
        const type = Types.USER_REGISTER_FAIL;
        dispatch({ type, payload: response });
      }
      dispatch(useAlert('Đăng ký', response.message, response.status === 0));
    });
  };
}

export const forgotPasswordRequest = (email) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_FORGOTPASSWORD_REQUEST });
    callApi('auth/mobile/forgotpassword', 'POST', { email }).then(response => {
      const type = response.status === 0 ? Types.USER_FORGOTPASSWORD_SUCCESS : Types.USER_FORGOTPASSWORD_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const verifyOTPRequest = (code) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_VERIFY_OTP_REQUEST });
    callApi('auth/verify-otp', 'POST', { code }).then(response => {
      const type = response.status === 0 ? Types.USER_VERIFY_OTP_SUCCESS : Types.USER_VERIFY_OTP_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const timeoutRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.TIME_OUT_REQUEST });
  };
}

//\\
export const resetPasswordRequest = (password, accessToken) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_RESET_PASSSWORD_REQUEST });
    callApi('auth/mobile/reset-password', 'POST', { password }, accessToken).then(response => {
      if (response.status === 0) {
        dispatch({ type: Types.USER_RESET_PASSSWORD_SUCCESS });
      }
      else {
        const type = Types.USER_RESET_PASSSWORD_FAIL;
        dispatch({ type, payload: response });
      }
    });
  };
}

export const logoutRequest = () => (dispatch) => {
  LoginManager.logOut();
  GoogleSignin.revokeAccess().then().catch((error) => { console.log(error.message) });
  GoogleSignin.signOut().then().catch((error) => { console.log(error.message) });
  ClearStorage();
  dispatch(clearNotify());
  dispatch({ type: Types.USER_LOGOUT });
  dispatch({ type: NOTIFICATION_CLEAR });
};

export const fetchProfileRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.USER_PROFLE_REQUEST });
    callApiToken(dispatch, 'user/profile', 'GET', null).then(response => {
      const type = response.status === 0 ? Types.USER_PROFILE_SUCCESS : Types.USER_PROFILE_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const updateProfileRequest = (profile) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_PROFLE_UPDATE_REQUEST });
    callApiToken(dispatch, 'user/profile', 'PUT', profile).then(response => {
      const type = response.status === 0 ? Types.USER_PROFILE_UPDATE_SUCCESS : Types.USER_PROFILE_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(useAlert('Cập nhật thông tin', response.message, response.status === 0));
    });
  };
}

export const updateUrlProfileRequest = (url) => {
  return (dispatch) => {
    callApiToken(dispatch, 'user/updateAvatar', 'PUT', { image: url }).then(response => {
      let type = null;
      if (response.status === 0) {
        type = Types.USER_AVATAR_SUCCESS;
        response.data = url;
      }
      else
        type = Types.USER_AVATAR_FAIL;
      dispatch({ type, payload: response });
      dispatch(useAlert('Cập nhật ảnh đại diện', response.message, response.status === 0));
    });
  };
}

export const updateAvatarRequest = (file) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_AVATAR_REQUEST });
    const formData = new FormData();
    formData.append('image', { uri: file.uri, name: file.fileName, type: file.type });
    // formData.append('Content-Type', 'image/png');
    callApiToken(dispatch, 'upload-image', 'POST', formData).then(response => {
      console.log(response)
      if (response.status === 0) {
        dispatch(updateUrlProfileRequest(response.data.url));
      }
      else {
        const type = Types.USER_AVATAR_FAIL;
        dispatch({ type, payload: response });
        dispatch(showAlertWithTimeout('Cập nhật ảnh đại diện thất bại', response.message, false));
      }
    });
  };
}

export const changePasswordRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_CHANGEPASSWORD_REQUEST });
    callApiToken(dispatch, 'user/password', 'PUT', data).then(response => {
      const type = response.status === 0 ? Types.USER_CHANGEPASSWORD_SUCCESS : Types.USER_CHANGEPASSWORD_FAIL;
      dispatch({ type, payload: response });
      dispatch(useAlert('Đổi mật khẩu', response.message, response.status === 0));
    });
  };
}


export const changePhoneRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_CHANGEPHONE_REQUEST });
    callApiToken(dispatch, 'user/phone', 'PUT', data).then(response => {
      let type = null;
      if (response.status === 0) {
        type = Types.USER_CHANGEPHONE_SUCCESS;
        response.data = data.phoneNumber;
      }
      else
        type = Types.USER_CHANGEPHONE_FAIL;
      dispatch({ type, payload: response });
      dispatch(useAlert('Cập nhật số điện thoại', response.message, response.status === 0));
    });
  };
}

export const fetchAddressesRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.USER_ADDRESSES_REQUEST });
    callApiToken(dispatch, 'user/addresses', 'GET', null).then(response => {
      const type = response.status === 0 ? Types.USER_ADDRESSES_SUCCESS : Types.USER_ADDRESSES_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const addAddressRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_ADD_ADDRESS_REQUEST });
    callApiToken(dispatch, 'user/addresses', 'POST', data).then(response => {
      const type = response.status === 0 ? Types.USER_ADD_ADDRESS_SUCCESS : Types.USER_ADD_ADDRESS_FAIL;
      dispatch({ type, payload: response });
      dispatch(useAlert('Thêm địa chỉ', response.message, response.status === 0));

    });
  };
}

export const updateAddressRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_UPDATE_ADDRESS_REQUEST });
    callApiToken(dispatch, 'user/addresses', 'PUT', data).then(response => {
      const type = response.status === 0 ? Types.USER_UPDATE_ADDRESS_SUCCESS : Types.USER_UPDATE_ADDRESS_FAIL;
      dispatch({ type, payload: response });
      dispatch(useAlert('Cập nhật địa chỉ', response.message, response.status === 0));
    });
  };
}

export const clearInformChangePhoneRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.CLEAR_INFORM_CHANHEPHONE });
  }
}

export const clearInform = () => {
  return (dispatch) => {
    dispatch({ type: Types.CLEAR_INFORM_CHANGEPASSWORD });
    dispatch({ type: Types.CLEAR_INFORM_CHANHEPHONE });
    dispatch({ type: Types.CLEAR_INFORM_PROFILE });
  }
}

export const deleteAddressRequest = (addressId) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_DELETE_ADDRESS_REQUEST });
    callApiToken(dispatch, `user/addresses/${addressId}`, 'DELETE', null).then(response => {
      let type = null;
      if (response.status === 0) {
        type = Types.USER_DELETE_ADDRESS_SUCCESS;
        response.data = addressId;
      }
      else
        type = Types.USER_DELETE_ADDRESS_FAIL;
      dispatch({ type, payload: response });
      dispatch(useAlert('Xóa địa chỉ', response.message, response.status === 0));
    });
  };
}