import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Provider} from 'react-native-paper';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {theme} from './src/core/theme';
import CreateOrderScreen from './src/screens/createOrderScreen/CreateOrderScreen';
import HomeTabScreen from './src/screens/HomeTabScreen';
import OrderStackScreen from './src/screens/orderScreen/OrderStackScreen';
import DetailProductScreen from './src/screens/productScreen/DetailProductScreen';
import ProductScreen from './src/screens/productScreen/ProductScreen';
import CreateMessengerScreen from './src/screens/messengerScreen/CreateMessengerScreen';
import DetailMessengerScreen from './src/screens/messengerScreen/DetailMessengerScreen';
import {hideAlert} from './actions/alertActions';

const Stack = createStackNavigator();

class App extends Component {
  render() {
    if (this.props.alertReducer.alert !== null)
      Alert.alert(
        this.props.alertReducer.alert.description
          ? this.props.alertReducer.alert.message
          : 'Thông báo',
        this.props.alertReducer.alert.description
          ? this.props.alertReducer.alert.description
          : this.props.alertReducer.alert.message,
        [
          {
            text: 'OK',
            onPress: () => this.props.hideAlert(),
          },
        ],
      );
    return (
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#47b6ff',
              },
              headerTitleAlign: 'center',
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontSize: 17,
                color: '#fff',
              },
            }}>
            <Stack.Screen
              name="homeTabScreen"
              options={{headerShown: false}}
              component={HomeTabScreen}
            />
            <Stack.Screen
              name="createOrderScreen"
              component={CreateOrderScreen}
              options={{title: 'Đặt hàng'}}
            />
            <Stack.Screen
              name="orderStackScreen"
              options={{headerShown: false}}
              component={OrderStackScreen}
            />
            <Stack.Screen
              name="detailProductScreen"
              component={DetailProductScreen}
              options={({route}) => ({title: route.params.title})}
            />
            <Stack.Screen
              name="detailMessengerScreen"
              options={{headerShown: false}}
              component={DetailMessengerScreen}
            />
            <Stack.Screen
              name="createMessengerScreen"
              options={{headerShown: false}}
              component={CreateMessengerScreen}
            />
            <Stack.Screen
              name="productScreen"
              component={ProductScreen}
              options={({route}) => ({title: route.params.title})}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    alertReducer: state.alertReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hideAlert: () => dispatch(hideAlert()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
