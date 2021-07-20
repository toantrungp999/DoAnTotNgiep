import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { logoutRequest } from '../../../actions/userActions';

class SettingScreen extends Component {

    render() {
        const { userInfo } = this.props.userInfoReducer;
        const image = userInfo.image ? { uri: userInfo.image } : '';
        const name = userInfo.name || '';
        return (
            <ScrollView style={{ width: '100%' }}>
                <View style={{ width: '100%', height: '100%', padding: 10, backgroundColor: '#F1F2F6' }}>
                    <View style={styles.row}><Text style={{ fontSize: 24, fontWeight: "bold", paddingBottom: 5 }}>Menu</Text></View>

                    <TouchableOpacity onPress={() => { this.props.navigation.push('ProfileScreen') }} style={styles.row} >
                        <Image source={image ? image : require('../../../assets/avatar.png')} style={{ width: 24, height: 24, borderWidth: 1, borderRadius: 12 }} />
                        <Text style={styles.textRow}>{name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.push('orderStackScreen', { screen: 'orderScreen' }) }} style={styles.row} >
                        <MaterialIcons name="receipt" size={20} />
                        <Text style={styles.textRow}>Đơn hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.push('ChangePhoneNumberScreen') }} style={styles.row}>
                        <Ionicons name="ios-phone-portrait" size={20} />
                        <Text style={styles.textRow}>Số điện thoại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.push('ChangePasswordSreen') }} style={styles.row}>
                        <Ionicons name="key" size={20} />
                        <Text style={styles.textRow}>Đổi mật khẩu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Ionicons name="location" size={20} />
                        <Text style={styles.textRow}>Địa chỉ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <MaterialIcons name="policy" size={20} />
                        <Text style={styles.textRow}>Chính sách</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Ionicons name="information" size={20} />
                        <Text style={styles.textRow}>Về chúng tôi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={this.props.logout}>
                        <MaterialIcons name="logout" size={20} />
                        <Text style={styles.textRow}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    row: { opacity: 0.6, flex: 1, flexDirection: 'row', alignItems: 'center', width: '100%', borderBottomColor: '#CED0D4', borderBottomWidth: 1, paddingLeft: 10, paddingTop: 15, paddingBottom: 15 },
    textRow: { fontSize: 18, paddingLeft: 15 }
})

const mapStateToProps = state => {
    return {
        userInfoReducer: state.userInfoReducer
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logoutRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
