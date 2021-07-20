import React, { Component } from 'react';
import { connect } from 'react-redux';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { isValidLength, isEmail } from '../../../extentions/ArrayEx';
import { StyleSheet, View, Text } from 'react-native';
import {
  forgotPasswordRequest
} from '../../../actions/userActions';

class ForgotPasswordScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: { value: '', error: '' },
    };
  }

  checkValidate = (name, value) => {
    switch (name) {
      case 'email':
        value.error = value.value.length > 0 ? isValidLength(value.value, 5, 255).error : 'Chưa nhập';
        if (value.error.length === 0)
          value.error = !isEmail(value.value) ? '' : 'Vui lòng nhập đúng email';
        break;
      default: break;
    }
    return value;
  }

  componentDidUpdate(prevProps) {
    if (this.props.userForgotPasswordReducer !== prevProps.userForgotPasswordReducer) {
      if (this.props.userForgotPasswordReducer.statusForgot) {
        this.props.navigation.navigate('OTPScreen');
      }
    }
  }

  onChange = (name, value) => {
    value = this.checkValidate(name, value);
    this.setState({
      [name]: value
    });
  };

  sendResetPasswordOTP = () => {
    if (this.state.email.error)
      return;
      
    this.props.forgotPassword(this.state.email.value);
  }

  render() {
    const { loading, message } = this.props.userForgotPasswordReducer;
    return (
      <Background>
        <BackButton goBack={this.props.navigation.goBack} />
        <Logo />
        <Header>Quên mật khẩu</Header>
        <TextInput
          label="Địa chỉ E-mail"
          returnKeyType="done"
          value={this.state.email.value}
          onChangeText={(text) => this.onChange('email', { value: text, error: '' })}
          error={!!this.state.email.error}
          errorText={this.state.email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          description="Vui lòng nhập email để nhận mã OTP qua điện thoại hoặc email."
        />
        <View><Text style={{ color: 'red' }}>{message}</Text></View>

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
              onPress={this.sendResetPasswordOTP}
              style={{ marginTop: 16 }}>
              Giử mã OTP
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
    forgotPassword: (email) => { dispatch(forgotPasswordRequest(email)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);
