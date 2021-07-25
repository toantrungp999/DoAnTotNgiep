import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {convertNumberToVND} from '../../../../extentions/ArrayEx';

class OrderDetailItem extends Component {
  render() {
    const {orderDetail, end} = this.props;
    return (
      <View style={[styles.container, end ? styles.end : null]}>
        <Image style={styles.img} source={{uri: orderDetail.image}} />
        <View style={styles.info}>
          <Text style={styles.name}>{orderDetail.name}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.type}>
              {orderDetail.color} - {orderDetail.size}{' '}
            </Text>
            <Text style={styles.quantity}>x{orderDetail.quantity}</Text>
          </View>
          <Text style={styles.price}>
            {convertNumberToVND(Number(orderDetail.price))}₫
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 0.3,
    borderTopColor: '#e3e3e3',
  },

  end: {
    // paddingBottom: 15,
    // marginBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#e3e3e3',
  },

  img: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  info: {
    flexGrow: 1,
    paddingRight: 5,
  },
  quantityContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  type: {
    color: '#2D2D2D',
  },
  quantity: {
    marginLeft: 'auto',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  price: {
    color: '#FF2100',
    width: '100%',
    textAlign: 'right',
  },
});

export default OrderDetailItem;
