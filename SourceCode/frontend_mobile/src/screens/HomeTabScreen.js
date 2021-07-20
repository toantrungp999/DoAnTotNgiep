import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    PersonalScreen
} from '../screens';

import CartsScreen from './cartScreen/CartsScreen';
import ListMessengerScreen from './messengerScreen/ListMessengerScreen';
import HomeScreen from './homePage/HomeScreen';
import NotificationsScreen from './notification/NotificationsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { initial } from '../../actions/userActions';
import { fectchNewNotificationsRequest } from '../../actions/notifacationActions';
import { GetItemFromStorage } from '../../extentions/Storage';

const Tab = createBottomTabNavigator();
class HomeTabScreen extends Component {

    intervalId = 0;

    async componentDidMount() {
        const userInfo = await GetItemFromStorage('userInfo');
        const asscessToken = await GetItemFromStorage('x-access-token');
        this.props.initial(userInfo, asscessToken);
        this.intervalId = setInterval(this.fectchNotifications, 5000);
    }

    fectchNotifications = () => {
        const { userInfo } = this.props.userInfoReducer;
        if (userInfo) {
            const { loading, feedNews } = this.props.notificationsReducer;
            if (!loading && !feedNews)
                this.props.fectchNotifications(7);
        }
    }

    render() {
        const { userInfo } = this.props.userInfoReducer;
        let count = 0;
        const { pagingInfo } = this.props.notificationsReducer;
        if (pagingInfo) {
            const { notSeen } = pagingInfo;
            count = notSeen;
        }

        let { carts } = this.props.cartsReducer;
        const { messengers } = this.props.messengersReducer;

        let lengthCarts = 0;
        let notSeen = 0;
        if (userInfo) {
            if (messengers) {
                for (let i = messengers.length - 1; i >= 0; i--) {
                    let currentUserSend = messengers[i].user1._id === userInfo._id ? 'user1' : 'user2';
                    let isMeSend = currentUserSend === messengers[i].messages[messengers[i].messages.length - 1].sender;
                    if (!isMeSend && messengers[i].check === false)
                        notSeen++;
                }
            }

            if (carts)
                lengthCarts = carts.length;
        }


        return (
            <Tab.Navigator
                initialRouteName="Trang chủ"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Trang chủ') {
                            iconName = focused
                                ? 'home'
                                : 'home-outline';
                        } else if (route.name === 'Đăng nhập') {
                            iconName = focused ? 'log-in' : 'log-in-outline';
                        }
                        else if (route.name === 'Thông báo') {
                            iconName = focused ? 'notifications' : 'notifications-outline';
                        }
                        else if (route.name === 'Giỏ hàng') {
                            iconName = focused ? 'cart' : 'cart-outline';
                        }
                        else if (route.name === 'Cá nhân') {
                            iconName = focused ? 'person' : 'person-outline';
                        }
                        else if (route.name === 'Nhắn tin') {
                            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray'
                }}
            >
                <Tab.Screen name="Trang chủ" component={HomeScreen} />
                {userInfo ? <Tab.Screen name="Giỏ hàng" options={lengthCarts > 0 ? { tabBarBadge: lengthCarts } : null} component={CartsScreen} /> : null}
                {userInfo ? <Tab.Screen name="Nhắn tin" options={notSeen > 0 ? { tabBarBadge: notSeen }: null} component={ListMessengerScreen} /> : null}
                {userInfo ? <Tab.Screen name="Thông báo" options={count > 0 ? { tabBarBadge: count }: null} component={NotificationsScreen} /> : null}
                <Tab.Screen name={userInfo ? "Cá nhân" : "Đăng nhập"} component={PersonalScreen} />
            </Tab.Navigator>
        );
    }
};


const mapStateToProps = state => {
    return {
        userInfoReducer: state.userInfoReducer,
        notificationsReducer: state.notificationsReducer,
        cartsReducer: state.cartsReducer,
        messengersReducer: state.messengersReducer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        initial: (userInfo, asscessToken) => {
            dispatch(initial(userInfo, asscessToken))
        },
        fectchNotifications: (pageSize) => dispatch(fectchNewNotificationsRequest(pageSize, 1))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(HomeTabScreen));
