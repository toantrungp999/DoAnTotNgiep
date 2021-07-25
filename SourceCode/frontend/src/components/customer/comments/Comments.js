import React, { Component } from "react";
import AddComment from "./AddComment";
import CommentItem from "./CommentItem";
import { Link } from "react-router-dom";
import "./Comment.css";
class Comments extends Component {
  render() {
    const {
      comments,
      createLoading,
      updateLoading,
      deleteLoading,
      createReplyLoading,
      updateReplyLoading,
      deleteReplyLoading,
      message,
    } = this.props.commentsReducer;
    const listComments = comments
      ? comments.map((comment, index) => {
          let { _id, content, user, date, replies } = comment;
          return (
            <CommentItem
              key={_id}
              index={index}
              updateLoading={updateLoading}
              updateReplyLoading={updateReplyLoading}
              deleteLoading={deleteLoading}
              deleteReplyLoading={deleteReplyLoading}
              createReplyLoading={createReplyLoading}
              commentId={_id}
              content={content}
              date={date}
              replies={replies}
              user={user}
              type="comment"
              userInfo={this.props.userInfo}
              productId={comment.productId}
              onCreateReply={this.props.onCreateReply}
              onUpdateComment={this.props.onUpdateComment}
              onDeleteComment={this.props.onDeleteComment}
              onUpdateCommentReply={this.props.onUpdateCommentReply}
              onDeleteCommentReply={this.props.onDeleteCommentReply}
            />
          );
        })
      : "";
    const textError = message ? (
      <span className="text-danger mt-10">{message}</span>
    ) : (
      ""
    );
    return (
      <div className="comment-component">
        <h4 className="">Bình luận</h4>
        <div className="">
          <div className="">
            {this.props.userInfo && !createLoading ? (
              <AddComment
                onCreateComment={this.props.onCreateComment}
                userInfo={this.props.userInfo}
              />
            ) : (
              ""
            )}
            {textError}
            {listComments}
          </div>
        </div>
        {this.props.totalCmt > this.props.lengthCmt ? (
          <Link
            to="#"
            style={{ fontSize: "14px" }}
            onClick={(e) => {
              e.preventDefault();
              this.props.viewMoreComments();
            }}
          >
            Xem thêm bình luận
          </Link>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Comments;
