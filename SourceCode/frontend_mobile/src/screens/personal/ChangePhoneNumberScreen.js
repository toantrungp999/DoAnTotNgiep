import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';
import { theme } from '../../core/theme';
import {
    fetchProfileRequest,
    changePhoneRequest
} from '../../../actions/userActions';
import { isPhoneNumber } from './../../../extentions/ArrayEx';

class ChangePhoneNumberScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            phoneNumber: '',
            errors: {
                password: '',
                phoneNumber: ''
            },
        };
    }

    componentDidMount() {
        const { userProfile } = this.props.userProfileReducer;
        if (!userProfile || JSON.stringify(userProfile) === '{}') {
            this.props.fetchProfile();
        }
        else
            this.setState({
                phoneNumber: userProfile.phoneNumber?userProfile.phoneNumber:''
            });
    }

    checkValidate = (name, value) => {
        let errors = this.state.errors;
        let checkPhoneNumber;
        switch (name) {
            case 'password':
                if (value.length > 50)
                    errors.password = 'Mật khẩu không được quá 50 ký tự';
                else if (value.length === 0)
                    errors.password = 'Chưa nhập mật khẩu';
                else
                    errors.password = '';
                break;
            case 'phoneNumber':
                if (value.length === 0)
                    errors.phoneNumber = 'Chưa nhập số điện thoại'
                else {
                    checkPhoneNumber = isPhoneNumber(value);
                    errors.phoneNumber = !checkPhoneNumber ? 'Không phải số điện thoại' : ''
                }
                break;
            default: break;
        }
        this.setState({ errors });
    }

    validateForm = errors => {
        let valid = true;
        if (!errors)
            return true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    };

    componentDidUpdate(prevProps) {
        if (this.props.userProfileReducer !== prevProps.userProfileReducer && this.props.userProfileReducer.loading === false) {
            const { userProfile } = this.props.userProfileReducer;
            if (userProfile && !this.state.phoneNumber)
                this.setState({
                    phoneNumber: userProfile.phoneNumber
                });
        }
        if (this.props.userActionReducer !== prevProps.userActionReducer && this.props.userActionReducer.loading === false) {
            const { changePhoneSuccess } = this.props.userActionReducer;
            if (changePhoneSuccess === true)
                Alert.alert(
                    "Thông báo",
                    "Cập nhật số điện thoại thành công");
        }
    }

    onChange = (name, value) => {
        this.checkValidate(name, value);
        this.setState({
            [name]: value
        });
    };

    onUpdatePhoneNumber = () => {
        if (!this.validateForm(this.errors))
            return;
        const { password, phoneNumber } = this.state;
        if (password && phoneNumber)
            this.props.changePhone({ password, phoneNumber });
        this.setState({ password: '' });
    }

    render() {
        const { loading, changePhoneMessage } = this.props.userActionReducer;
        return (
            <ScrollView style={{ width: '100%' }}>
                <Background style={styles.containerMain}>
                    <BackButton goBack={this.props.navigation.goBack} />
                    <Header>Số điện thoại</Header>
                    <TextInput
                        label="Số điện thoại"
                        keyboardType="phone-pad"
                        returnKeyType="next"
                        value={this.state.phoneNumber}
                        onChangeText={(text) => this.onChange('phoneNumber', text)}
                        error={!!this.state.errors.phoneNumber}
                        errorText={this.state.errors.phoneNumber} />
                    <TextInput
                        label="Mật khẩu"
                        returnKeyType="next"
                        value={this.state.password}
                        onChangeText={(text) => this.onChange('password', text)}
                        error={!!this.state.errors.password}
                        errorText={this.state.errors.password}
                        secureTextEntry />
                    <View style={styles.row}>
                        <Text style={{ color: 'red' }}>{changePhoneMessage ? changePhoneMessage : ''}</Text>
                    </View>
                    {
                        loading
                            ?
                            <Button
                                mode="contained"
                                style={{ marginTop: 24 }}>
                                LOADING...
                        </Button>
                            :
                            <Button
                                mode="contained"
                                onPress={this.onUpdatePhoneNumber}
                                style={{ marginTop: 24 }}>
                                Cập nhật
                        </Button>
                    }
                </Background>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomView: {
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
    },
    row: {
        flexDirection: 'row', width: '100%',
        marginTop: 4
    },
    bottom: {
        flexDirection: 'row', width: '100%',
        marginTop: 4, justifyContent: 'center',
        marginBottom: 50
    },
    col_35: {
        width: "35%", marginTop: 25
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    col_50_male: {
        flexDirection: 'row', width: '50%', textAlignVertical: 'center'
    },
    image: {
        width: 110,
        height: 110,
        marginBottom: 8,
        borderRadius: 55,
        borderColor: 'white',
        borderWidth: 3
    },
    rowModal: { opacity: 0.6, flexDirection: 'row', alignItems: 'center', width: '100%', paddingLeft: 10, paddingTop: 15, paddingBottom: 15 },
    textRowModal: { fontSize: 18, paddingLeft: 15, fontWeight: "bold", color: 'black' }
})

const mapStateToProps = state => {
    return {
        userProfileReducer: state.userProfileReducer,
        userInfoReducer: state.userInfoReducer,
        userActionReducer: state.userActionReducer,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchProfile: () => {
            dispatch(fetchProfileRequest());
        },
        changePhone: (data) => {
            dispatch(changePhoneRequest(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePhoneNumberScreen);
