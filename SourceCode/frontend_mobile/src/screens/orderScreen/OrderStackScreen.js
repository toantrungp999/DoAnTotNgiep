import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OrderScreen from './OrderScreen';
import OrderDetailScreen from './OrderDetailScreen';

const Stack = createStackNavigator();

class OrderStackScreen extends Component {
  render() {
    return (
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
          name="orderScreen"
          options={{headerShown: true, title: 'Đơn hàng'}}
          component={OrderScreen}
        />
        <Stack.Screen
          name="orderDetailScreen"
          options={{headerShown: true, title: 'Chi tiết đơn hàng'}}
          component={OrderDetailScreen}
        />
      </Stack.Navigator>
    );
  }
}

export default OrderStackScreen;
