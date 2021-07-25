import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {time_ago, removeVietnameseTones} from '../../../../extentions/ArrayEx';
class MessengerItem extends Component {
  render() {
    const {messenger, userId, isMeSend} = this.props;
    const isMessengerItemToAdmin =
      (!messenger.user1 || messenger.user1._id !== userId) &&
      (!messenger.user2 || messenger.user2._id !== userId)
        ? true
        : false;
    let image = null,
      name = null;
    if (isMessengerItemToAdmin) {
      image = {uri: messenger.user1?.image || messenger.user2.image};
      name = messenger.user1?.name || messenger.user2.name;
    } else {
      image =
        !messenger.user1 || !messenger.user2
          ? ''
          : {
              uri:
                messenger.user1._id === userId
                  ? messenger.user2.image
                  : messenger.user1.image,
            };
      name =
        !messenger.user1 || !messenger.user2
          ? 'Chăm sóc khác hàng'
          : messenger.user1._id === userId
          ? messenger.user2.name
          : messenger.user1.name;
    }

    if (
      !this.props.searchValue ||
      removeVietnameseTones(name.toLowerCase()).includes(this.props.searchValue)
    )
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.openDetailMessenger(
              this.props.index,
              messenger.user1._id === userId
                ? messenger.user2
                : messenger.user1,
            )
          }>
          <View style={styles.messengerItem}>
            <View style={{width: '18%'}}>
              <Image
                source={image || require('../../../../assets/CSKH.jpg')}
                style={{width: 60, height: 60, borderRadius: 30}}
              />
            </View>
            <View
              style={
                !isMeSend && messenger.check === false
                  ? styles.messengerContentNotSeen
                  : styles.messengerContent
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.name}>{name}</Text>
                {isMessengerItemToAdmin ? (
                  <Text style={{fontSize: 8, color: 'red'}}>
                    "Tin nhắn hệ thống"
                  </Text>
                ) : null}
              </View>
              <View style={styles.messengerValue}>
                <Text>
                  {isMeSend ? 'Bạn: ' : ''}
                  {messenger.messages[messenger.messages.length - 1].content.msg
                    .length <= 20
                    ? `${
                        messenger.messages[messenger.messages.length - 1]
                          .content.msg
                      }`
                    : `${messenger.messages[
                        messenger.messages.length - 1
                      ].content.msg.substring(0, 20)}...`}{' '}
                  · {time_ago(messenger.date)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    else return null;
  }
}

const styles = StyleSheet.create({
  messengerItem: {
    flexDirection: 'row',
    width: '100%',
    padding: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  messengerContent: {
    marginLeft: 14,
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: '300',
    width: '76%',
  },
  messengerContentNotSeen: {
    marginLeft: 14,
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    width: '76%',
  },
  messengerValue: {
    flexDirection: 'row',
    marginTop: 3,
    width: '100%',
  },
});

export default MessengerItem;
