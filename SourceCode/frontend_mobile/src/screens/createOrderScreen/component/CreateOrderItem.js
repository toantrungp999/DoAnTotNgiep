import React, { Component } from 'react';
import { convertNumberToVND } from '../../../../extentions/ArrayEx';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';

class CreateOrderItem extends Component {

    render() {
        const { cart } = this.props;
        const { colorId, sizeId, quantity } = cart;
        const { price, saleOff, name } = colorId.productId;
        return (
            <View style={styles.container}>
                <Image
                    style={styles.img}
                    source={{ uri: colorId.image }} />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.type}>{colorId.color} - {sizeId.size} </Text>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.price}>{convertNumberToVND(Number(price) - Number(saleOff))}₫</Text>
                        <Text style={styles.quantity}>x{quantity}</Text>
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: 'row',
        backgroundColor:'#ffffff',
        marginLeft:'2%',
        paddingTop:8,
        paddingBottom:8,
        width:'96%',
        borderBottomWidth:1,
        borderColor:'#dddddd'
    },
    img: {
        width: 80,
        height: 80,
        marginRight:10
    },
    info:{
        flexGrow:1,
        paddingRight:5
    },
    quantityContainer:{
        display:'flex',
        flexDirection:'row'
    },
    type:{
        color:'#2D2D2D'
    },
    quantity:{
        marginLeft:'auto',
    },
    name:{
        fontSize:15,
        fontWeight:'bold'
        
    },
    price:{
        color:'#FF2100'
    }
});



export default (CreateOrderItem);