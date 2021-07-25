import React, {Component} from 'react';
import {View, Image, Text, TouchableOpacity, Alert} from 'react-native';
import styles from './styles';
import Reply from './Reply';
import AddReply from './AddReply';
import {TextInput} from 'react-native-paper';
import {time_ago} from '../../../../../extentions/ArrayEx';

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentId: '',
      user: '',
      content: '',
      reply: '',
      date: '',
      isEdit: false,
      isReply: false,
      oldContent: '',
    };
  }

  componentDidMount() {
    const {commentId, content, user, date} = this.props;
    this.setState({
      commentId,
      content,
      user,
      date,
      oldContent: content,
    });
  }

  onDelete = () => {
    let {commentId} = this.state;
    this.props.onDeleteComment({commentId, productId: this.props.productId});
  };

  onShowReplyForm = () => {
    this.setState({isReply: !this.state.isReply});
  };

  onChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  onEditComment = () => {
    let {commentId, content} = this.state;
    content = content.trim();
    if (content) {
      this.props.onUpdateComment({commentId, content});
      this.setState({
        isEdit: !this.state.isEdit,
      });
    }
  };

  prepareToDelete = () => {
    Alert.alert('Cảnh báo', 'Bạn muốn xóa bình luận này', [
      {
        text: 'Đồng ý',
        onPress: () => this.onDelete(),
      },
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  render() {
    var isUser =
      this.props.userInfo && this.state.user._id === this.props.userInfo._id;
    var elementReplies = this.props.replies
      ? this.props.replies.map((reply, index) => {
          return (
            <Reply
              productId={this.props.productId}
              commentId={this.state.commentId}
              key={reply._id}
              reply={reply}
              index={index}
              userInfo={this.props.userInfo}
              onDeleteReply={this.props.onDeleteCommentReply}
              onUpdateCommentReply={this.props.onUpdateCommentReply}
            />
          );
        })
      : null;
    return !this.state.isEdit ? (
      <View style={styles.row}>
        <View style={styles.img}>
          <Image source={{uri: this.state.user.image}} style={styles.avartar} />
        </View>
        <View style={styles.contentArea}>
          <View style={styles.content}>
            <Text style={styles.name}>
              {this.state.user.name && this.state.user.name}
            </Text>
            <Text style={styles.text}>{this.state.content}</Text>
          </View>
          <View style={styles.areaAction}>
            <Text style={styles.textAction}>{time_ago(this.state.date)}</Text>
            {isUser && (
              <TouchableOpacity onPress={() => this.setState({isEdit: true})}>
                <Text style={styles.textAction}>Chỉnh sửa</Text>
              </TouchableOpacity>
            )}
            {this.props.userInfo && (
              <TouchableOpacity onPress={this.onShowReplyForm}>
                <Text style={styles.textAction}>Phản hồi</Text>
              </TouchableOpacity>
            )}
            {isUser && (
              <TouchableOpacity onPress={this.prepareToDelete}>
                <Text style={styles.textAction}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.areaAction}>
            <View style={{width: '100%'}}>
              {this.state.isReply && (
                <AddReply
                  commentId={this.state.commentId}
                  onShowReplyForm={this.onShowReplyForm}
                  onCreateReply={this.props.onCreateReply}
                />
              )}
              {elementReplies}
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View>
        <View style={styles.row}>
          <View style={styles.editComent}>
            <TextInput
              value={this.state.content}
              style={styles.input}
              underlineColor="transparent"
              onChangeText={text => this.onChange('content', text)}
            />
          </View>
          <View style={styles.viewEditAction}>
            <TouchableOpacity onPress={this.onEditComment}>
              <Text style={styles.textAction}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rowEdit}>
          <TouchableOpacity
            onPress={() =>
              this.setState({isEdit: false, content: this.state.oldContent})
            }>
            <Text style={styles.textAction}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
