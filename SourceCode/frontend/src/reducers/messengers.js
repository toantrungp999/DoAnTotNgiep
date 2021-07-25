import * as Types from "../constants/MessengerActTypes";
import * as CHAT_BOT_TYPES from "../constants/ChatBotTypes";
import { findIndexById } from "../extentions/ArrayEx";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";

function messengersReducer(state = {}, action) {
  let index;
  switch (action.type) {
    case Types.MESSENGERS_REQUEST:
      return { loading: true };
    case Types.MESSENGERS_SUCCESS:
      const messengers = action.payload.data;
      const _messengers = [];
      for (let i = 0; i < messengers.length; i++) {
        messengers[i].message.content = formatContentMessage(
          messengers[i].message.type,
          messengers[i].message.content
        );
        _messengers.push({
          _id: messengers[i]._id,
          user1: messengers[i].user1,
          user2: messengers[i].user2,
          messages: [messengers[i].message],
          check: messengers[i].check,
          date: messengers[i].date,
          fetchMessages: false,
        });
      }
      return { loading: false, messengers: _messengers };
    case Types.MESSENGERS_FAIL:
      return { loading: false, message: action.payload.message };
    case Types.SEND_MESSAGE_REQUEST:
      state.loading = true;
      state.message = "";
      return { ...state };
    case Types.SEND_MESSAGE_SUCCESS:
      const { messenger } = action.payload;
      messenger.message.content = formatContentMessage(
        messenger.message.type,
        messenger.message.content
      );
      index = findIndexById(state.messengers, messenger._id);

      if (index > -1) {
        state.messengers[index].messages.push(messenger.message);
        state.messengers[index].date = messenger.date;
        state.messengers[index].check = false;
      } else {
        index = 0;
        state.messengers.unshift({
          _id: messenger._id,
          user1: messenger.user1,
          user2: messenger.user2,
          messages: [messenger.message],
          check: messenger.check,
          date: messenger.date,
          fetchMessages: false,
        });
      }

      const userInfo = Cookie.getJSON("userInfo") || null;
      if (!state.action && userInfo) {
        let to = null; //this.props.userInfoReducer.userInfo._id ===
        if (
          state.messengers[index].user1 &&
          state.messengers[index].user1._id !== userInfo._id
        ) {
          to = state.messengers[index].user1;
        } else if (
          state.messengers[index].user2 &&
          state.messengers[index].user2._id !== userInfo._id
        )
          to = state.messengers[index].user2;
        state.action = Types.OPEN_DETAIL_MESSENGER;
        state.to = to;
        state.index = index;
      }

      if (index > 0) {
        state.messengers.sort(function (a, b) {
          let c = new Date(a.date);
          let d = new Date(b.date);
          return d - c;
        });
        state.index = findIndexById(state.messengers, messenger._id);
      }

      state.loading = false;
      return { ...state };
    case Types.SEND_MESSAGE_FAIL:
      state.loading = false;
      state.indexReciver = -1;
      state.message = "Gủi tin nhắn thất bại!";
      return { ...state };

    case Types.FETCH_MESSAGES_REQUEST:
      state.loading = true;
      return { ...state };
    case Types.FETCH_MESSAGES_SUCCESS:
      const { messages, pagingInfo } = action.payload;
      const total = messages.length;
      if (total > 0) {
        index = findIndexById(state.messengers, messages[0].messengerId);
        if (index > -1) {
          //fetch lần đầu thì start tại độ dài hiện có của tin nhắn fetch thì thì start 0
          for (
            let i =
              state.messengers[index].fetchMessages === true
                ? 0
                : state.messengers[index].messages.length;
            i < total;
            i++
          ) {
            messages[i].content = formatContentMessage(
              messages[i].type,
              messages[i].content
            );
            state.messengers[index].messages.unshift(messages[i]);
          }
          state.messengers[index].pagingInfo = pagingInfo;
          state.messengers[index].fetchMessages = true;
        }
      }
      state.loading = false;
      return { ...state };
    case Types.FETCH_MESSAGES_FAIL:
      state.loading = false;
      return { ...state };
    case Types.CLEAR_MESSENGERS:
      return { loading: false };
    case Types.CLOSED_MESSAGE:
      state.action = "";
      state.index = -1;
      return { ...state };
    case Types.CREATE_NEW_MESSAGE:
      state.action = action.type;
      return { ...state };
    case Types.OPEN_DETAIL_MESSENGER:
      state.action = action.type;
      state.index = action.payload.index;
      state.to = action.payload.to;
      return { ...state };
    case Types.MESSENGER_UPDATE_CHECK:
      const { messengerId } = action.payload;

      index = findIndexById(state.messengers, messengerId);
      console.log(index);
      if (index > -1) state.messengers[index].check = true;
      return { ...state };
    default:
      return state;
  }
}

