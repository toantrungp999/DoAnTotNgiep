import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { REPLIED_COMMENT, APPROVAL, REPLIED_RATE, CANCELED_ORDER } from '../../../constants/NotificationActTypes';
import { fectchNotificationsRequest, updateNotificationRequest, clearNotify } from '../../../actions/notifacationActions';
import { time_ago } from '../../../extentions/ArrayEx';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - 20;
};

class NotificationsScreen extends Component {

  viewMore = () => {
    const { loading, pagingInfo } = this.props.notificationsReducer;
    if (loading === false && pagingInfo && pagingInfo.currentPage < pagingInfo.totalPage)
      this.props.fectchNotifications(7, pagingInfo.currentPage + 1);
  }

  render() {
    const { notifications } = this.props.notificationsReducer;
    let count = 0;
    const notificationsElement = notifications && notifications.length > 0 ? notifications.map((notification, index) => {
      let action = null;
      switch (notification.action) {
        case REPLIED_COMMENT:
          action = { url: 'DetailProductScreen', data: { id: notification.target.product._id }, name: notification.performedBy.name, content: ` đã phản hồi bình luận của bạn` };
          break;
        case APPROVAL:
          action = { url: '', data: {}, name: 'Người quản lí', content: ` đã duyệt đơn hàng của bạn` };
          break;
        case REPLIED_RATE:
          action = { url: 'DetailProductScreen', data: { id: notification.target.product._id }, name: notification.performedBy.name, content: ` đã phản hồi đánh giá của bạn` };
          break;
        case CANCELED_ORDER:
          action = { url: '', data: {}, name: 'Người quản lí', content: ` đã hủy đơn hàng của bạn` };
          break;
        default: break;
      }
      if (!action)
        return null;
      else {
        if (!notification.check)
          count++;
        return <TouchableOpacity
          style={notification.check === true ? styles.notify : styles.notifyNotCheck} key={notification._id} index={index}
          onPress={() => { this.props.updateNotification(notification._id); this.props.navigation.navigate(action.url, action.data); }}>
          <View style={{ width: '23%' }}>
            <Image style={styles.image} source={{ 'uri': notification.performedBy.image }} />
          </View>
          <View style={{ width: '77%' }}>
            <View style={styles.row}>
              <Text style={styles.textBold}>{action.name}</Text><Text style={styles.text}>{action.content}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.time}>{time_ago(notification.date)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      }
    }) : null;
    return (
      <ScrollView style={{ width: '100%' }} onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          console.log('có nek');
          this.viewMore();
        }
      }}
      >
        <View style={styles.header}>
          <Text style={styles.textHeader}>Thông báo</Text>
        </View>
        {notificationsElement}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row', width: '100%',
    padding: 15
  },
  textHeader: {
    fontSize: 24,
    marginLeft: 2
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  horizontalLine: {
    flexDirection: 'row', width: '100%', borderBottomColor: 'black', borderBottomWidth: .3, opacity: 0.5, marginTop: 20, marginBottom: 12
  },
  row: {
    flexDirection: 'row', width: '100%',
    marginTop: 8
  },
  notify: {
    flexDirection: 'row', width: '100%', padding: 10
  },
  notifyNotCheck: {
    backgroundColor: 'rgb(231,243,255)',
    flexDirection: 'row', width: '100%', padding: 10
  },
  image: {
    borderRadius: 32,
    width: 65,
    height: 65,
    marginLeft: 4
  },
  text: {
    fontSize: 14, fontWeight: '600'
  },
  textBold: {
    fontSize: 14, fontWeight: 'bold'
  },
  time: {
    fontSize: 12, fontWeight: '200', marginTop: 1
  },
  viewMore: {
    fontSize: 12,
    color: 'rgb(0,119,212)',
    marginLeft: 10,
  },
})

const mapStateToProps = state => {
  return {
    notificationsReducer: state.notificationsReducer
  }
}

const mapDispatchToProps = dispatch => ({
  fectchNotifications: (pageSize, page) => dispatch(fectchNotificationsRequest(pageSize, page)),
  updateNotification: (_id) => dispatch(updateNotificationRequest(_id)),
  clearNotify: () => dispatch(clearNotify)
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);
