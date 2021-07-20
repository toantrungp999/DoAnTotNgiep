import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MessengerItem from './components/MessengerItem';
import { createNewMessage, openDetailMessenger } from '../../../actions/messengerActions';

class ListMessengerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
        };
    }

    onSearch = (value) => {
        this.setState({
            searchValue: value
        });
    };

    createNewMessage = () => {
        this.props.navigation.push('createMessengerScreen');
    }

    openDetailMessenger = (index, to) => {
        this.props.openDetailMessenger(index, to);
        this.props.navigation.push('detailMessengerScreen');
    }

    render() {

        const { messengers } = this.props.messengersReducer;
        const { userInfo } = this.props.userInfoReducer;
        const messengerItems = messengers?.map((messenger, index) => {

            let currentUserSend = messenger.user1._id === userInfo._id ? 'user1' : 'user2';
            let isMeSend = currentUserSend === messenger.messages[messenger.messages.length - 1].sender;
            // if (!isMeSend && messenger.check === false)
            //     notSeen++;
            return <MessengerItem index={index} currentUserSend={currentUserSend} isMeSend={isMeSend} key={messenger._id} messenger={messenger} openDetailMessenger={this.openDetailMessenger} userId={userInfo._id} />
        }) || null;

        return (
            <View style={styles.messengerScren}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tin nhắn</Text>
                    <TouchableOpacity onPress={this.createNewMessage}><MaterialIcons style={styles.createMessengerIcon} name='create' size={28} color='black' /></TouchableOpacity>
                </View>
                <SearchBar
                    round
                    lightTheme
                    searchIcon={{ size: 24 }}
                    onChangeText={(text) => this.onSearch(text)}
                    onClear={() => this.onSearch('')}
                    placeholder="Tìm kiếm..."
                    value={this.state.searchValue}
                />
                <ScrollView style={{ width: '100%' }}>

                    {messengerItems}

                </ScrollView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    messengerScren: {
        width: '100%',
        height: '100%',
        padding: 5
    },
    title: {
        fontSize: 24,
        fontWeight: "900",
    },
    bottomView: {
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
    },
    createMessengerIcon: {
    },
    messengerItem: {
        flexDirection: 'row', width: '100%', padding: 6,
    },
    name: {
        fontSize: 18,
        fontWeight: "600"
    },
    messengerContent: {
        marginLeft: 12,
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: '300'
    },
    messengerValue: {
        flexDirection: 'row', marginTop: 3
    },
    header: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%',
        padding: 8
    },
    bottom: {
        flexDirection: 'row', width: '100%',
        marginTop: 4, justifyContent: 'center',
        marginBottom: 50
    }
})

const mapStateToProps = state => {
    return {
        userInfoReducer: state.userInfoReducer,
        messengersReducer: state.messengersReducer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        createNewMessage: () => dispatch(createNewMessage()),
        openDetailMessenger: (index, to) => dispatch(openDetailMessenger(index, to))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMessengerScreen);