export { messengersReducer };

function formatContentMessage(type, content) {
  let listData = [];
  let msg = "";

  switch (type) {
    case CHAT_BOT_TYPES.ASK_BRANDS:
      msg = "Cửa hàng chúng tôi hiện đang kinh doanh các hãng sau:";
      listData = content
        ? content.map((data, index) => {
            return (
              <Link
                className="message-link"
                index={index}
                to="#"
                key={data._id}
              >
                {data.name}
              </Link>
            );
          })
        : null;
      listData.push(
        <Link key={listData.length} to="#">
          ...
        </Link>
      );
      break;
    case CHAT_BOT_TYPES.ASK_CATEGORIES:
      msg = "Cửa hàng chúng tôi hiện đang kinh doanh các loại sản phẩm sau:";
      listData = content
        ? content.map((data, index) => {
            return (
              <Link
                className="message-link"
                index={index}
                to="#"
                key={data._id}
              >
                {data.name}
              </Link>
            );
          })
        : null;
      listData.push(
        <Link key={listData.length} to="#">
          ...
        </Link>
      );
      break;
    case CHAT_BOT_TYPES.ASK_BEST_VIEW:
      msg = "Sản phảm có tên: ";
      listData = (
        <div>
          <Link to={`/detail/${content._id}`}>
            <div>{content.name} </div>
            <img
              alt={type}
              className="img-message-content"
              src={content.images[0]}
            />
          </Link>
          có hơn {content.numberVisit} lượt đã truy cập.
        </div>
      );
      break;
    case CHAT_BOT_TYPES.ASK_BEST_RATE:
      msg = "Sản phảm có tên: ";
      listData = (
        <div>
          <Link to={`/detail/${content._id}`}>
            <div>{content.name} </div>
            <img
              alt={type}
              className="img-message-content"
              src={content.images[0]}
            />
          </Link>
          có hơn {content.numberRate} lượt đánh giá với số điểm trung bình là{" "}
          {content.avgRate}.
        </div>
      );
      break;
    case CHAT_BOT_TYPES.ASK_BEST_SELL:
      msg = "Sản phảm có tên: ";
      listData = (
        <div>
          <Link to={`/detail/${content._id}`}>
            <div>{content.name}</div>
            <img
              alt={type}
              className="img-message-content"
              src={content.images[0]}
            />
          </Link>
          có hơn {content.numberBuy} lượt mua hàng.
        </div>
      );
      break;
    case CHAT_BOT_TYPES.ASK_PRODUCT:
      msg = "Sản phảm có tên: ";
      let msgTmp = "";
      if (content.quantityOptions) {
        for (let i = 0; i < content.quantityOptions.length - 1; i++) {
          msgTmp += `màu ${content.quantityOptions[i].color} và size ${content.quantityOptions[i].size} có số lượng hiện có: ${content.quantityOptions[i].quantity}, `;
        }
      }
      if (content.quantityOptions.length - 1 >= 0)
        msgTmp += `màu ${
          content.quantityOptions[content.quantityOptions.length - 1].color
        } và size ${
          content.quantityOptions[content.quantityOptions.length - 1].size
        } có số lượng hiện có: ${
          content.quantityOptions[content.quantityOptions.length - 1].quantity
        }`;
      listData = (
        <div>
          <Link to={`/detail/${content.product._id}`}>
            <div>{content.product.name}</div>
            <img
              alt={type}
              className="img-message-content"
              src={content.product.images[0]}
            />
          </Link>
          {msgTmp}
          {content.infoMore}
        </div>
      );
      break;
    case CHAT_BOT_TYPES.ASK_LOW_DELIVERY:
      break;
    case CHAT_BOT_TYPES.ASK_HOW_TO_BUY:
      msg = (
        <div>
          Để đặt hàng quý khách cần{" "}
          <Link to={"/account/profile"}>
            (cập nhật đủ thông tin cá nhân nếu chưa cập nhật{" "}
          </Link>
          . Sau đó truy cập vào sản phẩm và nhấn mua hàng. Nếu muốn mua sản phẩm
          đã có sản phẩm trong{" "}
          <Link to="/cart">giỏ hàng vui lòng nhấn vào đây</Link> và nhấn mua
          hàng
        </div>
      );
      break;
    default:
      msg = content;
      break;
  }
  return { msg, listData };
}
