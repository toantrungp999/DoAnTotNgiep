import React, { Component } from 'react';
import { ScrollView, View, Text,TouchableOpacity , StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import OrderStatuses from '../../../../constants/OrderStatuses';

class SearchByStatus extends Component {

    render() { 
        const currentStatus=this.props.currentStatus;
        let statusBar = [];
        statusBar.push(
            <TouchableOpacity style={[styles.item,(currentStatus==='Tất cả'?styles.itemSelect:null)]}
            onPress={()=>{this.props.changeStatus('Tất cả')}}>
                <Text style={[styles.text,(currentStatus==='Tất cả'?styles.textSelect:null)]}>Tất cả</Text>
                </TouchableOpacity>
        )
        for (const [index, value] of Object.entries(OrderStatuses)) {
            let active = this.props.currentStatus === value ? 'active' : '';
            var dislayValue;
            switch (value) {
                case "Đang giao hàng":
                    dislayValue = "Đang giao";
                    break;
                case "Đã nhận hàng":
                    dislayValue = "Đã nhận";
                    break;
                case "Giao hàng thất bại":
                    dislayValue = "Thất bại";
                    break;
                default:
                    dislayValue = value;
                    break;
            }
            statusBar.push(
                <TouchableOpacity style={[styles.item,(currentStatus===value?styles.itemSelect:null)]}
                onPress={()=>{this.props.changeStatus(value)}}>
                    <Text style={[styles.text,(currentStatus===value?styles.textSelect:null)]}>{dislayValue}</Text>
                    </TouchableOpacity>
              
            )
        }
        return (
            <ScrollView style={styles.container}  horizontal={true} showsHorizontalScrollIndicator={false}>
                {statusBar}
            </ScrollView>
        );
    }
};



const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor:'#ffffff',

    },
    style:{
        marginLeft:0
    },
    item:{
        backgroundColor:'#ffffff',
        color:'#444444',
        paddingTop:10,
        paddingBottom:8,
        paddingLeft:10,
        paddingRight:10,
        minWidth:110,
     
    },
    itemSelect:{
        borderBottomWidth:2,
        borderColor:'#007be0'
    },
    text:{
        color:'#444444',
        fontSize:17,
        textAlign:'center'
    },
    textSelect:{
        color:'#007be0'
    }
})


export default (SearchByStatus);