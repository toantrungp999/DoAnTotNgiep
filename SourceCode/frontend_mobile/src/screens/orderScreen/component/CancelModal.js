import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal, Portal, RadioButton, TextInput, Button } from 'react-native-paper';
import { BY_CUSTOMER as CancelReasons } from '../../../../constants/CancelReasons';




class CancelModal extends Component {
    state = {
        reason: CancelReasons.CONFUSION,
        otherReason: ''
    }

    changeReason = (value) => {
        this.setState({ reason: value });
    }

    changeOtherReason = (value) => {
        this.setState({ otherReason: value });
    }

    onConfirm = () => {
        var { reason, otherReason } = this.state;
        if (reason !== '') {
            var cancelReason = 'Khách hàng: ';
            if (reason === CancelReasons.OTHER && otherReason.length < 100) {
                cancelReason += otherReason;
            } else {
                cancelReason += reason;
            }
            this.props.onConfirmCancel(cancelReason);
        }
    }


    render() {
        const { visible, hideCancelModal } = this.props;
        return (
            <Portal >
                <Modal visible={visible} onDismiss={hideCancelModal}
                    contentContainerStyle={styles.containerContent} >
                    <Text style={styles.title}>Chọn lý do</Text>
                    <RadioButton.Group value={this.state.reason}
                        onValueChange={value => this.setState({ reason: value })}>
                        <TouchableOpacity onPress={() => { this.changeReason(CancelReasons.CONFUSION) }}>
                            <View style={styles.radioItem}>
                                <RadioButton
                                    value={CancelReasons.CONFUSION}

                                />
                                <Text style={styles.text}>{CancelReasons.CONFUSION}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.changeReason(CancelReasons.NO_MORE_BUYING) }}>

                            <View style={styles.radioItem}>
                                <RadioButton
                                    value={CancelReasons.NO_MORE_BUYING}

                                />
                                <Text style={styles.text}>{CancelReasons.NO_MORE_BUYING}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.changeReason(CancelReasons.OTHER) }}>

                            <View style={styles.radioItem}>
                                <RadioButton
                                    value={CancelReasons.OTHER}
                                />
                                <Text style={styles.text}>Khác: </Text>
                                <TextInput style={styles.input}
                                    value={this.state.otherReason}
                                    mode="flat"
                                    placeholder="Nhập lý do"
                                    disabled={this.state.reason !== CancelReasons.OTHER}
                                    onChangeText={(value) => { this.changeOtherReason(value) }}
                                />
                            </View>
                        </TouchableOpacity>
                    </RadioButton.Group>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} mode="contained" color='#757575' labelStyle={styles.buttonLabel} contentStyle={styles.buttonContain}
                            onPress={() => { hideCancelModal() }}>Trở lại</Button>
                        <Button style={styles.button} mode="contained" color='#b80000' labelStyle={styles.buttonLabel} contentStyle={styles.buttonContain}
                            onPress={() => { this.onConfirm() }}> Hủy đơn hàng</Button>

                    </View>
                </Modal>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    containerContent: {
        backgroundColor: '#ffffff',
        width: '90%',
        marginLeft: '5%',
        padding: 20
    },

    title: {
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: '#777777',
        paddingBottom: 20,
        borderBottomWidth: 0.3,
        borderBottomColor: '#e3e3e3'
    },
    radioItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 0.3,
        borderBottomColor: '#e3e3e3',
        position: 'relative'

    },

    text: {
        fontSize: 15
    },
    input: {
        fontSize: 15,
        height: 40,
        backgroundColor: '#ffffff',
        width: '72%',
        marginLeft: 'auto'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    button: {
        width: '45%',
        marginTop: 20
    },
    buttonLabel: {
        color: '#ffffff',
        fontSize: 10,

    },
    buttonContain: {
        height: 40,
    }
})




export default (CancelModal);