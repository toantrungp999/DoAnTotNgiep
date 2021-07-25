import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import styles from './styles';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

let filledIconName = 'ios-star';
let emptyIconName = 'ios-star-outline';
if (Platform.OS === 'android') {
  filledIconName = 'md-star';
  emptyIconName = 'md-star-outline';
}
const MAX_RATING = 5;

export default class AddRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 5,
      content: '',
    };
  }

  onChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    let {content, rate} = this.state;
    content = content.trim();
    if (content) {
      this.props.onCreateRate(
        {content, rate},
        {
          _id: this.props.userInfo._id,
          name: this.props.userInfo.name,
          image: this.props.userInfo.image,
          role: this.props.userInfo.role,
        },
      );
      this.setState({
        content: '',
        rate: 5,
      });
    }
  };

  render() {
    let rangeView = [];
    for (let i = 0; i < MAX_RATING; i++) {
      rangeView.push(
        <TouchableOpacity
          onPress={() => {
            this.onChange('rate', i + 1);
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
    return (
      <View style={styles.row}>
        <View style={styles.addRate}>
          <View style={styles.AddRateStar}>{rangeView}</View>
          <TextInput
            style={styles.input}
            underlineColor="transparent"
            onChangeText={text => this.onChange('content', text)}
          />
        </View>
        <View style={styles.viewSend}>
          <TouchableOpacity onPress={this.onSubmit}>
            <Text style={styles.sendAddReteBtn}>Đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
