import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import styles from './styles';
import Reply from './Reply';
import AddReply from './AddReply';
import {TextInput} from 'react-native-paper';
import {time_ago} from '../../../../../extentions/ArrayEx';
import Icon from 'react-native-vector-icons/Ionicons';

let filledIconName = 'ios-star';
let emptyIconName = 'ios-star-outline';
if (Platform.OS === 'android') {
  filledIconName = 'md-star';
  emptyIconName = 'md-star-outline';
}
const MAX_RATING = 5;

export default class Rate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rateId: '',
      productId: '',
      user: '',
      content: '',
      date: '',
      rate: 5,
      isEdit: false,
      isReply: false,
      oldContent: '',
    };
  }

  componentDidMount() {
    const {_id, productId, content, user, rate, date} = this.props.rate;
    this.setState({
      rateId: _id,
      content,
      user,
      date,
      rate,
      oldContent: content,
      productId,
    });
  }

  onDelete = () => {
    let {rateId, productId} = this.state;
    this.props.onDeleteRate({rateId, productId});
  };

  onShowReplyForm = () => {
    this.setState({isReply: !this.state.isReply});
  };

  onChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  onEditRate = () => {
    let {productId, rateId, rate, content} = this.state;
    content = content.trim();
    if (content) {
      this.props.onUpdateRate({productId, rateId, rate, content});
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
    const isUser =
      this.props.userInfo && this.state.user._id === this.props.userInfo._id;
    const elementReplies =
      this.props.rate && this.props.rate.replies
        ? this.props.rate.replies.map((reply, index) => {
            return (
              <Reply
                productId={this.state.productId}
                rateId={this.state.rateId}
                key={reply._id}
                reply={reply}
                index={index}
                userInfo={this.props.userInfo}
                onDeleteReply={this.props.onDeleteRateReply}
                onUpdateReply={this.props.onUpdateRateReply}
              />
            );
          })
        : null;
    let rangeView = [];
    for (let i = 0; i < MAX_RATING; i++) {
      rangeView.push(
        <TouchableOpacity
          onPress={() => {
            if (this.state.isEdit) this.onChange('rate', i + 1);
          }}
          key={i}
          id={i}>
          <Icon
            name={this.state.rate > i ? filledIconName : emptyIconName}
            size={14}
            color="#FFD700"
            style={styles.icon}
          />
        </TouchableOpacity>,
      );
    }
    return !this.state.isEdit ? (
      <View style={styles.row}>
        <View style={styles.img}>
          <Image source={{uri: this.state.user.image}} style={styles.avartar} />
        </View>
        <View style={styles.contentArea}>
          <View style={styles.content}>
            <View style={styles.star}>{rangeView}</View>
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
                  rateId={this.state.rateId}
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
            <View style={styles.AddRateStar}>{rangeView}</View>
            <TextInput
              value={this.state.content}
              style={styles.input}
              underlineColor="transparent"
              onChangeText={text => this.onChange('content', text)}
            />
          </View>
          <View style={styles.viewEditAction}>
            <TouchableOpacity onPress={this.onEditRate}>
              <Text style={styles.textActionEdit}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rowEdit}>
          <TouchableOpacity
            onPress={() =>
              this.setState({isEdit: false, content: this.state.oldContent})
            }>
            <Text style={styles.textActionEdit}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
