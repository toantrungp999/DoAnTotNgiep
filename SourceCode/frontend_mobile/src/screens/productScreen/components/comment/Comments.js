import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import Comment from './Comment';
import AddComment from './AddComment';

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { comments, createLoading, updateLoading, deleteLoading,
            createReplyLoading, updateReplyLoading, deleteReplyLoading } = this.props.commentsReducer;
        const listComments = comments ? comments.map((comment, index) => {
            let { _id, content, user, date, replies } = comment;
            return <Comment key={_id} index={index}
                productId={this.props.productId}
                updateLoading={updateLoading} updateReplyLoading={updateReplyLoading}
                deleteLoading={deleteLoading} deleteReplyLoading={deleteReplyLoading} createReplyLoading={createReplyLoading}
                commentId={_id} content={content} date={date} replies={replies} user={user} productId={comment.productId}
                userInfo={this.props.userInfo}
                onCreateReply={this.props.onCreateReply}
                onUpdateComment={this.props.onUpdateComment} onDeleteComment={this.props.onDeleteComment}
                onUpdateCommentReply={this.props.onUpdateCommentReply} onDeleteCommentReply={this.props.onDeleteCommentReply}
            />
        }) : null;
        return (
            <View style={styles.container}>
                {this.props.userInfo && !createLoading ? <AddComment onCreateComment={this.props.onCreateComment} userInfo={this.props.userInfo} /> : null}
                {listComments}
                {this.props.totalCmt > this.props.lengthCmt && <View style={styles.row}><TouchableOpacity onPress={this.props.viewMoreComments}><Text style={styles.textAction}>Xem thêm bình luận</Text></TouchableOpacity></View>}
            </View>
        );
    }
}