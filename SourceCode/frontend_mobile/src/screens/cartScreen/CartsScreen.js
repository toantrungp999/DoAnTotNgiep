import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  updateCartRequest, deleteCartRequest
} from '../../../actions/cartActions';
import { showAlertWithTimeout } from '../../../actions/alertActions';

import CartItem from './components/cart/CartItem';
import { convertNumberToVND } from '../../../extentions/ArrayEx';
import { RadioButton } from 'react-native-paper';

class CartsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
      selectAll: false,
      isVisible: false
    }
  }

  onShowModel = () => {
    this.setState({ isVisible: !this.state.isVisible });
  }

  onUpdateSelectedList = (_id, status) => {
    const selected = this.state.selectedList;
    for (const index in selected) {
      if (selected[index] === _id)
        selected.splice(index, 1)
    }
    if (status === true) {
      selected.push(_id);
    }
    let selectAll = selected.length === this.props.cartsReducer.carts.length ? true : false;
    this.setState({
      selectedList: selected,
      selectAll: selectAll
    })
  }

  onCheckAll = () => {
    let selected;
    if (this.state.selectAll) {
      selected = [];
    } else {
      let carts = this.props.cartsReducer.carts;
      selected = [];
      selected = carts ? carts.map((cart, index) => {
        return cart._id;
      }) : [];
    }
    this.setState({
      selectAll: !this.state.selectAll,
      selectedList: selected
    });
  }

  onBuy = () => {
    const selectedList = this.state.selectedList;
    if (selectedList.length === 0) {
      this.props.showAlertWithTimeout('Đặt hàng thất bại', 'Vui lòng chọn sản phẩm', false);

    } else {
      let validQuantity = true;
      let carts = this.props.cartsReducer.carts;
      carts.forEach(cart => {
        let { quantityInStore } = cart;
        if (selectedList.includes(cart._id))
          if (cart.quantity > quantityInStore)
            validQuantity = false;
      });
      if (validQuantity)
        this.props.navigation.navigate('createOrderScreen', { selectedList });
      else {
        this.props.showAlertWithTimeout('Đặt hàng thất bại', 'Không đủ số lượng sản phẩm, vui lòng kiểm tra lại', false);
      }

    }
  }

  deleteCart = (_id) => {
    let selected = this.state.selectedList;
    selected = selected.filter(item => item !== _id);
    this.setState({ selectedList: selected });
    this.props.deleteCart(_id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.cartsReducer !== prevProps.cartsReducer) {
      const { message } = this.props.cartsReducer;
      if (message)
        Alert.alert(
          "Thông báo",
          message,
          [
            {
              text: "Xác nhận"
            }
          ]
        );
    }
  }


  render() {
    let { loading, updateLoading, updateStatus, carts } = this.props.cartsReducer;
    if (loading === true)
      return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>LOADING...</Text>
      </View>
    let total = 0;
    let totalQuantity = 0;
    let totalSelectQuantity = 0;
    let { selectedList } = this.state;
    let elementCarts = carts ? carts.map((cart, index) => {
      let { colorId, sizeId, quantity, quantityInStore } = cart;
      let { productId } = colorId;
      let { size } = sizeId;
      total += selectedList.includes(cart._id) ? productId.price * quantity - productId.saleOff * quantity : 0;
      totalSelectQuantity += selectedList.includes(cart._id) ? quantity : 0;
      totalQuantity += quantity;
      let type = 'Màu: ' + colorId.color + ', kích cỡ: ' + size;

      let checked = selectedList.includes(cart._id);
      return <CartItem onShowModel={this.onShowModel}
        _id={cart._id} key={cart._id} index={index} colorId={colorId._id} sizeId={sizeId._id}
        deleteCart={this.deleteCart} updateLoading={updateLoading} updateStatus={updateStatus} updateCart={this.props.updateCart}
        name={productId.name} productId={productId._id} image={colorId.image} type={type} quantity={quantity} quantityInStore={quantityInStore}
        price={productId.price} saleOff={productId.saleOff}
        onUpdateSelectedList={this.onUpdateSelectedList}
        checked={checked}
        isVisible={this.state.isVisible} />
    }) : null;
    return (
      <View style={styles.containerMain}>
        <ScrollView style={this.state.isVisible ? { backgroundColor: '#999999', width: '100%' } : { width: '100%', backgroundColor: 'white' }}>
          <View style={styles.header}>
            {/* <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}><Ionicons style={{ marginTop: 4 }} name="arrow-back-sharp" size={25} /></TouchableOpacity> */}
            <Text style={styles.textHeader}>Giỏ hàng</Text>
          </View>
          <View style={{ padding: 0 }}>
            {elementCarts}
          </View>
        </ScrollView>
        <View style={styles.bottomView}>
          <View style={{ flexDirection: 'row', width: '35%', justifyContent: 'center', alignItems: 'center', }}>
            <RadioButton
              status={this.state.selectAll ? 'checked' : 'unchecked'}
              onPress={() => this.onCheckAll()} />
            <Text style={styles.text}> Tất cả</Text>
          </View>
          <View style={{ width: '45%' }}>
            <Text style={styles.text}>Tổng tiền: {convertNumberToVND(total)}  ₫</Text>
          </View>
          <TouchableOpacity style={styles.btnBuy}
            onPress={this.onBuy}>
            <Text style={styles.textBtnBuy}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 15,
    flexDirection: 'row', width: '100%',
  },
  textHeader: {
    fontSize: 24,
    marginLeft: 10
  },
  bottomView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
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
  textBtnBuy: {
    color: 'white',
    fontSize: 16
  },
  footer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick,
    paddingTop: 10, borderBottomColor: 'black', borderTopWidth: .3
  },
  btnBuy: {
    justifyContent: 'center',
    height: 50,
    width: '29%',
    backgroundColor: '#EE5407',
    margin: 2
  },
  text: {
    textAlign: 'center',
    fontSize: 12
  },
  textBtnBuy: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12
  }
})

const mapStateToProps = state => {
  return {
    cartsReducer: state.cartsReducer
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    updateCart: (data) => { dispatch(updateCartRequest(data)) },
    deleteCart: (_id) => { dispatch(deleteCartRequest(_id)) },
    showAlertWithTimeout: (message, description, success) => { dispatch(showAlertWithTimeout(message, description, success)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartsScreen);
