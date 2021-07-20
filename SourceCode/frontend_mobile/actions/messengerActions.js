import * as Types from "../constants/MessengerActTypes";
import { SERVER_URL } from "../constants/Config";
import { callApiToken } from '../utils/apiCaller';
import io from 'socket.io-client';

const socket = io(SERVER_URL);
let userId;

export const initialization = () => {
  return (dispatch) => {
    socket.on('sendMessageToBot', (response) => { dispatch(reciverMessage(response)) });
    socket.on('sendMessageToUser', (response) => { dispatch(reciverMessage(response)) });
    socket.on('login', (response) => { receiveMessage(response); });
    socket.on('updateMessengerCheck', (response) => { dispatch(updateMessengerSuccess(response)) });
    socket.on('sokectError', (response) => { dispatch(sokectError(response)) });
    socket.on('senMessageFail', (response) => { dispatch(senMessageFail(response)) });
  }
}

export const login = (accessToken, _userId) => {
  userId = _userId;
  socket.emit("login", accessToken);
}

export const receiveMessage = (response) => {
  console.log(response);
}


export const sendMessageToUser = (to, content, isCustomerCare) => {
  return (dispatch) => {
    dispatch({ type: Types.SEND_MESSAGE_REQUEST });
    socket.emit("sendMessageToUser", { to, content, isCustomerCare });
  }
}

export const senMessageFail = () => {
  return (dispatch) => {
    dispatch({ type: Types.SEND_MESSAGE_FAIL });
  }
}

export const updateMessengerCheck = (messengerId) => {
  socket.emit("updateMessengerCheck", { messengerId });
}

export const updateMessengerSuccess = (response) => {
  return (dispatch) => {
    dispatch({ type: Types.MESSENGER_UPDATE_CHECK, payload: response });
  }
}

export const reciverMessage = (response) => {
  return (dispatch) => {
    dispatch({ type: Types.SEND_MESSAGE_SUCCESS, payload: { result: response.result, userId } });
  }
}

export const sendMessageToBot = (content) => {
  return (dispatch) => {
    dispatch({ type: Types.SEND_MESSAGE_REQUEST });
    socket.emit("sendMessageToBot", { content });
  }
}

export const sokectError = (response) => {
  return (dispatch) => {
    switch (response.code) {
      case Types.CODE_SOCKET_SEND_MESSAGE_FAIL:
        dispatch({ type: Types.SEND_MESSAGE_FAIL });
        break;
      default:
        return;
    }
  }
}

export const logoutFromSocket = () => {
  return (dispatch) => {
    socket.emit("logout", {});
    dispatch({ type: Types.CLEAR_MESSENGERS });
  }
}



export const fectchMessengersRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.MESSENGERS_REQUEST });
    callApiToken(dispatch, 'messengers', 'GET', null).then(response => {
      const type = response.status === 0 ? Types.MESSENGERS_SUCCESS : Types.MESSENGERS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const fectchMessagesRequest = (messengerId, pageSize, currentPage) => {
  return (dispatch) => {
    dispatch({ type: Types.FETCH_MESSAGES_REQUEST });
    callApiToken(dispatch, `messages/messengerId=${messengerId}&pageSize=${pageSize}&currentPage=${currentPage}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.FETCH_MESSAGES_SUCCESS : Types.FETCH_MESSAGES_FAIL;
      dispatch({ type, payload: response.data });
    });
  };
}

export const createNewMessage = () => {
  return (dispatch) => {
    dispatch({ type: Types.CREATE_NEW_MESSAGE });
  };
}

export const openDetailMessenger = (index, to) => {
  return (dispatch) => {
    dispatch({ type: Types.OPEN_DETAIL_MESSENGER, payload: { index, to } });
  };
}

export const closeMessage = () => {
  return (dispatch) => {
    dispatch({ type: Types.CLOSED_MESSAGE });
  };
}