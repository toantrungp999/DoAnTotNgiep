import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import { time_ago } from "./../../../extentions/ArrayEx";
import ReplyRate from "./ReplyRate";

class RatetItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rateId: "",
      replyId: "",
      user: "",
      rate: 5,
      content: "",
      type: "",
      reply: "",
      replies: "",
      isEdit: false,
      isReply: false,
      oldrRate: 5,
      oldContent: "",
      rateTmp: -1,
      firstReplySubmit: false,
    };
  }

  componentDidMount() {
    var { _id, rate, content, user, date, type, replies } = this.props.rate;
    this.setState({
      rateId: _id,
      rate: rate,
      oldRate: rate,
      oldContent: content,
      content,
      user,
      date,
      type,
      replies,
    });
  }

  onDelete = () => {
    let { rateId } = this.state;
    this.props.onDeleteRate({ rateId, productId: this.props.rate.productId });
  };

  onShowReplyForm = () => {
    this.setState({
      isReply: !this.state.isReply,
      reply: "",
      firstReplySubmit: false,
    });
  };

  onShowEditForm = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
    if (this.state.isEdit) {
      this.setState({
        rate: this.state.oldRate,
        content: this.state.oldContent,
        rateTmp: -1,
      });
    }
  };

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onEditRate = () => {
    let { rateId, rate, content } = this.state;
    content = content.trim();
    if (content) {
      this.props.onUpdateRate({
        productId: this.props.rate.productId,
        rateId,
        rate,
        content,
      });
      this.setState({
        isEdit: !this.state.isEdit,
      });
    }
  };

  onCreateReply = () => {
    let { rateId, reply } = this.state;
    reply = reply.trim();
    if (reply) {
      this.props.onCreateRateReply({ rateId, reply });
      this.onShowReplyForm();
      this.setState({ reply: "" });
    }
    this.setState({ firstReplySubmit: true });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (nextProps.rate) {
        const { replies } = nextProps.rate;
        this.setState({
          replies,
        });
      }
    }
  }

  chooseRate = (index) => {
    if (this.state.isEdit && this.state.rate !== index)
      this.setState({ rate: index });
  };

  chooseRateTmp = (index) => {
    if (this.state.isEdit && this.state.rateTmp !== index)
      this.setState({ rateTmp: index });
  };

  render() {
    var isUser =
      this.props.userInfo && this.state.user._id === this.props.userInfo._id;
    var elementReplies = this.state.replies
      ? this.state.replies.map((reply, index) => {
          return (
            <ReplyRate
              rateId={this.state.rateId}
              key={reply._id}
              reply={reply}
              index={index}
              userInfo={this.props.userInfo}
              onDeleteRateReply={this.props.onDeleteRateReply}
              onUpdateRateReply={this.props.onUpdateRateReply}
            />
          );
        })
      : "";

    let elementRates = [];
    for (let i = 1; i <= 5; i++) {
      elementRates.push(
        <i
          key={i}
          onMouseLeave={() => this.chooseRateTmp(-1)}
          onMouseEnter={() => this.chooseRateTmp(i)}
          className={
            "fas fa-star rate-star " +
            (i >
            (this.state.rateTmp !== -1 ? this.state.rateTmp : this.state.rate)
              ? "rate-not-check"
              : "rate-check")
          }
          onClick={() => this.chooseRate(i)}
        ></i>
      );
    }

    return (
      <div className="rate-item parent">
        <img
          className="avatar"
          alt={this.state.user.name}
          src={this.state.user.image}
        />
        <div className="rate-body">
          {!this.state.isEdit ? (
            <>
              <div className="main-content">
                <span className="name">{this.state.user.name}</span>
                <div style={{ marginBottom: "3px" }}>{elementRates}</div>
                <div className="rate-content">{this.state.content}</div>
              </div>

              <div className="reply">
                {this.props.userInfo ? (
                  <Link
                    to="#"
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      this.onShowReplyForm();
                    }}
                  >
                    <span>Trả lời</span>
                  </Link>
                ) : (
                  ""
                )}
                {isUser ? (
                  <Link
                    to="#"
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      this.onShowEditForm(e);
                    }}
                  >
                    Chỉnh sửa
                  </Link>
                ) : (
                  ""
                )}
                {isUser ? (
                  <Link
                    className=""
                    onClick={(e) => {
                      if (
                        window.confirm("Bạn có chắc muốn xóa bình luận này?")
                      ) {
                        e.preventDefault();
                        this.onDelete();
                      }
                    }}
                    to="#"
                  >
                    <span>Xóa</span>
                  </Link>
                ) : (
                  ""
                )}
                <span className="">{time_ago(this.state.date)}</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "3px" }}>{elementRates}</div>

              <div className="form">
                <textarea
                  type="textarea"
                  className="form-control"
                  value={this.state.content}
                  onChange={this.onChange}
                  name="content"
                />
                <div className="btn-section">
                  <button
                    className="btn btn-save"
                    onClick={this.onEditRate}
                    type="button"
                  >
                    Lưu
                  </button>
                  <button
                    className="btn btn-close"
                    onClick={this.onShowEditForm}
                    type="button"
                  >
                    Hủy
                  </button>
                </div>
              </div>
              <div className="text-left invalid-message">
                {this.state.content.trim().length === 0
                  ? "Chưa nhập nội dung"
                  : ""}
              </div>
            </>
          )}
          {elementReplies}
          {this.state.isReply && !this.props.CreateReplyLoading ? (
            <div className="rate-item">
              <img
                className="avatar"
                alt={this.props.userInfo.name}
                src={this.props.userInfo.image}
              />
              <div className="rate-body">
                <div className="form">
                  <textarea
                    type="text"
                    className="form-control"
                    name="reply"
                    value={this.state.reply}
                    onChange={this.onChange}
                    placeholder="Phản hồi đánh giá này"
                  />
                  <div className="btn-section">
                    <button
                      className="btn btn-save"
                      onClick={this.onCreateReply}
                      type="button"
                    >
                      Lưu
                    </button>
                    <button
                      className="btn btn-close"
                      onClick={this.onShowReplyForm}
                      type="button"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
                <div className="text-left invalid-message">
                  {this.state.firstReplySubmit &&
                  this.state.reply.trim().length === 0
                    ? "Chưa nhập nội dung"
                    : ""}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default memo(RatetItem);
