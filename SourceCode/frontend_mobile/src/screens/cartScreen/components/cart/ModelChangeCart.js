import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { convertNumberToVND } from '../../../../../extentions/ArrayEx';
import Octicons from 'react-native-vector-icons/Octicons';
import {
    updateTypeCartRequest
} from '../../../../../actions/cartActions';
import {
    fectchColorOptionsRequest, fectchQuantityOptionsRequest, fectchSizeOptionsRequest,
} from '../../../../../actions/productOptionActions';

class ChangeItemCart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            colorId: '',
            quantityOption: '',
            quantity: 1,
            quantityInStore: 0,
            isUpdateType: false
        }
    }

    onUpdateType = () => {
        let { quantityOption, quantity } = this.state;
        if (quantityOption && quantity > 0)
            this.props.updateTypeCart({
                cartId: this.props.cartId,
                sizeId: quantityOption.sizeId,
                colorId: quantityOption.colorId,
                quantity
            });
        this.setState({ isUpdateType: true });
        this.props.onCloseModal();
    }

    onChange(name, value) {
        if (name === 'sizeId') {
            let { quantityOptions } = this.props.productOptionsReducer;
            if (quantityOptions) {
                let total = quantityOptions.length;
                for (let i = 0; i < total; i++) {
                    if (quantityOptions[i].colorId === this.state.colorId && quantityOptions[i].sizeId === value) {
                        this.setState({
                            quantityOption: quantityOptions[i],
                            quantity: quantityOptions[i].quantity > 0 ? 1 : 0
                        });
                        break;
                    }
                }
            }
        }
        else if (name === 'colorId') {
            this.setState({
                colorId: value,
                quantityOption: '',
                quantity: 0
            });
        }
    }


    componentDidUpdate(prevProps) {
        let { cartsReducer, productOptionsReducer } = this.props;
        if (productOptionsReducer && productOptionsReducer.quantityLoading === false && productOptionsReducer !== prevProps.productOptionsReducer && !this.state.quantityOption) {
            let { quantityOptions } = productOptionsReducer;
            if (this.state.isUpdateType === false && quantityOptions && quantityOptions.length > 0) {
                for (let i = quantityOptions.length - 1; i >= 0; i--)
                    if (quantityOptions[i].colorId === this.state.colorId && quantityOptions[i].sizeId === this.props.sizeId) {
                        this.setState({
                            quantityOption: quantityOptions[i]
                        });
                        break;
                    }
            }
        }
        if (cartsReducer !== prevProps.cartsReducer) {
            let { updateTypeStatus } = cartsReducer;
            if (updateTypeStatus && this.state.isUpdateType) {
                this.props.onCloseModal();
                this.setState({ isUpdateType: false });
            }
        }
    }

    componentDidMount() {
        this.props.fectchColorOptions(this.props.productId);
        this.props.fectchSizeOptions(this.props.productId);
        this.props.fectchQuantityOptions(this.props.productId);
        this.setState({ quantity: this.props.quantity, quantityInStore: this.props.quantityInStore, colorId: this.props.colorId, });
    }

    onUp = () => {
        let { quantity } = this.state;
        if (quantity < this.state.quantityOption.quantity && quantity < 5) {
            quantity += 1;
            this.setState({ quantity });
        }
    }

    onDown = () => {
        let { quantity } = this.state;
        if (quantity > 1) {
            quantity -= 1;
            this.setState({ quantity });
        }
    }

    render() {
        const { sizeOptions, colorOptions, quantityOptions, colorLoading, sizeLoading, quantityLoading } = this.props.productOptionsReducer;
        let sizeComponent, colorComponent;
        if (quantityLoading === false && quantityOptions) {
            if (sizeLoading === false && sizeOptions && colorLoading === false && colorOptions) {
                colorComponent = colorOptions.map((colorOption, index) => {
                    let total = quantityOptions.length;
                    for (let i = 0; i < total; i++) {
                        if (quantityOptions[i].colorId === colorOption._id) {
                            return <TouchableOpacity key={colorOption._id} index={index} onPress={() => this.onChange('colorId', colorOption._id)}>
                                <Text style={this.state.colorId === colorOption._id ? styles.btnChoose : styles.btn}>{colorOption.color}</Text>
                            </TouchableOpacity>
                        }
                    }
                    return null;
                });
                sizeComponent = sizeOptions.map((sizeOption, index) => {
                    let total = quantityOptions.length;
                    for (let i = 0; i < total; i++) {
                        if ((!this.state.colorId || quantityOptions[i].colorId === this.state.colorId) && quantityOptions[i].sizeId === sizeOption._id)
                            return <TouchableOpacity key={sizeOption._id} index={index} onPress={() => this.onChange('sizeId', sizeOption._id)}>
                                <Text style={this.state.quantityOption.sizeId === sizeOption._id ? styles.btnChoose : styles.btn}>{sizeOption.size}</Text>
                            </TouchableOpacity>
                    }
                    return null;
                });
            }
        }
        return (
            <Modal transparent={true}
                onRequestClose={this.onCloseModal}
                visible={this.props.isVisible}>
                <View style={styles.bottomView}>
                    <View style={styles.containerMain}>
                        <View style={styles.row}>
                            <View style={{ width: '25%' }}>
                                <Image style={styles.image} source={{ 'uri': this.props.image }} />
                            </View>
                            <View style={{ width: '62%', marginTop: 10, marginLeft: 10 }}>
                                <View style={styles.row}>
                                    <Text style={styles.price}>{convertNumberToVND(this.state.quantity * (this.props.price - this.props.saleOff))} ₫</Text>
                                    <Text style={styles.salePrice}>{convertNumberToVND(this.state.quantity * this.props.price)} ₫</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>Số lượng trong kho: {this.state.quantityOption.quantity}</Text>
                                </View>
                            </View>
                            <View style={{ width: '10%', alignItems: 'center' }}>
                                <TouchableOpacity onPress={this.props.onCloseModal}><Octicons name="x" size={20} /></TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.horizontalLine}></View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Màu</Text>
                        </View>
                        <View style={styles.row}>
                            {colorComponent}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Kích cỡ</Text>
                        </View>
                        <View style={styles.row}>
                            {sizeComponent}
                        </View>
                        <View style={styles.horizontalLine}></View>
                        <View style={styles.row}>
                            <View style={{ width: '30%' }}>
                                <Text style={styles.text}>Số lượng</Text>
                            </View>
                            <View style={styles.editQuantity}>
                                <TouchableOpacity onPress={this.onDown}><Text style={styles.btnSubAdd}>-</Text></TouchableOpacity>
                                <Text style={styles.quantity}>{this.state.quantity}</Text>
                                <TouchableOpacity onPress={this.onUp}><Text style={styles.btnSubAdd}>+</Text></TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.onUpdateType} style={styles.agreebtn}><Text style={styles.textAgree}>Đồng ý</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        minHeight: 300,
    },
    bottomView: {
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
    row: {
        flexDirection: 'row', width: '100%',
        marginTop: 8
    },
    horizontalLine: {
        flexDirection: 'row', width: '100%', borderBottomColor: 'black', borderBottomWidth: .3, opacity: 0.5, marginTop: 20, marginBottom: 12
    },
    btnChoose: {
        borderColor: '#EE4D2D',
        color: 'red',
        borderWidth: 1,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        marginLeft: 12,
        borderWidth: .5,
        paddingTop: 5,
        paddingBottom: 5
    },
    btn: {
        color: 'black',
        borderColor: 'black',
        borderWidth: .3,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        marginLeft: 12,
        paddingTop: 5,
        paddingBottom: 5
    },
    text: {
        fontSize: 16
    },
    btnSubAdd: {
        fontSize: 16,
        width: 36,
        textAlign: 'center',
        borderColor: 'black',
        borderWidth: 0.4,
    },
    quantity: {
        width: 40,
        textAlign: 'center',
        borderColor: 'black',
        borderWidth: 0.2,
        fontSize: 16,
    },
    editQuantity: {
        width: '50%', flexDirection: 'row', justifyContent: 'center'
    },
    agreebtn: {
        flexDirection: 'row', width: '100%', marginTop: 10, padding: 10,
        backgroundColor: 'rgb(238,77,45)', justifyContent: 'center',
        marginTop: 20
    },
    textAgree: {
        color: 'white',
        fontSize: 16
    },
    image: {
        resizeMode: 'contain',
        flex: 1,
        aspectRatio: 1
    },
    price: {
        fontSize: 16,
        color: '#0000CD',
        marginRight: 10,
        fontWeight: 'bold',
        color: 'red',
    },
    salePrice: {
        color: '#ccc',
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: 'black',
    },
})

const mapStateToProps = state => {
    return {
        productOptionsReducer: state.productOptionsReducer,
        cartsReducer: state.cartsReducer
    }
};

const mapDispatchToProps = dispatch => ({
    fectchQuantityOptions: (_id) => { dispatch(fectchQuantityOptionsRequest(_id)) },
    fectchColorOptions: (_id) => { dispatch(fectchColorOptionsRequest(_id)) },
    fectchSizeOptions: (_id) => { dispatch(fectchSizeOptionsRequest(_id)) },
    updateTypeCart: (data) => { dispatch(updateTypeCartRequest(data)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeItemCart);
