import React, {Component, memo} from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MessageItem from './components/MessageItem';
import {
  closeMessage,
  sendMessageToBot,
  sendMessageToUser,
  fectchMessagesRequest,
} from '../../../actions/messengerActions';
import Feather from 'react-native-vector-icons/Feather';
import {BOT_ID} from '../../../constants/MessengerData';

const isCloseToTop = ({contentOffset}) => {
  return contentOffset.y <= 20;
};

class DetailMessengerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: -1,
      content: '',
      lengthMessages: 0,
      currentPage: 1,
      pageSize: 10,
      firstFetch: false,
    };
  }

  componentDidMount() {
    const {index, messengers} = this.props.messengersReducer;
    if (index > -1 && !messengers[index].fetchMessages)
      this.props.fectchMessages(
        messengers[index]._id,
        this.state.pageSize,
        this.state.currentPage,
      );

    // this.setState({index, previousLength: messengers[index].messages.length});
    // this.scrollToElement(messengers[index].messages.length);
  }

  viewMore = () => {
    const {loading, index, messengers} = this.props.messengersReducer;
    if (index <= -1) return;
    const {pagingInfo} = messengers[index];
    if (
      pagingInfo &&
      loading === false &&
      pagingInfo.currentPage < pagingInfo.totalPage
    ) {
      this.props.fectchMessages(
        messengers[index]._id,
        this.state.pageSize,
        this.state.currentPage + 1,
      );
      this.setState({currentPage: this.state.currentPage + 1});
    }
  };

  onChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  onSend = () => {
    const userId = this.props.userInfoReducer.userInfo._id;
    const {messengers, index, to} = this.props.messengersReducer;
    const isCustomerCare =
      (!messengers[index].user1 || messengers[index].user1._id !== userId) &&
      (!messengers[index].user2 || messengers[index].user2._id !== userId);

    const content = this.state.content.trim();
    if (content && to && to._id === BOT_ID && !isCustomerCare)
      this.props.sendMessageToBot(content);
    else if (content)
      this.props.sendMessageToUser(to ? to._id : null, content, isCustomerCare);
    this.setState({content: ''});
  };

  // componentDidUpdate(prevProps) {
  //   if (
  //     prevProps.messengersReducer !== this.props.messengersReducer &&
  //     this.props.messengersReducer.loading === false
  //   ) {
  //     const {index, messengers} = this.props.messengersReducer;
  //     if (messengers[index].messages.length !== this.state.previousLength) {
  //       if (messengers[index].messages.length - this.state.previousLength === 1)
  //         this.scrollToElement(messengers[index].messages.length);
  //       this.setState({previousLength: messengers[index].messages.length});
  //     }
  //   }
  // }

  scrollToElement = count => {
    this.myScroll.scrollTo({x: 0, y: 100 * count, animated: true});
  };

  render() {
    const {messengers, to, index} = this.props.messengersReducer;
    const userId = this.props.userInfoReducer.userInfo._id;

    if (!messengers && index > -1) return <View></View>;

    const source = !to ? require('../../../assets/CSKH.jpg') : {uri: to.image};
    const messages = messengers ? messengers[index].messages : null;

    const messageItems = [];

    if (messages) {
      const currentUser =
        messengers[index].user1._id === userId ? 'user1' : 'user2';
      let showImage = false;
      const total = messages.length;
      for (let i = 0; i < total; i++) {
        let isReciver = false;
        if (currentUser !== messages[i].sender) {
          isReciver = true;
          if (
            i + 1 === total ||
            (i + 1 < total && currentUser === messages[i + 1].sender)
          )
            showImage = true;
          else showImage = false;
        } else showImage = false;
        messageItems.push(
          <MessageItem
            source={source}
            isReciver={isReciver}
            showImage={showImage}
            index={i}
            key={i}
            message={messages[i]}
          />,
        );
      }
    }
    return (
      <View style={styles.containerMain}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Ionicons
              style={{marginTop: 4}}
              name="arrow-back-sharp"
              size={25}
            />
          </TouchableOpacity>
          <Image
            style={{width: 40, height: 40, borderRadius: 20, marginLeft: 20}}
            source={source}
          />
          <Text style={styles.reciverName}>
            {!to ? 'Chăm sóc khách hàng' : to.name}
          </Text>
        </View>
        <ScrollView
          onScroll={({nativeEvent}) => {
            if (isCloseToTop(nativeEvent)) {
              this.viewMore();
            }
          }}
          ref={ref => (this.myScroll = ref)}
          onContentSizeChange={() => this.myScroll.scrollToEnd({animated: true})}>
          <View style={styles.messageContent}>
            {this.props.messengersReducer.loading ? (
              <View style={{width: '100%', height: 200}}></View>
            ) : null}
            {messageItems}
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            value={this.state.content}
            placeholder="Nhập tin nhắn"
            multiline={true}
            style={styles.input}
            onChangeText={text => this.onChange('content', text)}
          />
          <View style={{width: '11%'}}>
            <TouchableOpacity style={{marginLeft: 10}} onPress={this.onSend}>
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messageContent: {
    padding: 15,
  },
  header: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 0.2,
  },
  reciverName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  bottomView: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
  },
  bottom: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
    justifyContent: 'center',
    marginBottom: 50,
  },
  input: {
    height: 40,
    width: '89%',
    alignSelf: 'stretch',
    backgroundColor: '#F0F2F5',
    paddingLeft: 15,
    borderRadius: 40,
  },
});

const mapStateToProps = state => {
  return {
    messengersReducer: state.messengersReducer,
    userInfoReducer: state.userInfoReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fectchMessages: (mesengerId, pageSize, currentPage) =>
      dispatch(fectchMessagesRequest(mesengerId, pageSize, currentPage)),
    closeMessage: () => dispatch(closeMessage()),
    sendMessageToBot: content => dispatch(sendMessageToBot(content)),
    sendMessageToUser: (to, content, isCustomerCare) =>
      dispatch(sendMessageToUser(to, content, isCustomerCare)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(DetailMessengerScreen));
