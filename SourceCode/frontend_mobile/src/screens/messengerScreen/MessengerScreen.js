import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateMessengerScreen from './CreateMessengerScreen';
import DetailMessengerScreen from './DetailMessengerScreen';
import ListMessengerScreen from './ListMessengerScreen';

const Stack = createStackNavigator();

class MessengerScreen extends Component {

    render() {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="ListMessengerScreen" component={ListMessengerScreen} />
                <Stack.Screen name="DetailMessengerScreen" component={DetailMessengerScreen} />
                <Stack.Screen name="CreateMessengerScreen" component={CreateMessengerScreen} />
            </Stack.Navigator>
        );
    }
}

export default MessengerScreen;

