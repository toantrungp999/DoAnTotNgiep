import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text} from 'react-native-paper';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';
import {theme} from '../../core/theme';
import {changePasswordRequest} from '../../../actions/userActions';

class ChangePasswordSreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      newPassword: '',
      rePassword: '',
      errors: {
        password: '',
        newPassword: '',
        rePassword: '',
      },
    };
  }

  checkValidate = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'password':
        errors.password = value.length === 0 ? 'Chưa nhập' : '';
        break;
      case 'newPassword':
        if (value.length === 0) errors.newPassword = 'Chưa nhập';
        else if (value.length < 6 || value.length > 255)
          errors.newPassword = 'Mật khẩu phải từ 6 - 255 ký tự';
        else errors.newPassword = '';
        errors.rePassword =
          this.state.rePassword !== value ? 'Mật khẩu không khớp' : '';
        break;
      case 'rePassword':
        errors.rePassword =
          this.state.newPassword !== value ? 'Mật khẩu không khớp' : '';
        break;
      default:
        break;
    }
    this.setState({errors});
  };

  validateForm = errors => {
    let valid = true;
    if (!errors) return true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.userActionReducer !== prevProps.userActionReducer &&
      this.props.userActionReducer.loading === false
    ) {
      const {changePasswordSuccess} = this.props.userActionReducer;
      if (changePasswordSuccess === true)
        Alert.alert('Thông báo', 'Cập nhật mật khẩu thành công');
    }
  }

  onChange = (name, value) => {
    this.checkValidate(name, value);
    this.setState({
      [name]: value,
    });
  };

  onUpdatePassword = () => {
    if (!this.validateForm(this.errors)) return;
    const {password, newPassword} = this.state;
    if (password && newPassword) {
      this.props.changePassword({password, newPassword});
      this.setState({password: '', newPassword: '', rePassword: ''});
    }
  };

  render() {
    const {loading, changePasswordMessage} = this.props.userActionReducer;
    return (
      <ScrollView style={{width: '100%'}}>
        <Background style={styles.containerMain}>
          <BackButton goBack={this.props.navigation.goBack} />
          <Header>Đổi mật khẩu</Header>
          <TextInput
            label="Mật khẩu hiện tại"
            keyboardType="phone-pad"
            returnKeyType="next"
            value={this.state.password}
            onChangeText={text => this.onChange('password', text)}
            error={!!this.state.errors.password}
            errorText={this.state.errors.password}
          />
          <TextInput
            label="Mật khẩu mới"
            returnKeyType="next"
            value={this.state.newPassword}
            onChangeText={text => this.onChange('newPassword', text)}
            error={!!this.state.errors.newPassword}
            errorText={this.state.errors.newPassword}
            secureTextEntry
          />
          <TextInput
            label="Nhập lại mật khẩu mới"
            returnKeyType="next"
            value={this.state.rePassword}
            onChangeText={text => this.onChange('rePassword', text)}
            error={!!this.state.errors.rePassword}
            errorText={this.state.errors.rePassword}
            secureTextEntry
          />
          <View style={styles.row}>
            <Text style={{color: 'red'}}>
              {changePasswordMessage ? changePasswordMessage : ''}
            </Text>
          </View>
          {loading ? (
            <Button mode="contained" style={{marginTop: 24}}>
              LOADING...
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={this.onUpdatePassword}
              style={{marginTop: 24}}>
              Cập nhật
            </Button>
          )}
        </Background>
      </ScrollView>
    );
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
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
  },
  bottom: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
    justifyContent: 'center',
    marginBottom: 50,
  },
  col_35: {
    width: '35%',
    marginTop: 25,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  col_50_male: {
    flexDirection: 'row',
    width: '50%',
    textAlignVertical: 'center',
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
    borderRadius: 55,
    borderColor: 'white',
    borderWidth: 3,
  },
  rowModal: {
    opacity: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  textRowModal: {
    fontSize: 18,
    paddingLeft: 15,
    fontWeight: 'bold',
    color: 'black',
  },
});

const mapStateToProps = state => {
  return {
    userActionReducer: state.userActionReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    changePassword: data => {
      dispatch(changePasswordRequest(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePasswordSreen);
