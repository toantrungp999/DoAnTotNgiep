import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import { time_ago } from "./../../../extentions/ArrayEx";
class ReplyRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replyId: "",
      content: "",
      user: {},
      data: "",
      isEdit: false,
    };
  }

  componentDidMount() {
    const { _id, content, user, date } = this.props.reply;
    console.log(this.props.reply);
    this.setState({
      replyId: _id,
      content,
      user,
      date,
    });
  }

  onDelete = () => {
    let { replyId } = this.state;
    this.props.onDeleteRateReply({ replyId, rateId: this.props.rateId });
  };

  onShowEditForm = (e) => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onUpdateRateReply = () => {
    let { replyId, content } = this.state;
    content = content.trim();
    if (content) {
      this.props.onUpdateRateReply({
        rateId: this.props.rateId,
        replyId,
        content,
      });
      this.onShowEditForm();
    }
  };

  render() {
    const isUser =
      this.props.userInfo && this.state.user._id === this.props.userInfo._id;
    return (
      <div className="rate-item">
        <img
          className="avatar"
          alt={this.state.user.name}
          src={this.state.user.image}
        />
        <div className="rate-body">
          {!this.state.isEdit && !this.props.UpdateReplyLoading ? (
            <>
              <div className="main-content">
                <span className="name">
                  {this.state.user.name}
                  {this.state.user.role &&
                  this.state.user.role !== "customer" ? (
                    <span className="admin">Quản trị viên</span>
                  ) : (
                    ""
                  )}
                </span>
                <div className="rate-content">{this.state.content}</div>
              </div>

              <div className="reply">
                {isUser ? (
                  <Link
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      this.onShowEditForm();
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
                        window.confirm("Bạn có chắc muốn xóa phản hồi này?")
                      ) {
                        e.preventDefault();
                        this.onDelete();
                      }
                    }}
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
              <div className="form">
                <textarea
                  type="text"
                  className="form-control"
                  value={this.state.content}
                  onChange={this.onChange}
                  name="content"
                />
                <div className="btn-section">
                  <button
                    className="btn btn-save"
                    onClick={this.onUpdateRateReply}
                    type="button"
                  >
                    Lưu
                  </button>
                  <button
                    className="btn btn-close edit-rate"
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
        </div>
      </div>
    );
  }
}

export default memo(ReplyRate);
