import * as Types from "../constants/CommentActTypes";
import { findIndexById } from './../extentions/ArrayEx';

function commentsReducer(state = { loading: true }, action) {
    let comment;
    let index;
    switch (action.type) {
        case Types.COMMENTS_REQUEST:
            state.message = '';
            state.loading = true
            return { ...state };
        case Types.COMMENTS_SUCCESS:
            return { loading: false, comments: action.payload.data.comments, total: action.payload.data.total };
        case Types.COMMENTS_FAIL:
            return { loading: false, message: action.payload.message };
        case Types.COMMENT_CREATE_REQUEST:
            state.message = '';
            state.createLoading = true;
            return { ...state };
        case Types.COMMENT_CREATE_SUCCESS:
            state.createLoading = false;
            state.comments.unshift(action.payload.data);
            return { ...state };
        case Types.COMMENT_CREATE_FAIL:
            state.createLoading = false;
            state.createStatus = true;
            state.message = action.payload.message;
            return { ...state };
        case Types.COMMENT_UPDATE_REQUEST:
            state.message = '';
            state.updateLoading = true;
            return { ...state };
        case Types.COMMENT_UPDATE_SUCCESS:
            comment = action.payload.data;
            index = findIndexById(state.comments, comment._id);
            if (index >= 0)
                state.comments[index].content = comment.content;
            state.updateLoading = false;
            return { ...state };
        case Types.COMMENT_UPDATE_FAIL:
            state.updateLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.COMMENT_DELETE_REQUEST:
            state.message = '';
            state.deleteLoading = true;
            return { ...state };
        case Types.COMMENT_DELETE_SUCCESS:
            comment = action.payload.data;
            index = findIndexById(state.comments, comment.commentId);
            if (index >= 0) state.comments.splice(index, 1);
            state.deleteLoading = false;
            return { ...state };
        case Types.COMMENT_DELETE_FAIL:
            state.deleteLoading = false;
            state.message = action.payload.message;
            return { ...state };
        ///
        case Types.REPLY_CREATE_REQUEST:
            state.message = '';
            state.createReplyLoading = true;
            return { ...state };
        case Types.REPLY_CREATE_SUCCESS:
            state.createReplyLoading = false;
            comment = action.payload.data;
            index = findIndexById(state.comments, comment._id);
            if (index >= 0)
                state.comments[index] = comment;
            return { ...state };
        case Types.REPLY_CREATE_FAIL:
            state.createReplyLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.REPLY_UPDATE_REQUEST:
            state.message = '';
            state.updateReplyLoading = true;
            return { ...state };
        case Types.REPLY_UPDATE_SUCCESS:
            comment = action.payload.data;
            index = findIndexById(state.comments, comment._id);
            if (index >= 0)
                state.comments[index] = comment;
            state.updateReplyLoading = false;
            return { ...state };
        case Types.REPLY_UPDATE_FAIL:
            state.updateReplyLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.REPLY_DELETE_REQUEST:
            state.message = '';
            state.deleteReplyLoading = true;
            return { ...state };
        case Types.REPLY_DELETE_SUCCESS:
            state.deleteReplyLoading = false;
            var data = action.payload.data;
            index = findIndexById(state.comments, data.commentId);
            if (index >= 0) {
                var indexReply = findIndexById(state.comments[index].replies, data.replyId);
                if (indexReply >= 0)
                    state.comments[index].replies.splice(indexReply, 1);
            }
            return { ...state };
        case Types.REPLY_DELETE_FAIL:
            state.deleteReplyLoading = false;
            state.message = action.payload.message;
            return { ...state };
        default: return state;
    }
}

export { commentsReducer }