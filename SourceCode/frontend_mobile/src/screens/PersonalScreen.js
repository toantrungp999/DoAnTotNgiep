import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import {
    LoginScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    SettingScreen,
    ProfileScreen,
    ChangePasswordSreen,
    ChangePhoneNumberScreen,
    OTPScreen,
    ResetPasswordSreen
} from './personal/index';

const Stack = createStackNavigator();

class PersonalScreen extends Component {

    render() {
        const { userInfo } = this.props.userInfoReducer;
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                >
                {!userInfo && <Stack.Screen name="LoginScreen" component={LoginScreen} />}
                {!userInfo && <Stack.Screen name="RegisterScreen" component={RegisterScreen} />}
                {!userInfo && <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />}
                {!userInfo && <Stack.Screen name="OTPScreen" component={OTPScreen} />}
                {!userInfo && <Stack.Screen name="ResetPasswordSreen" component={ResetPasswordSreen} />}
                {userInfo && <Stack.Screen name="SettingScreen" component={SettingScreen} />}
                {userInfo && <Stack.Screen name="ProfileScreen" component={ProfileScreen} />}
                {userInfo && <Stack.Screen name="ChangePasswordSreen" component={ChangePasswordSreen} />}
                {userInfo && <Stack.Screen name="ChangePhoneNumberScreen" component={ChangePhoneNumberScreen} />}
            </Stack.Navigator>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfoReducer: state.userInfoReducer
    }
}

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(PersonalScreen);

