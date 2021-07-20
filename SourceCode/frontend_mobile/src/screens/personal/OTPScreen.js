import React, { Component } from 'react';
import { connect } from 'react-redux';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { isValidLength, isNumber } from '../../../extentions/ArrayEx';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
    verifyOTPRequest, forgotPasswordRequest, timeoutRequest
} from '../../../actions/userActions';
import CountDown from 'react-native-countdown-component';

class OTPScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            code: { value: '', error: '' },
        };
    }

    checkValidate = (name, value) => {
        switch (name) {
            case 'code':
                value.error = value.value.length > 0 ? isValidLength(value.value, 6, 6).error : 'Chưa nhập';
                if (value.error.length === 0)
                    value.error = !isNumber(value.value).error ? '' : 'Vui lòng nhập số';
                break;
            default: break;
        }
        return value;
    }

    validateForm = errors => {
        let valid = true;
        if (!errors)
            return true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    };

    componentDidUpdate(prevProps) {
        if (this.props.userForgotPasswordReducer !== prevProps.userForgotPasswordReducer) {
            if (this.props.userForgotPasswordReducer.statusVerify) {
                this.props.navigation.navigate('ResetPasswordSreen');
            }

            if (!this.props.userForgotPasswordReducer || this.props.userForgotPasswordReducer.timeout === 0) {
                this.state.code.error = "Mã OTP đã hết hạn!";
                this.state.code.value = '';
                this.setState({ code: this.state.code });
            }
        }
    }

    onChange = (name, value) => {
        value = this.checkValidate(name, value);
        this.setState({
            [name]: value
        });
    };

    verifyOTP = () => {
        if (this.state.code.error)
            return;

        if (!this.props.userForgotPasswordReducer || this.props.userForgotPasswordReducer.timeout === 0) {
            this.state.code.error = "Mã OTP đã hết hạn!";
        }

        this.props.verifyOTP(Number(this.state.code.value));

        this.state.code.value = '';
        this.setState({ code: this.state.code });
    }

    componentDidMount() {
        const { email } = this.props.userForgotPasswordReducer;
        if (email)
            this.setState({ email });
    }


    sendResetPasswordOTP = () => {
        if (this.state.email)
            this.props.forgotPassword(this.state.email);
        else
            this.props.navigation.navigate('ForgotPasswordScreen');
    }

    render() {
        const { loading, message, msgSuccess, timeout } = this.props.userForgotPasswordReducer;
        return (
            <Background>
                <BackButton goBack={this.props.navigation.goBack} />
                <Logo />
                <Header>Xác thực OTP</Header>
                <TextInput
                    label="OTP"
                    returnKeyType="done"
                    value={this.state.code.value}
                    onChangeText={(text) => this.onChange('code', { value: text, error: '' })}
                    error={!!this.state.code.error}
                    errorText={this.state.code.error}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    description={msgSuccess || "Bạn sẽ nhận mã OTP thông qua số điện thoại. Mã OTP có hiệu lực trong 5 phút."}
                />
                {message ? <View><Text style={{ color: 'red' }}>{message}</Text></View> : null}

                {timeout ? <CountDown
                    until={timeout}
                    size={21}
                    onFinish={() => this.props.timeout}
                    digitStyle={{ backgroundColor: '#FFF' }}
                    digitTxtStyle={{ color: 'red' }}
                    timeToShow={['M', 'S']}
                    timeLabels={{ m: 'Phút', s: 'giây' }}
                />
                    : null}

                {loading === true ? null : <TouchableOpacity onPress={this.sendResetPasswordOTP} style={{ width: '100%', marginTop: 15, marginBottom: 5 }}><Text style={{ textAlign: 'right', color: 'blue' }}>Gửi lại OTP</Text></TouchableOpacity>}

                {
                    loading
                        ?
                        <Button
                            mode="contained"
                            style={{ marginTop: 16 }}>
                            LOADING...
                        </Button>
                        :
                        <Button
                            mode="contained"
                            onPress={this.verifyOTP}
                            style={{ marginTop: 16 }}>
                            Xác thực
                        </Button>
                }
            </Background>
        )
    }
}

const styles = StyleSheet.create({

})

const mapStateToProps = state => {
    return {
        userForgotPasswordReducer: state.userForgotPasswordReducer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        verifyOTP: (code) => { dispatch(verifyOTPRequest(code)) },
        forgotPassword: (email) => { dispatch(forgotPasswordRequest(email)) },
        timeout: () => { dispatch(timeoutRequest()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen);
