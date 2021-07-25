import React, { Component } from "react";
import { Link } from "react-router-dom";
import { time_ago } from "./../../../extentions/ArrayEx";
class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentId: "",
      replyId: "",
      index: "",
      content: "",
      type: "",
      reply: "",
      isEdit: false,
      isReply: false,
      oldContent: "",
      firstReplySubmit: false,
    };
  }

  componentDidMount() {
    const { commentId, content, user, date, type } = this.props;
    this.setState({
      commentId,
      content,
      user,
      date,
      type,
      oldContent: content,
    });
    if (this.props.type === "comment") {
      const { replies } = this.props;
      this.setState({ replies });
    } else {
      const { replyId } = this.props;
      this.setState({ replyId });
    }
  }

  onDelete = () => {
    const { commentId, replyId, type } = this.state;
    if (type === "comment")
      this.props.onDeleteComment({
        commentId,
        productId: this.props.productId,
      });
    else
      this.props.onDeleteCommentReply({
        commentId,
        replyId,
        productId: this.props.productId,
      });
  };

  onShowReplyForm = () => {
    const { type } = this.state;
    if (type === "comment") {
      this.setState({
        isReply: !this.state.isReply,
        reply: "",
        firstReplySubmit: false,
      });
    }
  };

  onShowEditForm = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
    if (this.state.isEdit) {
      this.setState({
        content: this.state.oldContent,
      });
    }
  };

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onEditComment = () => {
    let { commentId, replyId, type, content } = this.state;
    content = content.trim();
    if (content) {
      if (type === "comment")
        this.props.onUpdateComment({ commentId, content });
      else this.props.onUpdateCommentReply({ commentId, replyId, content });
      this.onShowEditForm();
    }
  };

  onCreateReply = () => {
    let { commentId, reply } = this.state;
    reply = reply.trim();
    if (reply) {
      this.props.onCreateReply({ commentId, reply });
      this.onShowReplyForm();
      this.setState({ reply: "" });
    }
    this.setState({ firstReplySubmit: true });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps && this.state.type === "comment") {
      const { replies } = nextProps;
      if (replies) {
        this.setState({ replies });
      }
    }
  }

  render() {
    const isUser =
      this.props.userInfo && this.props.user._id === this.props.userInfo._id;
    const elementReplies =
      this.state.type === "comment" && this.state.replies
        ? this.state.replies.map((reply, index) => {
            const { _id, content, user, date } = reply;
            return (
              <CommentItem
                key={_id}
                index={index}
                productId={this.props.productId}
                commentId={this.props.commentId}
                replyId={_id}
                content={content}
                date={date}
                user={user}
                type="reply"
                userInfo={this.props.userInfo}
                onUpdateCommentReply={this.props.onUpdateCommentReply}
                onDeleteCommentReply={this.props.onDeleteCommentReply}
              />
            );
          })
        : "";
    return (
      <div className="comment-item parent">
        <img
          className="avatar"
          alt={this.props.user.name}
          src={this.props.user.image}
        />
        <div className="comment-body">
          {!this.state.isEdit &&
          !this.props.UpdateReplyLoading &&
          !this.props.updateLoading ? (
            <div>
              <div className="main-content">
                <span className="name">
                  {this.props.user.name}
                  {this.props.user.role &&
                  this.props.user.role !== "customer" ? (
                    <span className="admin">Quản trị viên</span>
                  ) : null}
                </span>
                <span className="comment-content">{this.state.content}</span>
              </div>
              <div className="reply">
                {this.props.userInfo && this.state.type === "comment" ? (
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
                <span className="">{time_ago(this.props.date)}</span>
              </div>
            </div>
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
                    onClick={this.onEditComment}
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
            <div className="comment-item">
              <img
                className="avatar"
                alt={this.props.userInfo.name}
                src={this.props.userInfo.image}
              />
              <div className="comment-body">
                <div className="form">
                  <textarea
                    type="text"
                    className="form-control"
                    name="reply"
                    value={this.state.reply}
                    onChange={this.onChange}
                    placeholder="Trả lời"
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

export default CommentItem;
