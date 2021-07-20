import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { convertNumberToVND, formatDate } from './../../../../extentions/ArrayEx';
import OrderDetailItem from './OrderDetailItem';



class OrderItem extends Component {

    render() {
        const { order } = this.props;
        let totalQuantity = 0;
        order.orderDetails && order.orderDetails.map(detail => {
            totalQuantity += detail.quantity;
        })

        return (
            <TouchableOpacity style={styles.container}
                onPress={() => { this.props.navigation.push('orderDetailScreen', { _id: order.orderInfo._id }) }}>
                <View style={styles.infoContainer}>
                    <Text style={styles.id}>{order.orderInfo.orderId}</Text>
                    <Text style={styles.date}>{formatDate(order.orderInfo.date)}</Text>
                    <Text style={styles.status}>{order.orderInfo.status}</Text>
                </View>
                <View>
                    <OrderDetailItem orderDetail={order.orderDetails[0]} end={true} />
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.totalQuantity}>Tổng {totalQuantity} sản phẩm</Text>
                    <View style={styles.priceSection}>
                        {order.orderInfo.shippingFee !== 0 ? <Text style={styles.fee}>Phí vận chuyển: {convertNumberToVND(order.orderInfo.shippingFee)}₫</Text> : null}
                        <Text style={styles.total}>Tổng: <Text style={styles.price}>{convertNumberToVND(order.orderInfo.totalPrice)}₫</Text></Text>
                    </View>

                </View>
            </TouchableOpacity >

        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#ffffff',
        marginTop: 7,
        paddingLeft: 10,
        paddingRight: 10,
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 13
    },
    id: {
        marginRight: 8,
        paddingLeft: 8,
        paddingRight: 5,
        // borderRightWidth:0.3,
        // borderRightColor:'#aaaaaa'
        backgroundColor: '#eeeeee',
        borderRadius: 10,
        color: '#444444'
    },
    date: {
        color: '#777777'
    },
    status: {
        textTransform: 'uppercase',
        color: '#eb4934',
        marginLeft: 'auto',
        fontSize: 13
    },

    bottom: {
        paddingTop: 10,
        paddingBottom: 12,
        display:'flex',
        flexDirection:'row'
    },
    totalQuantity: {
        color: '#777777',
        textAlign: 'center',

    },
    priceSection:{
        flexGrow:1
    },
    fee: {
        color: '#777777',
        marginLeft: 'auto',
        fontSize: 14,
        marginBottom: 8
    },
    total: {
        fontSize: 15,
        marginLeft: 'auto'
    },
    price: {
        color: '#FF2100',
    }
})



export default (OrderItem);