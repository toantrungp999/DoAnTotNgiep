import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';
import {theme} from '../../core/theme';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';
import {signinRequest, signinByApiRequest} from '../../../actions/userActions';
import {SocialIcon} from 'react-native-elements';
import {LoginManager, LoginButton, AccessToken} from 'react-native-fbsdk';
import {Text} from 'react-native-paper';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId:
    '1039038590000-2jrf04enlt5tcjk3ul2hnckukjctef2p.apps.googleusercontent.com',
  offlineAccess: true, // if you want to access Google API on behalf
});

class LoginScreen extends Component {
  state = {
    email: {value: '', error: ''},
    password: {value: '', error: ''},
  };

  onSignInGoogle = loading => {
    if (loading) return;
    GoogleSignin.hasPlayServices()
      .then(() => {
        GoogleSignin.signIn()
          .then(userInfo => {
            console.log(userInfo);
            if (userInfo.idToken)
              this.props.signinByApi('google', {tokenId: userInfo.idToken});
          })
          .catch(error => {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
            console.log(error.message);
            alert(error.message);
          });
      })
      .catch(error => {
        console.log(error.message);
        alert(error.message);
      });
  };

  onLoginFacebook = loading => {
    if (loading) return;
    LoginManager.logInWithPermissions(['public_profile'])
      .then(result => {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken()
            .then(data => {
              if (data.accessToken)
                this.props.signinByApi('facebook', {
                  access_token: data.accessToken,
                });
            })
            .catch(error => {
              console.log(error.message);
              alert(error.message);
            });
        }
      })
      .catch(error => {
        console.log(error.message);
        alert(error.message);
      });
  };

  onLoginPressed = loading => {
    if (loading) return;
    const {email, password} = this.state;
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      email.error = emailError;
      password.error = passwordError;
      this.setState({email, password});
      return;
    }
    this.props.signin({email: email.value, password: password.value});
  };

  onChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.userInfoReducer !== prevProps.userInfoReducer) {
      const {userInfo} = this.props.userInfoReducer;
      if (userInfo)
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
    }
  }

  render() {
    const {message, loading} = this.props.userInfoReducer;
    return (
      <ScrollView>
        <View style={{width: '100%', height: '100%'}}>
          <Background>
            <BackButton goBack={this.props.navigation.goBack} />
            <Logo />
            <Header>Chào mùng trở lại.</Header>
            <TextInput
              label="Email"
              returnKeyType="next"
              value={this.state.email.value}
              onChangeText={text =>
                this.onChange('email', {value: text, error: ''})
              }
              error={!!this.state.email.error}
              errorText={this.state.email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            <TextInput
              label="Mật khẩu"
              returnKeyType="done"
              value={this.state.password.value}
              onChangeText={text =>
                this.onChange('password', {value: text, error: ''})
              }
              error={!!this.state.password.error}
              errorText={this.state.password.error}
              secureTextEntry
            />
            <View style={styles.forgotPassword}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ForgotPasswordScreen')
                }>
                <Text style={styles.forgot}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <Button
              mode="contained"
              onPress={() => this.onLoginPressed(loading)}>
              {loading ? 'LOADING...' : 'Đăng nhập'}
            </Button>
            <View style={styles.row}>
              <View style={styles.btnLoginSocial}>
                <SocialIcon
                  button
                  title={loading ? 'LOADING...' : 'Đăng nhập'}
                  type="facebook"
                  onPress={() => this.onLoginFacebook(loading)}
                />
              </View>
              <View style={styles.btnLoginSocial}>
                <SocialIcon
                  title={loading ? 'LOADING...' : 'Đăng nhập'}
                  button
                  type="google-plus-official"
                  onPress={() => this.onSignInGoogle(loading)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <Text style={{color: 'red'}}>{message ? message : ''}</Text>
            </View>
            {/* <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.log("login has error: " + result.error);
                } else if (result.isCancelled) {
                  console.log("login is cancelled.");
                } else {

                  console.log(result);
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      this.setState({
                        loggedIn: true,
                        userID: data.userID
                      })
                      console.log(data, data.accessToken.toString())
                    }
                  )
                }
              }
            }
            onLogoutFinished={() =>
              this.setState({
                email: { value: '', error: '' },
                password: { value: '', error: '' }
              })
            } /> */}
            <View style={styles.row}>
              <Text>Bạn chưa có tài khoản </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.push('RegisterScreen')}>
                <Text style={styles.link}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
            <View style={{height: 50}}></View>
          </Background>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  btnLoginSocial: {
    width: '50%',
    flexDirection: 'column',
  },
});

const mapStateToProps = state => {
  return {
    userInfoReducer: state.userInfoReducer,
  };
};

const mapDispatchToProps = dispatch => ({
  signin: data => dispatch(signinRequest(data)),
  signinByApi: (type, token) => dispatch(signinByApiRequest(type, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
