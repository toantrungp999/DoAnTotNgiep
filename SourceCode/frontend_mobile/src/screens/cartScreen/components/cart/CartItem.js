import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { convertNumberToVND } from '../../../../../extentions/ArrayEx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModelChangeCart from './ModelChangeCart';

class CartItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: '', quantity: 0, price: 0, type: '', message: '', isLoading: false, showDiaLogChangeType: false,
            isVisible: false
        }
    }

    componentDidMount() {
        let { _id, quantity, price, type, quantityInStore } = this.props;
        this.setState({ _id, quantity, price, type, quantityInStore });
    }

    onUp = () => {
        let { _id, quantity, quantityInStore } = this.state;
        if (quantity < quantityInStore && quantity < 5) {
            quantity += 1;
            this.setState({ quantity });
            this.onUpdate(_id, quantity);
        }
        else if (quantity >= quantityInStore)
            this.showMessage("Cảnh báo", 'Số lượng sản phẩm vượt quá số lượng có trong kho');

        else
            this.showMessage("Cảnh báo", 'Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng!');
    }

    onDown = () => {
        let { _id, quantity } = this.state;
        let checkQuantity = this.props.quantityInStore - quantity;
        if (this.props.quantity === 1)
            this.prepareToDelete();
        else if (checkQuantity < 0) {
            quantity = this.props.quantityInStore;
            this.setState({ quantity });
            this.onUpdate(_id, quantity);
        }
        else if (quantity > 1) {
            quantity -= 1;
            this.setState({ quantity });
            this.onUpdate(_id, quantity);
        }
    }

    prepareToDelete = () => {
        console.log('sfsd')
        Alert.alert(
            "Cảnh báo",
            "Bạn muốn sản phẩm này khỏi giỏ hàng",
            [
                {
                    text: "Đồng ý",
                    onPress: () => this.onDelete()
                },
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ]
        );
    }

    showMessage = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "Xác nhận"
                }
            ]
        );
    }

    onUpdate = (_id, quantity) => {
        this.props.updateCart({ _id, quantity });
        this.setState({ isLoading: true });
    }

    onDelete = () => {
        this.props.deleteCart(this.state._id);
    }

    onCheck = () => {
        this.props.onUpdateSelectedList(this.state._id, !this.props.checked);
    }


    componentDidUpdate(prevProps) {
        if (this.props.quantity !== prevProps.quantity || this.props.updateLoading !== prevProps.updateLoading) {
            const { updateLoading, quantity } = this.props;
            if (!updateLoading && this.state.isLoading)
                this.setState({ isLoading: false });
            if (quantity)
                this.setState({ quantity });
        }
    }

    onEditType = () => {
        // this.setState({ showDiaLogChangeType: true });
    }
    onCloseModal = () => {
        this.setState({ isVisible: false });
        this.props.onShowModel();
    }

    onOpenModal = () => {
        this.setState({ isVisible: true });
        this.props.onShowModel();
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.isVisible ? <ModelChangeCart onCloseModal={this.onCloseModal} isVisible={this.state.isVisible}
                    price={this.props.price} saleOff={this.props.saleOff} cartId={this.state._id} quantity={this.state.quantity}
                    colorId={this.props.colorId}
                    sizeId={this.props.sizeId} productId={this.props.productId}
                    image={this.props.image}
                    quantityInStore={this.props.quantityInStore}
                /> : null}
                <View style={[styles.mainContainer, this.props.index === 0 && styles.first]}>
                    <View style={styles.check}>
                        <RadioButton
                            status={this.props.checked ? 'checked' : 'unchecked'}
                            onPress={() => this.onCheck()}
                        />
                    </View>
                    <View style={styles.imageConatiner}>
                        <Image style={this.props.isVisible ? styles.imageLowColor : styles.image} source={{ 'uri': this.props.image }} />
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{this.props.name}</Text>
                        <View style={styles.typeSection}>
                            <TouchableOpacity onPress={this.onOpenModal}><View style={this.props.isVisible ? styles.categoryLowColor : styles.category}><Text>{this.props.type}  <AntDesign name="caretdown" size={14} /></Text></View></TouchableOpacity>
                        </View>
                        <View style={styles.priceSection}>
                            {this.props.saleOff !== 0 ? <Text style={styles.salePrice}>{convertNumberToVND(this.props.price)} ₫</Text> : null}
                            <Text style={styles.price}>{convertNumberToVND(this.props.price - this.props.saleOff)} ₫</Text>
                        </View>
                        <View style={styles.rowItemCenter}>
                            <TouchableOpacity onPress={this.onDown}><Text style={styles.btnSubAdd}>-</Text></TouchableOpacity>
                            <Text style={styles.quantity}>{this.state.quantity}</Text>
                            <TouchableOpacity onPress={this.onUp}><Text style={styles.btnSubAdd}>+</Text></TouchableOpacity>
                            <View style={styles.deleteContainer}>
                                <TouchableOpacity onPress={this.prepareToDelete}><Ionicons style={styles.delete} name="trash" size={20} /></TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowItemCenter}>
                            <Text style={styles.quantityInStore}>Kho: {this.props.quantityInStore}</Text>
                            {this.props.quantity>this.props.quantityInStore&&<Text style={styles.quantityMessage}>(Không đủ số lượng)</Text>}
                        </View>
                    </View>
                </View>


            </View>
        )
    }
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        width: windowWidth
    },
    mainContainer: {
        width: 0.94 * windowWidth,
        flexDirection: 'row',
        marginLeft: 0.03 * windowWidth,
        borderBottomWidth: 0.3,
        borderColor: '#ebebeb',
        paddingTop: 15,
        paddingBottom: 15
    },
    first: {
        borderTopWidth: 0.3,
        borderColor: '#ebebeb',

    },
    textHeader: {
        fontSize: 24,
        marginLeft: 10
    },
    rowItemCenter: {
        flexDirection: 'row',
        marginTop: 10,
        flex: 1
    },
    check: {
        width: 30, alignItems: 'center',
        marginTop: 0.1 * windowWidth,
        transform: [{ translateY: -15 }]
    },
    imageConatiner: {
        width: 0.2 * windowWidth,
        height: 0.2 * windowWidth
    },
    image: {
        resizeMode: 'cover',
        flex: 1,
        aspectRatio: 1,
    },
    imageLowColor: {
        resizeMode: 'cover',
        flex: 1,
        aspectRatio: 1,
        backgroundColor: '#999999'
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 5,
        flex: 1
    },
    btnSubAdd: {
        fontSize: 18,
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
        fontSize: 18,
    },
    title: {
        fontSize: 16,
        textAlign: "left",
        fontWeight: 'bold',

    },
    typeSection: {
        alignSelf: 'flex-start'
    },
    category: { padding: 10, backgroundColor: '#F1F2F6', borderRadius: 5 },
    categoryLowColor: { padding: 10, backgroundColor: '#999999', borderRadius: 5 },
    textPrice: {
        fontSize: 18,
    },
    priceSection: {
        flexDirection: 'row',
        marginTop: 5
    },
    price: {
        fontSize: 16,
        color: '#0000CD',
        marginRight: 10,
     
        color: 'red',
    },
    salePrice: {
        color: '#444444',
        fontSize: 14,
        textDecorationLine: 'line-through',
        marginRight: 4
    },
    deleteContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    delete: {
        color: 'red'
    },
    quantityInStore:{
        color:'#444444',
        marginRight:5
    },
    quantityMessage:{
        color:'#eb0000'
    }
})

export default CartItem;
